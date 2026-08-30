import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';

interface ConcreteBlockCalculatorProps {
  unitSystem: UnitSystem;
}

export const ConcreteBlockCalculator: React.FC<ConcreteBlockCalculatorProps> = ({ unitSystem }) => {
  const [wallLengthFt, setWallLengthFt] = useState<number>(30);
  const [wallHeightFt, setWallHeightFt] = useState<number>(6);
  const [blockType, setBlockType] = useState<'8x8x16' | '6x8x16' | '12x8x16'>('8x8x16');
  const [coreFillOption, setCoreFillOption] = useState<'none' | 'every_24' | 'solid'>('every_24');
  const [wastePercent, setWastePercent] = useState<number>(5);
  const [pricePerBlock, setPricePerBlock] = useState<number>(2.45);

  const isMetric = unitSystem === 'metric';
  const wallSqFt = (isMetric ? wallLengthFt * 3.28084 : wallLengthFt) * (isMetric ? wallHeightFt * 3.28084 : wallHeightFt);

  // Standard 8x8x16 block has a nominal face of 8" high x 16" long = 128 sq inches = 0.888 sq ft.
  // Blocks per sq ft = 1 / 0.888 = 1.125 blocks per sq ft.
  const rawBlocks = wallSqFt * 1.125;
  const totalBlocks = Math.ceil(rawBlocks * (1 + wastePercent / 100));

  // Mortar calculation: 1 standard 80lb bag of Type S or N mortar lays approximately 30 to 35 standard 8x8x16 blocks.
  const mortarBags80lb = Math.ceil(totalBlocks / 32);

  // Core Fill Grout Concrete:
  // Standard 8x8x16 CMU core volume is approximately 0.22 cu ft per block if 100% solid filled.
  let coreFillRatio = 0;
  if (coreFillOption === 'solid') coreFillRatio = 1.0;
  if (coreFillOption === 'every_24') coreFillRatio = 0.35; // Every 24" or 3rd core
  if (coreFillOption === 'none') coreFillRatio = 0;

  const coreFillCuYards = (totalBlocks * 0.22 * coreFillRatio * 1.10) / 27;

  const totalBlockCost = totalBlocks * pricePerBlock;
  const totalMortarCost = mortarBags80lb * 14.50;
  const totalCoreGroutCost = coreFillCuYards * 155.00;
  const estimatedTotalCost = totalBlockCost + totalMortarCost + totalCoreGroutCost;

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Masonry & Retaining Wall Estimator
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Concrete Block (CMU) & Mortar Wall Calculator
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Calculate the exact count of standard 8x8x16 CMU concrete blocks, Type S mortar bags, and core fill grout concrete needed for retaining walls and building foundations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">
            Wall Length ({isMetric ? 'meters' : 'feet'})
          </label>
          <input
            type="number"
            value={wallLengthFt || ''}
            onChange={(e) => setWallLengthFt(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">
            Wall Height ({isMetric ? 'meters' : 'feet'})
          </label>
          <input
            type="number"
            value={wallHeightFt || ''}
            onChange={(e) => setWallHeightFt(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">
            Block Dimension Preset
          </label>
          <select
            value={blockType}
            onChange={(e) => setBlockType(e.target.value as any)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          >
            <option value="8x8x16">Standard 8" × 8" × 16" CMU</option>
            <option value="6x8x16">6" × 8" × 16" Partition CMU</option>
            <option value="12x8x16">12" × 8" × 16" Foundation CMU</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 sm:p-5">
        <div>
          <label className="block text-xs font-semibold text-[#003865] mb-1">
            Core Grout Fill Reinforcement
          </label>
          <select
            value={coreFillOption}
            onChange={(e) => setCoreFillOption(e.target.value as any)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#003865] focus:border-[#003865] focus:outline-none transition-colors"
          >
            <option value="every_24">Every 24" O.C. (Reinforced Retaining Wall)</option>
            <option value="solid">100% Solid Grout Fill (Structural / Seismic)</option>
            <option value="none">Hollow / Unfilled (Non-Bearing Landscape Wall)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#003865] mb-1">
            Price per 8x8x16 CMU Block ($)
          </label>
          <input
            type="number"
            step="0.05"
            value={pricePerBlock || ''}
            onChange={(e) => setPricePerBlock(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#003865] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Results */}
      <div className="pt-5 border-t border-[#E2DCB9] space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#003865] rounded-xl p-4 text-center text-white shadow-xs border border-[#002b4d]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FBAF3C]">Total CMU Blocks</div>
            <div className="text-3xl font-bold font-mono mt-1 text-white tracking-tight">
              {totalBlocks.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">{formatNumber(wallSqFt, 0)} sq ft wall face</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Type S Mortar Bags (80lb)</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {mortarBags80lb.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">~32 blocks per bag</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Core Fill Grout</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {formatNumber(coreFillCuYards, 2)} <span className="text-sm font-normal text-[#828892]">yd³</span>
            </div>
            <div className="text-[10px] text-[#828892] mt-1">
              {coreFillOption === 'none' ? 'None (Hollow)' : `${Math.ceil(coreFillCuYards * 45)} 80lb bags`}
            </div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Est. Total Materials</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#1BB954] tracking-tight">
              {formatCurrency(estimatedTotalCost)}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">Blocks + Mortar + Grout</div>
          </div>
        </div>
      </div>
    </div>
  );
};
