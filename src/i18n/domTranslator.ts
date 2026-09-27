import { lookupHindi } from './index';

/**
 * Applies the Hindi dictionary to the rendered page and keeps it applied as React updates it.
 *
 * - Text is translated as whole sentences: when an element's children are all text nodes (React
 *   renders `Showing {n} of {total} records` as five of them), the joined text is looked up once,
 *   so Hindi word order is possible. Otherwise each text node is looked up on its own.
 * - The English each node last received from React is remembered, so re-renders, which write
 *   English again, are translated again, and a count changing inside a sentence re-translates it.
 * - Anything inside [translate="no"] (record values, code, the map attribution) is left alone.
 * - Strings with no Hindi yet are collected in `missing` for the coverage check and for translators.
 */

const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
const SKIP = 'script,style,noscript,template,code,pre,textarea,svg[aria-hidden="true"],[translate="no"],[contenteditable="true"]';
const LATIN = /[A-Za-z]/;
const NUMBER = /\d[\d,]*(?:\.\d+)?/g;

type Written = { original: string; written: string };
const textState = new WeakMap<Text, Written>();
const attrState = new WeakMap<Element, Map<string, Written>>();

export const missing = new Set<string>();
let observer: MutationObserver | null = null;

const shape = (s: string) => {
  let i = 0;
  return s.replace(/\s+/g, ' ').trim().replace(NUMBER, () => `{${i++}}`);
};

function note(english: string) {
  if (LATIN.test(english)) missing.add(shape(english));
}

/** Put the translation between the original's leading and trailing whitespace. */
function wrap(original: string, hindi: string) {
  const lead = original.match(/^\s*/)![0];
  const trail = original.match(/\s*$/)![0];
  return lead + hindi + trail;
}

function originalOf(node: Text) {
  const s = textState.get(node);
  return s && node.data === s.written ? s.original : node.data;
}

function write(node: Text, original: string, value: string) {
  if (node.data !== value) node.data = value;
  textState.set(node, { original, written: value });
}

/** Translate an element whose children are only text nodes as one sentence. Returns false if it does not apply. */
function translateSentence(parent: Element): boolean {
  const kids = parent.childNodes;
  if (kids.length < 2) return false;
  const texts: Text[] = [];
  for (const k of kids) {
    if (k.nodeType !== Node.TEXT_NODE) return false;
    texts.push(k as Text);
  }
  const originals = texts.map(originalOf);
  const joined = originals.join('');
  if (!LATIN.test(joined)) return true;
  const hindi = lookupHindi(joined);
  if (hindi === null) {
    note(joined);
    // Keep the English React wrote, in case an earlier render had been translated.
    texts.forEach((n, i) => write(n, originals[i], originals[i]));
    return true;
  }
  texts.forEach((n, i) => write(n, originals[i], i === 0 ? wrap(joined, hindi) : ''));
  return true;
}

function translateText(node: Text) {
  const parent = node.parentElement;
  if (!parent || parent.closest(SKIP)) return;
  if (translateSentence(parent)) return;
  const original = originalOf(node);
  if (!LATIN.test(original)) return;
  const hindi = lookupHindi(original);
  if (hindi === null) {
    note(original);
    return;
  }
  write(node, original, wrap(original, hindi));
}

function translateAttr(el: Element, name: string) {
  const value = el.getAttribute(name);
  if (value === null || el.closest(SKIP)) return;
  let states = attrState.get(el);
  const prev = states?.get(name);
  const original = prev && value === prev.written ? prev.original : value;
  if (!LATIN.test(original)) return;
  const hindi = lookupHindi(original);
  if (hindi === null) {
    note(original);
    return;
  }
  if (!states) attrState.set(el, (states = new Map()));
  states.set(name, { original, written: hindi });
  if (value !== hindi) el.setAttribute(name, hindi);
}

function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return translateText(root as Text);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);
  texts.forEach(translateText);
  const withAttrs = [el, ...el.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(','))];
  for (const e of withAttrs) for (const a of ATTRS) if (e.hasAttribute(a)) translateAttr(e, a);
}

export function startTranslator(root: Node = document.documentElement) {
  stopTranslator();
  translateTree(root);
  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') m.addedNodes.forEach(translateTree);
      else if (m.type === 'characterData') {
        const node = m.target as Text;
        if (textState.get(node)?.written !== node.data) translateText(node);
      } else if (m.type === 'attributes' && m.attributeName) {
        const el = m.target as Element;
        if (attrState.get(el)?.get(m.attributeName)?.written !== el.getAttribute(m.attributeName)) translateAttr(el, m.attributeName);
      }
    }
  });
  observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
}

export function stopTranslator() {
  observer?.disconnect();
  observer = null;
}

declare global {
  interface Window {
    __jantaxI18n?: { missing: () => string[]; clear: () => void };
  }
}
if (typeof window !== 'undefined') {
  window.__jantaxI18n = { missing: () => [...missing].sort(), clear: () => missing.clear() };
}
