import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';
import { CircleDot, Layers, ShieldCheck, Truck } from 'lucide-react';

interface FootingCalculatorProps {
  unitSystem: UnitSystem;
}

export const FootingCalculator: React.FC<FootingCalculatorProps> = ({ unitSystem }) => {
  const [footingType, setFootingType] = useState<'pier' | 'strip'>('pier');

  // Pier / Sonotube state
  const [pierDiameterInches, setPierDiameterInches] = useState<number>(12);
  const [pierDepthFeet, setPierDepthFeet] = useState<number>(4);
  const [pierQuantity, setPierQuantity] = useState<number>(6);
  const [includeBellBase, setIncludeBellBase] = useState<boolean>(true);
  const [bellDiameterInches, setBellDiameterInches] = useState<number>(20);

  // Strip Footing state
  const [stripLengthFeet, setStripLengthFeet] = useState<number>(40);
  const [stripWidthInches, setStripWidthInches] = useState<number>(18);
  const [stripDepthInches, setStripDepthInches] = useState<number>(12);

  const [wastePercent, setWastePercent] = useState<number>(10);
  const [pricePerYard, setPricePerYard] = useState<number>(145);

  let rawCuFt = 0;

  if (footingType === 'pier') {
    const radiusFt = pierDiameterInches / 24; // inches to radius in ft
    const pierColCuFt = Math.PI * Math.pow(radiusFt, 2) * pierDepthFeet;

    let bellCuFt = 0;
    if (includeBellBase) {
      const bellRadiusFt = bellDiameterInches / 24;
      // Truncated cone / bell bottom approximate volume (~10" deep)
      bellCuFt = Math.PI * Math.pow(bellRadiusFt, 2) * (10 / 12) * 0.75;
    }

    rawCuFt = (pierColCuFt + bellCuFt) * pierQuantity;
  } else {
    // Continuous strip footing
    const widthFt = stripWidthInches / 12;
    const depthFt = stripDepthInches / 12;
    rawCuFt = stripLengthFeet * widthFt * depthFt;
  }

  const totalCuFt = rawCuFt * (1 + wastePercent / 100);
  const totalCuYds = totalCuFt / 27;
  const totalLbs = totalCuYds * 4050;
  const totalTons = totalLbs / 2000;
  const bags80lb = Math.ceil(totalLbs / 80);
  const bags60lb = Math.ceil(totalLbs / 60);
  const totalCost = totalCuYds * pricePerYard;

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Structural Foundation Tool
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Concrete Footing, Sonotube & Pier Calculator
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Accurately calculate concrete volume and pre-mix bag counts for cylindrical deck post piers, sonotubes, flared big-foot bells, and continuous trench strip footings.
        </p>
      </div>

      {/* Type Switcher */}
      <div className="grid grid-cols-2 gap-2 bg-[#FAF8F2] p-1.5 rounded-xl border border-[#E2DCB9] text-xs">
        <button
          type="button"
          onClick={() => setFootingType('pier')}
          className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-semibold transition ${
            footingType === 'pier'
              ? 'bg-[#003865] text-white shadow-xs'
              : 'text-[#828892] hover:text-[#003865]'
          }`}
        >
          <CircleDot className="w-4 h-4" />
          <span>Cylindrical Deck Piers / Sonotubes</span>
        </button>
        <button
          type="button"
          onClick={() => setFootingType('strip')}
          className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-semibold transition ${
            footingType === 'strip'
              ? 'bg-[#003865] text-white shadow-xs'
              : 'text-[#828892] hover:text-[#003865]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Continuous Strip Foundation Trench</span>
        </button>
      </div>

      {footingType === 'pier' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C3138] mb-1">
                Sonotube / Hole Diameter (inches)
              </label>
              <select
                value={pierDiameterInches}
                onChange={(e) => setPierDiameterInches(parseInt(e.target.value) || 12)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              >
                <option value={8}>8" Sonotube (Light Deck / Mailbox)</option>
                <option value={10}>10" Sonotube (Standard Deck Pier)</option>
                <option value={12}>12" Sonotube (Heavy Deck / Porch)</option>
                <option value={16}>16" Sonotube (Commercial Column)</option>
                <option value={18}>18" Sonotube (Heavy Post)</option>
                <option value={24}>24" Sonotube (Structure Base)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#003865] mb-1">
                Depth Below Frost Line (feet)
              </label>
              <input
                type="number"
                step="0.5"
                value={pierDepthFeet || ''}
                onChange={(e) => setPierDepthFeet(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-sm font-semibold text-[#003865] focus:outline-none transition-colors"
                placeholder="e.g. 4"
              />
              <div className="text-[10px] text-[#828892] mt-1">Typical: 3–4 ft depending on state frost code</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C3138] mb-1">
                Number of Piers (Quantity)
              </label>
              <input
                type="number"
                min="1"
                value={pierQuantity || 1}
                onChange={(e) => setPierQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#003865] cursor-pointer">
              <input
                type="checkbox"
                checked={includeBellBase}
                onChange={(e) => setIncludeBellBase(e.target.checked)}
                className="w-4 h-4 accent-[#003865] rounded"
              />
              <span>Include Flared "Big-Foot" Footing Bell Base (Prevents Frost Heave)</span>
            </label>
            {includeBellBase && (
              <select
                value={bellDiameterInches}
                onChange={(e) => setBellDiameterInches(parseInt(e.target.value) || 20)}
                className="bg-white border border-[#E2DCB9] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#003865] focus:border-[#003865] focus:outline-none transition-colors"
              >
                <option value={18}>18" Bell Base</option>
                <option value={20}>20" Bell Base</option>
                <option value={24}>24" Bell Base</option>
                <option value={28}>28" Bell Base</option>
              </select>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2C3138] mb-1">
              Total Trench Length (feet)
            </label>
            <input
              type="number"
              value={stripLengthFeet || ''}
              onChange={(e) => setStripLengthFeet(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              placeholder="e.g. 40"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#2C3138] mb-1">
              Trench Width (inches)
            </label>
            <input
              type="number"
              value={stripWidthInches || ''}
              onChange={(e) => setStripWidthInches(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              placeholder="e.g. 18"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#003865] mb-1">
              Trench Depth / Thickness (inches)
            </label>
            <input
              type="number"
              value={stripDepthInches || ''}
              onChange={(e) => setStripDepthInches(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-sm font-semibold text-[#003865] focus:outline-none transition-colors"
              placeholder="e.g. 12"
            />
          </div>
        </div>
      )}

      {/* Results */}
      <div className="pt-5 border-t border-[#E2DCB9] space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#003865] rounded-xl p-4 text-center text-white shadow-xs border border-[#002b4d]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FBAF3C]">Total Concrete</div>
            <div className="text-3xl font-bold font-mono mt-1 text-white tracking-tight">
              {formatNumber(totalCuYds, 2)} <span className="text-sm font-normal text-[#EFE6C8]">yd³</span>
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">{formatNumber(totalCuFt, 1)} cu ft</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">80 lb Bags Total</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {bags80lb.toLocaleString()}
            </div>
            {footingType === 'pier' && (
              <div className="text-[10px] text-[#828892] mt-1">
                ~{Math.ceil(bags80lb / pierQuantity)} bags per pier hole
              </div>
            )}
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Weight in Tons</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {formatNumber(totalTons, 2)}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">{Math.round(totalLbs).toLocaleString()} lbs</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Estimated Cost</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#1BB954] tracking-tight">
              {formatCurrency(totalCost)}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">At ${pricePerYard}/yd³</div>
          </div>
        </div>
      </div>
    </div>
  );
};
