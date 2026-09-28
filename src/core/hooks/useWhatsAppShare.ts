import { useCallback } from 'react';
import { getLang } from '../../i18n';

/**
 * WhatsApp share hook: generates the formatted JantaX share card.
 * Copies to clipboard and opens WhatsApp API link.
 */

interface ShareData {
  pinCode: string;
  titleHindi: string;
  titleEnglish: string;
  claimLabel: string;
  claimLabelHindi: string;
  realityLabel: string;
  realityLabelHindi: string;
  responsiblePerson: string;
  responsibleOrg: string;
  sourceUrl: string;
  moduleNameHindi: string;
}

export function useWhatsAppShare() {
  // The card is written in the reader's language: one language per message, as on the page.
  const generateCard = useCallback((data: ShareData): string => {
    const link = `https://jantax.in/pin/${data.pinCode}`;
    if (getLang() === 'hi') {
      return [
        `*${data.moduleNameHindi} · JantaX रिपोर्ट*`,
        ``,
        `📍 *पिन कोड:* ${data.pinCode}`,
        `📋 *${data.titleHindi}*`,
        ``,
        `📈 *सरकारी दावा:* ${data.claimLabelHindi}`,
        `👁️ *ज़मीनी हकीकत:* ${data.realityLabelHindi}`,
        `👤 *ज़िम्मेदार:* ${data.responsiblePerson}, ${data.responsibleOrg}`,
        ``,
        `🔗 *स्रोत:* ${data.sourceUrl}`,
        `🔎 *JantaX:* ${link}`,
      ].join('\n');
    }
    return [
      `*JantaX report*`,
      ``,
      `📍 *PIN code:* ${data.pinCode}`,
      `📋 *${data.titleEnglish}*`,
      ``,
      `📈 *Official claim:* ${data.claimLabel}`,
      `👁️ *Ground reality:* ${data.realityLabel}`,
      `👤 *Responsible:* ${data.responsiblePerson}, ${data.responsibleOrg}`,
      ``,
      `🔗 *Source:* ${data.sourceUrl}`,
      `🔎 *JantaX:* ${link}`,
    ].join('\n');
  }, []);

  const share = useCallback((data: ShareData) => {
    const card = generateCard(data);

    // Copy to clipboard
    navigator.clipboard.writeText(card).catch(() => {
      // Fallback: create temporary textarea
      const ta = document.createElement('textarea');
      ta.value = card;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });

    // Open WhatsApp with prefilled message
    const encodedCard = encodeURIComponent(card);
    window.open(`https://api.whatsapp.com/send?text=${encodedCard}`, '_blank');

    return card;
  }, [generateCard]);

  return { share, generateCard };
}
