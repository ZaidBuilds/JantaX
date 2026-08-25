import { useCallback } from 'react';

/**
 * WhatsApp share hook — generates the formatted JanCheck share card.
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
  const generateCard = useCallback((data: ShareData): string => {
    return [
      `🚨 *${data.moduleNameHindi} — JanCheck रिपोर्ट* 🚨`,
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
      `— JanCheck (जनचेक) | "Pin code dalo, hisaab lo"`,
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
