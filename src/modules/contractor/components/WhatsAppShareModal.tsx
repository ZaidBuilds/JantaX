import React, { useState } from 'react';
import { Share2, Copy, Check, X, ExternalLink, ShieldAlert, FileSpreadsheet, MapPin } from 'lucide-react';
import { WhatsAppCardData, Language } from '../types';
import { getTranslation } from '../translations';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: WhatsAppCardData | null;
  language: Language;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  cardData,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !cardData) return null;

  // Generate formatted WhatsApp message
  const generateWhatsAppMessage = () => {
    return `🚨 *CIVIC AUDIT ALERT • PIN: ${cardData.pincode}*
📍 *Location:* ${cardData.roadName}, ${cardData.wardName}, ${cardData.city}

💰 *Sanctioned Public Funds:* ${cardData.sanctionedAmount}
🏢 *Named Contractor:* ${cardData.contractorName}
👥 *Company Directors:* ${cardData.contractorDirectors}
👷‍♂️ *Executive Engineer (EE):* ${cardData.executiveEngineer}
🏛️ *Local MLA / Rep:* ${cardData.electedRep}

📋 *GOVERNMENT CLAIM / MEASUREMENT BOOK:*
${cardData.officialClaim}

⚠️ *GROUND TRUTH REALITY:*
${cardData.groundReality}

📉 *Discrepancy / Deficit:* ${cardData.discrepancyNumber}
📑 *CAG & Audit Proof:* ${cardData.cagOrDocProof}
🔗 *Verify Official e-Procurement Record:* ${cardData.proofUrl}

_Generated via NagarScorecard · Open Defect Liability & Civic Intelligence Platform._`;
  };

  const formattedMessage = generateWhatsAppMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppSend = () => {
    const encoded = encodeURIComponent(formattedMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-2 border rounded-[10px] border-line max-w-xl w-full max-h-[90vh] flex flex-col shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line bg-surface">
          <div className="flex items-center gap-2">
            <span className="bg-[var(--good-solid)] text-white p-1.5 rounded-none text-xs font-bold flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>WHATSAPP SHARE UNIT</span>
            </span>
            <span className="text-xs font-bold text-ink">PIN {cardData.pincode}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-3 text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          <p className="text-xs text-ink-2">
            {getTranslation(language, 'subheadingClaimVsReality')}
          </p>

          {/* High-Contrast Card Visual Preview */}
          <div className="border rounded-[10px] border-line bg-surface p-5 space-y-3 font-sans relative">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-bad" />
                <span className="font-bold text-sm text-ink">
                  PIN {cardData.pincode} • {cardData.wardName}
                </span>
              </div>
              <span className="bg-[var(--bad-solid)] text-white text-xs font-bold px-2 py-0.5">
                {cardData.discrepancyNumber} DEFICIT
              </span>
            </div>

            {/* Road Name & Amount */}
            <div>
              <h3 className="text-base font-bold text-ink">
                {cardData.roadName}
              </h3>
              <p className="text-xs font-bold text-bad mt-0.5">
                Sanctioned Public Funds: {cardData.sanctionedAmount}
              </p>
            </div>

            {/* Named Contractor & Officer Box */}
            <div className="bg-surface-2 border rounded-[10px] border-line p-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-xs opacity-70">Contractor:</span>
                <span className="font-bold text-ink text-right">{cardData.contractorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs opacity-70">Directors:</span>
                <span className="text-xs text-ink text-right">{cardData.contractorDirectors}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-1">
                <span className="text-xs opacity-70">Executive Engr:</span>
                <span className="font-bold text-ink text-right">{cardData.executiveEngineer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs opacity-70">Local MLA:</span>
                <span className="font-bold text-ink text-right">{cardData.electedRep}</span>
              </div>
            </div>

            {/* Claim vs Reality Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-info-soft/60 border rounded-[10px] border-blue-900/20 p-2.5">
                <div className="font-bold text-xs text-info mb-1">
                  🏛️ Official Claim
                </div>
                <p className="text-xs leading-relaxed text-ink">
                  {cardData.officialClaim}
                </p>
              </div>

              <div className="bg-bad-soft border rounded-[10px] border-red-900/20 p-2.5">
                <div className="font-bold text-xs text-bad mb-1">
                  ⚠️ Ground Reality
                </div>
                <p className="text-xs leading-relaxed text-ink">
                  {cardData.groundReality}
                </p>
              </div>
            </div>

            {/* Statutory Footnote */}
            <div className="text-xs text-ink-3 border-t border-line pt-2 flex items-center justify-between">
              <span>Ref: {cardData.cagOrDocProof}</span>
              <span className="text-bad font-bold">Section 166 Municipal Act</span>
            </div>

          </div>

          {/* Copy Confirmation Banner */}
          {copied && (
            <div className="p-2.5 bg-good-soft border rounded-[10px] border-emerald-500 text-good text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-good" />
              <span>{getTranslation(language, 'whatsAppCopySuccess')}</span>
            </div>
          )}

          {/* Raw Text Box */}
          <div>
            <label className="block text-xs font-bold text-ink-3 mb-1">
              Formatted WhatsApp Text (One Card Share Unit):
            </label>
            <textarea
              readOnly
              value={formattedMessage}
              rows={6}
              className="w-full bg-surface border rounded-[10px] border-line p-3 text-xs text-ink resize-none focus:outline-none"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-line bg-surface flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleWhatsAppSend}
            className="flex-1 bg-[var(--good-solid)] hover:opacity-90 text-white px-4 py-3 font-bold text-xs tracking-tight flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{getTranslation(language, 'btnShareWhatsApp')}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex-1 bg-[var(--surface-inverse)] hover:bg-black text-white px-4 py-3 font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : getTranslation(language, 'btnCopyWhatsAppCard')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
