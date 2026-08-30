import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';
import { Layers } from 'lucide-react';

interface SandCalculatorProps {
  unitSystem: UnitSystem;
}

export const SandCalculator: React.FC<SandCalculatorProps> = ({ unitSystem }) => {
  const [sandType, setSandType] = useState<string>('paver_sand');
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(10);
  const [depthInches, setDepthInches] = useState<number>(1);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [pricePerTon, setPricePerTon] = useState<number>(45);

  const isMetric = unitSystem === 'metric';
  const lengthFt = isMetric ? length * 3.28084 : length;
  const widthFt = isMetric ? width * 3.28084 : width;
  const depthFt = (isMetric ? depthInches / 2.54 : depthInches) / 12;

  const sqFt = lengthFt * widthFt;
  const rawCuFt = sqFt * depthFt;
  const totalCuFt = rawCuFt * (1 + wastePercent / 100);
  const totalCuYds = totalCuFt / 27;

  // Concrete Sand ~2,700 lbs/yd³ (1.35 tons/yd³)
  const totalLbs = totalCuYds * 2700;
  const totalTons = totalLbs / 2000;
  const totalCost = totalTons * pricePerTon;

  const bags50lb = Math.ceil(totalLbs / 50);

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Paver & Bedding Material
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Construction Sand & Paver Bedding Calculator
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Calculate cubic yards, tons, and 50lb bags of washed concrete sand, masonry sand, polymeric joint sand, and above-ground pool sand beddings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Sand Application</label>
          <select
            value={sandType}
            onChange={(e) => setSandType(e.target.value)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          >
            <option value="paver_sand">Paver Bedding Sand (1" Layer)</option>
            <option value="mason_sand">Fine Masonry Sand (Mortar & Stucco)</option>
            <option value="play_sand">Playground & Sandbox Sand</option>
            <option value="pool_sand">Above-Ground Pool Base (2" Layer)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Length ({isMetric ? 'm' : 'ft'})</label>
          <input
            type="number"
            value={length || ''}
            onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Width ({isMetric ? 'm' : 'ft'})</label>
          <input
            type="number"
            value={width || ''}
            onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#003865] mb-1">Depth ({isMetric ? 'cm' : 'inches'})</label>
          <input
            type="number"
            value={depthInches || ''}
            onChange={(e) => setDepthInches(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-sm font-semibold text-[#003865] focus:outline-none transition-colors"
          />
          <div className="text-[10px] text-[#828892] mt-1">Paver bedding is strictly 1" uncompacted</div>
        </div>
      </div>

      {/* Results */}
      <div className="pt-5 border-t border-[#E2DCB9] space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#003865] rounded-xl p-4 text-center text-white shadow-xs border border-[#002b4d]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FBAF3C]">Cubic Yards</div>
            <div className="text-3xl font-bold font-mono mt-1 text-white tracking-tight">
              {formatNumber(totalCuYds, 2)} <span className="text-sm font-normal text-[#EFE6C8]">yd³</span>
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">{formatNumber(sqFt, 0)} sq ft area</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Total Tonnage</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {formatNumber(totalTons, 2)} <span className="text-sm font-normal text-[#828892]">Tons</span>
            </div>
            <div className="text-[10px] text-[#828892] mt-1">{Math.round(totalLbs).toLocaleString()} lbs</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">50 lb Bags</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {bags50lb.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">Retail store bags</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Estimated Cost</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#1BB954] tracking-tight">
              {formatCurrency(totalCost)}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">At ${pricePerTon}/ton bulk</div>
          </div>
        </div>
      </div>
    </div>
  );
};
