import React from 'react';

export const ColorStrip: React.FC = () => {
  return (
    <div className="h-1.5 w-full flex select-none" id="color-strip">
      <div className="h-full flex-1 bg-[#003865]" title="Deep Construction Navy" />
      <div className="h-full flex-1 bg-[#1BB954]" title="Vibrant Green" />
      <div className="h-full flex-1 bg-[#FBAF3C]" title="Warm Amber Yellow" />
      <div className="h-full flex-1 bg-[#EFE6C8]" title="Sand Cream" />
      <div className="h-full flex-1 bg-[#FAF8F2]" title="Crisp Off-White" />
      <div className="h-full flex-1 bg-[#828892]" title="Slate Gray" />
      <div className="h-full flex-1 bg-[#2C3138]" title="Charcoal Dark Slate" />
    </div>
  );
};


