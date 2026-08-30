import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';
import { Grid, ShieldAlert, Truck, Sparkles, Layers } from 'lucide-react';

interface SlabCalculatorProps {
  unitSystem: UnitSystem;
}

export const SlabCalculator: React.FC<SlabCalculatorProps> = ({ unitSystem }) => {
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(10);
  const [thicknessInches, setThicknessInches] = useState<number>(4);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [includeEdgeBeam, setIncludeEdgeBeam] = useState<boolean>(false);
  const [edgeWidthInches, setEdgeWidthInches] = useState<number>(12);
  const [edgeDepthInches, setEdgeDepthInches] = useState<number>(8);
  const [includeRebar, setIncludeRebar] = useState<boolean>(true);
  const [rebarSpacingInches, setRebarSpacingInches] = useState<number>(18);
  const [pricePerYard, setPricePerYard] = useState<number>(145);

  const isMetric = unitSystem === 'metric';

  // Math
  const lengthFt = isMetric ? length * 3.28084 : length;
  const widthFt = isMetric ? width * 3.28084 : width;
  const thicknessFt = (isMetric ? thicknessInches / 2.54 : thicknessInches) / 12;

  const slabSqFt = lengthFt * widthFt;
  let mainSlabCuFt = slabSqFt * thicknessFt;

  // Thickened edge beam calculations (perimeter beam)
  let edgeCuFt = 0;
  if (includeEdgeBeam) {
    const perimeterFt = 2 * (lengthFt + widthFt);
    const edgeWFt = edgeWidthInches / 12;
    const edgeExtraDFt = (edgeDepthInches - thicknessInches) / 12;
    if (edgeExtraDFt > 0) {
      edgeCuFt = perimeterFt * edgeWFt * edgeExtraDFt;
    }
  }

  const rawCuFt = mainSlabCuFt + edgeCuFt;
  const totalCuFt = rawCuFt * (1 + wastePercent / 100);
  const totalCuYds = totalCuFt / 27;
  const concreteDensityLbs = 4050; // lbs per cu yd
  const totalLbs = totalCuYds * concreteDensityLbs;
  const totalTons = totalLbs / 2000;
  const totalCost = totalCuYds * pricePerYard;

  // Rebar estimation (#4 1/2" bars at grid spacing)
  let rebarLinearFt = 0;
  let rebarPieces20ft = 0;
  if (includeRebar && rebarSpacingInches > 0) {
    const spacingFt = rebarSpacingInches / 12;
    const countAlongLength = Math.floor(widthFt / spacingFt) + 1;
    const countAlongWidth = Math.floor(lengthFt / spacingFt) + 1;
    rebarLinearFt = countAlongLength * lengthFt + countAlongWidth * widthFt;
    // Add 10% for lap splices
    rebarLinearFt *= 1.10;
    rebarPieces20ft = Math.ceil(rebarLinearFt / 20);
  }

  // Bags
  const bags80lb = Math.ceil(totalLbs / 80);
  const bags60lb = Math.ceil(totalLbs / 60);

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Foundation & Flatwork Spec
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Concrete Slab, Patio & Garage Floor Calculator
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Calculate cubic yards of ready-mix concrete, 80lb bag counts, rebar grid requirements, and thickened edge beams for patio and garage slabs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">
            Slab Length ({isMetric ? 'meters' : 'feet'})
          </label>
          <input
            type="number"
            value={length || ''}
            onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">
            Slab Width ({isMetric ? 'meters' : 'feet'})
          </label>
          <input
            type="number"
            value={width || ''}
            onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#003865] mb-1">
            Slab Thickness ({isMetric ? 'cm' : 'inches'})
          </label>
          <input
            type="number"
            value={thicknessInches || ''}
            onChange={(e) => setThicknessInches(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-sm font-semibold text-[#003865] focus:outline-none transition-colors"
          />
          <div className="text-[10px] text-[#828892] mt-1">
            Typical: 4" for patio/walkway, 5-6" for garage/driveway
          </div>
        </div>
      </div>

      {/* Thickened Edge Footer Option */}
      <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-[#003865]">
            <input
              type="checkbox"
              checked={includeEdgeBeam}
              onChange={(e) => setIncludeEdgeBeam(e.target.checked)}
              className="w-4 h-4 accent-[#003865] rounded"
            />
            <span>Include Thickened Perimeter Monolithic Footing / Curb</span>
          </label>
          <span className="text-[10px] text-[#828892] font-medium">Frost-protected edges</span>
        </div>

        {includeEdgeBeam && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E2DCB9]">
            <div>
              <label className="block text-xs font-medium text-[#2C3138] mb-1">
                Beam Width (inches)
              </label>
              <input
                type="number"
                value={edgeWidthInches}
                onChange={(e) => setEdgeWidthInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2C3138] mb-1">
                Total Edge Depth (inches from top)
              </label>
              <input
                type="number"
                value={edgeDepthInches}
                onChange={(e) => setEdgeDepthInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Rebar Grid Option */}
      <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-[#003865]">
            <input
              type="checkbox"
              checked={includeRebar}
              onChange={(e) => setIncludeRebar(e.target.checked)}
              className="w-4 h-4 accent-[#003865] rounded"
            />
            <span>Calculate Rebar Grid Reinforcement (#4 / 1/2" Deformed Bar)</span>
          </label>
          <span className="text-[10px] text-[#828892] font-medium">Cracking resistance</span>
        </div>

        {includeRebar && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E2DCB9]">
            <div>
              <label className="block text-xs font-medium text-[#2C3138] mb-1">
                Rebar Grid Spacing (inches on center)
              </label>
              <select
                value={rebarSpacingInches}
                onChange={(e) => setRebarSpacingInches(parseInt(e.target.value) || 18)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              >
                <option value={12}>12 inches (Heavy Duty)</option>
                <option value={16}>16 inches (Recommended)</option>
                <option value={18}>18 inches (Standard)</option>
                <option value={24}>24 inches (Light Duty)</option>
              </select>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#E2DCB9] text-xs">
              <div className="text-[#828892]">Estimated Rebar Takeoff:</div>
              <div className="font-semibold text-[#003865] mt-0.5">
                {rebarPieces20ft} standard 20-ft bars (~{Math.round(rebarLinearFt)} linear ft)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Box */}
      <div className="pt-5 border-t border-[#E2DCB9] space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#003865] rounded-xl p-4 text-center text-white shadow-xs border border-[#002b4d]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FBAF3C]">Ready-Mix Volume</div>
            <div className="text-3xl font-bold font-mono mt-1 text-white tracking-tight">
              {formatNumber(totalCuYds, 2)} <span className="text-sm font-normal text-[#EFE6C8]">yd³</span>
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">Surface: {formatNumber(slabSqFt, 0)} sq ft</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Cubic Feet</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {formatNumber(totalCuFt, 1)} <span className="text-sm font-normal text-[#828892]">ft³</span>
            </div>
            <div className="text-[10px] text-[#828892] mt-1">Exact + 10% Waste Buffer</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">80 lb Bags</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {bags80lb.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">Or {bags60lb.toLocaleString()} (60lb bags)</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Estimated Cost</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#1BB954] tracking-tight">
              {formatCurrency(totalCost)}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">At ${pricePerYard}/yd³ delivered</div>
          </div>
        </div>

        {totalCuYds > 2 ? (
          <div className="bg-[#FBAF3C]/15 border border-[#FBAF3C]/40 rounded-xl p-3.5 text-xs text-[#2C3138] flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-[#003865] shrink-0" />
            <div>
              <strong className="text-[#003865]">Order Bulk Ready-Mix Delivery:</strong> At {formatNumber(totalCuYds, 2)} cubic yards ({bags80lb} 80lb bags), hand-mixing bags is impractical. Order 1 transit mixer truck (holds up to 10 yards).
            </div>
          </div>
        ) : (
          <div className="bg-[#1BB954]/10 border border-[#1BB954]/30 rounded-xl p-3.5 text-xs text-[#003865] flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#1BB954] shrink-0" />
            <div>
              <strong className="text-[#003865]">DIY Bag Mix Viable:</strong> At {formatNumber(totalCuYds, 2)} cubic yards ({bags80lb} 80lb bags), this slab can be mixed on site with a portable electric drum mixer.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
