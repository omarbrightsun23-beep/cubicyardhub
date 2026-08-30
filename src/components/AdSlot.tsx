import React from 'react';

interface AdSlotProps {
  slotId?: string;
  adClient?: string;
  adFormat?: 'auto' | 'horizontal' | 'rectangle';
  label?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = '1234567890',
  adClient = 'ca-pub-XXXXXXXXXXXXXXXX',
  adFormat = 'auto',
  label = 'Advertisement',
  className = ''
}) => {
  return (
    <div className={`max-w-5xl mx-auto px-3 sm:px-6 my-8 ${className}`}>
      <div className="bg-white border border-[#E2DCB9] rounded-2xl p-3 sm:p-4 text-center shadow-xs overflow-hidden">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#828892] mb-2 px-1">
          <span>{label}</span>
          <span>Google Ad</span>
        </div>

        {/* Ad Container Box */}
        <div className="min-h-[90px] sm:min-h-[100px] md:min-h-[120px] bg-[#FAF8F2] border border-dashed border-[#E2DCB9] rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* AdSense ins tag placeholder - Ready for Google AdSense activation */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '90px' }}
            data-ad-client={adClient}
            data-ad-slot={slotId}
            data-ad-format={adFormat}
            data-full-width-responsive="true"
          />

          {/* Fallback Visual Layout when AdSense script isn't loaded */}
          <div className="pointer-events-none flex flex-col items-center justify-center space-y-1 text-[#828892]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E2DCB9] text-[10px] font-semibold text-[#003865]">
              Google AdSense Space ({adFormat.toUpperCase()})
            </div>
            <p className="text-[11px] text-[#828892]">
              Responsive Ad Unit Slot #{slotId} &bull; 728x90 Leaderboard / 970x250 Billboard / Mobile Banner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
