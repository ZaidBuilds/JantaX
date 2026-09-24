import { useCallback } from 'react';

/**
 * WhatsApp share hook — generates formatted JantaX share cards.
 * Copies to clipboard and opens WhatsApp API link.
 */

export interface StructuredShareData {
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

export interface SimpleShareData {
  title?: string;
  text: string;
  url?: string;
  pinCode?: string;
}

export type AnyShareData = StructuredShareData | SimpleShareData;

function isStructuredShare(data: AnyShareData): data is StructuredShareData {
  return 'titleHindi' in data && 'claimLabel' in data;
}

export function useWhatsAppShare() {
  const generateCard = useCallback((data: AnyShareData): string => {
    if (isStructuredShare(data)) {
      return [
        `🚨 *${data.moduleNameHindi} — JantaX रिपोर्ट* 🚨`,
        ``,
        `📍 *पिन कोड:* ${data.pinCode}`,
        `📋 *${data.titleHindi}*`,
        `   ${data.titleEnglish}`,
        ``,
        `📈 *सरकारी दावा:* ${data.claimLabelHindi}`,
        `   Official Claim: ${data.claimLabel}`,
        ``,
        `👁️ *जमीनी हकीकत:* ${data.realityLabelHindi}`,
        `   Ground Reality: ${data.realityLabel}`,
        ``,
        `👤 *ज़िम्मेदार:* ${data.responsiblePerson}`,
        `   ${data.responsibleOrg}`,
        ``,
        `🔗 *सत्यापन:* ${data.sourceUrl}`,
        ``,
        `— JantaX | "India, Explained by Where You Live"`,
      ].join('\n');
    }

    const lines: string[] = [];
    if (data.title) {
      lines.push(`🚨 *${data.title}* 🚨`, ``);
    }
    lines.push(data.text);
    if (data.url) {
      lines.push(``, `🔗 *View Live on JantaX:* ${data.url}`);
    }
    lines.push(``, `— JantaX (जनताX) | Pin code dalo, hisaab lo`);
    return lines.join('\n');
  }, []);

  const share = useCallback(
    (data: AnyShareData) => {
      const card = generateCard(data);

      // Copy to clipboard
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(card).catch(() => {
          try {
            const ta = document.createElement('textarea');
            ta.value = card;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          } catch {}
        });
      }

      // Open WhatsApp with prefilled message
      const encodedCard = encodeURIComponent(card);
      if (typeof window !== 'undefined') {
        window.open(`https://api.whatsapp.com/send?text=${encodedCard}`, '_blank');
      }

      return card;
    },
    [generateCard]
  );

  return { share, generateCard };
}
