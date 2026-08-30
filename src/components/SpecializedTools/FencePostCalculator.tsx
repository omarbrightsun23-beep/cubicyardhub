import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';
import { ShieldCheck } from 'lucide-react';

interface FencePostCalculatorProps {
  unitSystem: UnitSystem;
}

export const FencePostCalculator: React.FC<FencePostCalculatorProps> = ({ unitSystem }) => {
  const [postCount, setPostCount] = useState<number>(15);
  const [postSize, setPostSize] = useState<'4x4' | '6x6' | 'round_2_38' | 'round_3'>('4x4');
  const [holeDiameterInches, setHoleDiameterInches] = useState<number>(10);
  const [holeDepthInches, setHoleDepthInches] = useState<number>(36);
  const [gravelBaseInches, setGravelBaseInches] = useState<number>(4);
  const [bagSize, setBagSize] = useState<50 | 60 | 80>(50);
  const [pricePerBag, setPricePerBag] = useState<number>(6.50);

  // Post dimension volume deduction
  let postWidthInches = 3.5;
  let postLengthInches = 3.5;
  if (postSize === '6x6') {
    postWidthInches = 5.5;
    postLengthInches = 5.5;
  } else if (postSize === 'round_2_38') {
    postWidthInches = 2.375;
    postLengthInches = 2.375;
  } else if (postSize === 'round_3') {
    postWidthInches = 3.0;
    postLengthInches = 3.0;
  }

  // Effective concrete height inside hole
  const concreteDepthInches = Math.max(0, holeDepthInches - gravelBaseInches);
  const holeRadiusFt = (holeDiameterInches / 2) / 12;
  const concreteDepthFt = concreteDepthInches / 12;

  // Cylinder hole volume in cu ft
  const holeVolumeCuFt = Math.PI * Math.pow(holeRadiusFt, 2) * concreteDepthFt;

  // Post volume deduction in cu ft
  let postVolumeCuFt = 0;
  if (postSize === '4x4' || postSize === '6x6') {
    postVolumeCuFt = (postWidthInches / 12) * (postLengthInches / 12) * concreteDepthFt;
  } else {
    const postRadiusFt = (postWidthInches / 2) / 12;
    postVolumeCuFt = Math.PI * Math.pow(postRadiusFt, 2) * concreteDepthFt;
  }

  // Net concrete needed per post hole
  const netCuFtPerHole = Math.max(0, holeVolumeCuFt - postVolumeCuFt);
  const netLbsPerHole = (netCuFtPerHole / 27) * 4050;

  const bagsPerHole = Math.ceil(netLbsPerHole / bagSize);
  const totalBags = bagsPerHole * postCount;
  const totalCuYards = (netCuFtPerHole * postCount) / 27;
  const totalCost = totalBags * pricePerBag;

  // Drainage gravel under posts (6" gravel base)
  const gravelBaseCuFt = Math.PI * Math.pow(holeRadiusFt, 2) * (gravelBaseInches / 12) * postCount;
  const gravelBags50lb = Math.ceil((gravelBaseCuFt / 27 * 2800) / 50);

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Post Hole & Fast-Setting Mix Engine
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Fence Post Concrete & Hole Calculator
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Calculate the exact number of 50lb, 60lb, or 80lb fast-setting concrete bags per hole for wooden, chain-link, and vinyl fences with drainage gravel base deductions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Number of Fence Posts</label>
          <input
            type="number"
            min="1"
            value={postCount || ''}
            onChange={(e) => setPostCount(parseInt(e.target.value) || 1)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Post Size & Material</label>
          <select
            value={postSize}
            onChange={(e) => setPostSize(e.target.value as any)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          >
            <option value="4x4">Standard 4" × 4" Wood Post (3.5" act.)</option>
            <option value="6x6">Heavy 6" × 6" Wood Post (5.5" act.)</option>
            <option value="round_2_38">2-3/8" Steel Pipe (Chain Link Terminal)</option>
            <option value="round_3">3" Commercial Round Steel Post</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Concrete Bag Packaging</label>
          <select
            value={bagSize}
            onChange={(e) => setBagSize(parseInt(e.target.value) as any)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          >
            <option value={50}>50 lb Fast-Setting (No-Mix Quikrete)</option>
            <option value={60}>60 lb Standard Pre-Mix</option>
            <option value={80}>80 lb Heavy Mix</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 sm:p-5">
        <div>
          <label className="block text-xs font-semibold text-[#003865] mb-1">
            Hole Diameter (inches)
          </label>
          <select
            value={holeDiameterInches}
            onChange={(e) => setHoleDiameterInches(parseInt(e.target.value) || 10)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#003865] focus:border-[#003865] focus:outline-none transition-colors"
          >
            <option value={8}>8" Diameter (Rule: 2× post size)</option>
            <option value={10}>10" Diameter (Rule: 3× post size - Rec.)</option>
            <option value={12}>12" Diameter (Heavy Gate / Corner Post)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#003865] mb-1">
            Total Hole Depth (inches)
          </label>
          <input
            type="number"
            value={holeDepthInches || ''}
            onChange={(e) => setHoleDepthInches(parseInt(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#003865] focus:border-[#003865] focus:outline-none transition-colors"
            placeholder="36"
          />
          <div className="text-[10px] text-[#828892] mt-1">Rule of thumb: 1/3 to 1/2 of post height</div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#003865] mb-1">
            Bottom Gravel Bed (inches)
          </label>
          <select
            value={gravelBaseInches}
            onChange={(e) => setGravelBaseInches(parseInt(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#003865] focus:border-[#003865] focus:outline-none transition-colors"
          >
            <option value={0}>0" (No drainage base)</option>
            <option value={3}>3" Pea Gravel / Crushed Stone</option>
            <option value={4}>4" Gravel Bed (Prevents Rot - Rec.)</option>
            <option value={6}>6" Gravel Bed (Wet Soils)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="pt-5 border-t border-[#E2DCB9] space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#003865] rounded-xl p-4 text-center text-white shadow-xs border border-[#002b4d]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FBAF3C]">Bags per Hole</div>
            <div className="text-3xl font-bold font-mono mt-1 text-white tracking-tight">
              {bagsPerHole} <span className="text-sm font-normal text-[#EFE6C8]">Bags</span>
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">{bagSize} lb bag size</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Total Bags to Buy</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {totalBags.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">For {postCount} post holes</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Drainage Gravel</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {gravelBags50lb} <span className="text-sm font-normal text-[#828892]">Bags</span>
            </div>
            <div className="text-[10px] text-[#828892] mt-1">50 lb crushed stone bags</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Estimated Cost</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#1BB954] tracking-tight">
              {formatCurrency(totalCost)}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">At ${pricePerBag}/bag</div>
          </div>
        </div>
      </div>
    </div>
  );
};
