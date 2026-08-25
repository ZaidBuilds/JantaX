import React from 'react';
import { 
  X, 
  ShieldAlert, 
  Scale, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border-2 border-[#1A1A1A] max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b-2 border-[#1A1A1A] flex items-start justify-between bg-[#FAFAFA]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#D43F33] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                Legal & Audit Framework
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-[#1A1A1A] mt-1">
              About Defect Liability & Contractor Attribution
            </h2>
            <p className="text-xs font-serif text-[#1A1A1A]/70 mt-1">
              Holding municipal infrastructure providers accountable through civic public audits.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs font-serif text-[#1A1A1A] overflow-y-auto max-h-[75vh] leading-relaxed">
          
          <div className="p-4 bg-[#FAFAFA] border-2 border-[#1A1A1A] space-y-1.5">
            <h3 className="font-sans font-black uppercase flex items-center gap-1.5 text-xs text-[#D43F33]">
              <ShieldAlert className="w-4 h-4" />
              The Accountability Gap in Traditional Pothole Portals
            </h3>
            <p className="text-xs">
              Apps like <em>IChangeMyCity</em> or municipal grievance portals let you complain about a pothole, but they treat every pothole as an anonymous incident. They do not reveal <strong>which company paved the road</strong>, whether the road is under a mandatory <strong>3-year warranty</strong>, or if the same contractor has won 80% of tenders in your ward despite recurring monsoon collapses.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-sans font-bold text-[#1A1A1A] uppercase text-xs tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#D43F33]" />
              What is Defect Liability Period (DLP)?
            </h4>
            <p>
              Under <strong>Indian Road Congress (IRC:SP:98-2020)</strong> and State Municipal Corporation Codes, contractors who pave public asphalt or concrete roads are legally bound by a <strong>36 to 60 month Defect Liability Period (DLP)</strong>.
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-[#1A1A1A]/90">
              <li><strong>Free Mandatory Repairs:</strong> Any pothole, surface stripping, or sinkhole appearing during DLP must be remilled and repaired by the contractor at their own cost within 7 to 15 days of notice.</li>
              <li><strong>Retention Money Security:</strong> Municipal corporations hold a 5% to 10% performance bank guarantee. If the contractor defaults on pothole repairs, this bank guarantee must be forfeited and the contractor blacklisted.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t-2 border-[#1A1A1A]/10">
            <h4 className="font-sans font-bold text-[#1A1A1A] uppercase text-xs tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-[#D43F33]" />
              Data Sources & Synthesis
            </h4>
            <p>
              This platform aggregates and cross-references data from:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-3 bg-[#FAFAFA] border-2 border-[#1A1A1A]">
                <strong className="text-[#1A1A1A] block font-bold uppercase mb-1">State e-Procurement</strong>
                <span className="font-serif">Tender award details, sanctioned budgets, and technical schedules.</span>
              </div>
              <div className="p-3 bg-[#FAFAFA] border-2 border-[#1A1A1A]">
                <strong className="text-[#1A1A1A] block font-bold uppercase mb-1">GeM & Work Orders</strong>
                <span className="font-serif">Actual completion certificates, bitumen grades, and engineer sign-offs.</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t-2 border-[#1A1A1A]/10">
            <h4 className="font-sans font-bold text-[#1A1A1A] uppercase text-xs tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D43F33]" />
              Citizen Action Powers
            </h4>
            <p>
              With 1 click, citizens and Resident Welfare Associations (RWAs) can:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-[#1A1A1A]/90">
              <li>File an RTI under Section 6(1) of the RTI Act 2005 demanding bitumen core-cut test reports.</li>
              <li>Demand withholding of final bills and invocation of bank guarantees.</li>
              <li>Table formal resolutions in monthly Ward Committee meetings.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[#1A1A1A] bg-[#FAFAFA] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#D43F33] text-white text-xs font-bold uppercase tracking-tight transition-colors shadow-sm"
          >
            Back to Audit Platform
          </button>
        </div>

      </div>
    </div>
  );
};
