import React, { useState } from 'react';
import { X, Copy, Check, Code2 } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [embedTheme, setEmbedTheme] = useState<'light' | 'compact'>('light');

  if (!isOpen) return null;

  const embedCode = `<iframe src="${window.location.origin}/" width="100%" height="780" frameborder="0" style="border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 4px 12px rgba(0,0,0,0.08);" title="Cubic Yard & Material Takeoff Calculator"></iframe><div style="font-size:11px;margin-top:6px;font-family:sans-serif;color:#64748B;"><a href="${window.location.origin}/" target="_blank" rel="noopener" style="color:#003865;font-weight:600;text-decoration:none;">Powered by CubicYardHub Material Calculator</a></div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#003865]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#E2DCB9]">
        <div className="bg-[#003865] text-white p-4 px-6 flex items-center justify-between border-b border-[#002b4d]">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#FBAF3C]" />
            <h3 className="font-bold text-sm sm:text-base">Embed Calculator Widget on Your Website</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-[#EFE6C8] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-[#2C3138]">
          <p className="leading-relaxed text-[#828892]">
            Embed our responsive, ad-free Cubic Yard & Material Takeoff Calculator widget directly on your contractor, quarry, landscaping, or masonry website.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#003865] mb-1.5">
              Copy HTML &lt;iframe&gt; Code:
            </label>
            <div className="relative">
              <textarea
                readOnly
                rows={5}
                value={embedCode}
                className="w-full bg-[#003865] text-[#EFE6C8] font-mono text-[11px] p-3 rounded-xl focus:outline-none select-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-[#E2DCB9] hover:bg-[#FAF8F2] text-[#2C3138] font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="bg-[#003865] hover:bg-[#002b4d] text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1BB954]" /> : <Copy className="w-3.5 h-3.5 text-[#FBAF3C]" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Embed Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
