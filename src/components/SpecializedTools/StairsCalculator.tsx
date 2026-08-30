import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';

interface StairsCalculatorProps {
  unitSystem: UnitSystem;
}

export const StairsCalculator: React.FC<StairsCalculatorProps> = ({ unitSystem }) => {
  const [numSteps, setNumSteps] = useState<number>(4);
  const [stairWidthFt, setStairWidthFt] = useState<number>(4);
  const [riserHeightInches, setRiserHeightInches] = useState<number>(7.5);
  const [treadDepthInches, setTreadDepthInches] = useState<number>(11);
  const [hasTopLanding, setHasTopLanding] = useState<boolean>(true);
  const [landingDepthFt, setLandingDepthFt] = useState<number>(3);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [pricePerYard, setPricePerYard] = useState<number>(145);

  const isMetric = unitSystem === 'metric';
  const widthFt = isMetric ? stairWidthFt * 3.28084 : stairWidthFt;
  const riserFt = (isMetric ? riserHeightInches / 2.54 : riserHeightInches) / 12;
  const treadFt = (isMetric ? treadDepthInches / 2.54 : treadDepthInches) / 12;
  const landingDFt = isMetric ? landingDepthFt * 3.28084 : landingDepthFt;

  // Stair Step Volume Calculation:
  // Step 1 has 1 block of riser x tread x width
  // Step 2 has 2 blocks of riser x tread x width
  // Sum of integers from 1 to N = N*(N+1)/2
  const stepsMultiplier = (numSteps * (numSteps + 1)) / 2;
  const stairStepsCuFt = stepsMultiplier * (riserFt * treadFt * widthFt);

  // Top Landing Platform (if applicable)
  let landingCuFt = 0;
  if (hasTopLanding) {
    const totalStairHeightFt = numSteps * riserFt;
    landingCuFt = landingDFt * widthFt * totalStairHeightFt;
  }

  const rawCuFt = stairStepsCuFt + landingCuFt;
  const totalCuFt = rawCuFt * (1 + wastePercent / 100);
  const totalCuYds = totalCuFt / 27;
  const totalLbs = totalCuYds * 4050;
  const totalTons = totalLbs / 2000;
  const bags80lb = Math.ceil(totalLbs / 80);
  const totalCost = totalCuYds * pricePerYard;

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Stepped Architectural Takeoff
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Concrete Steps, Stairs & Landing Calculator
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Calculate cubic yards and 80lb bags of poured concrete for stepped front stoops, patio stairs, risers, treads, and top landing platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Number of Steps (Risers)</label>
          <input
            type="number"
            min="1"
            max="20"
            value={numSteps || ''}
            onChange={(e) => setNumSteps(parseInt(e.target.value) || 1)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Stair Width ({isMetric ? 'm' : 'ft'})</label>
          <input
            type="number"
            value={stairWidthFt || ''}
            onChange={(e) => setStairWidthFt(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Riser Height ({isMetric ? 'cm' : 'inches'})</label>
          <input
            type="number"
            value={riserHeightInches || ''}
            onChange={(e) => setRiserHeightInches(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
          <div className="text-[10px] text-[#828892] mt-1">Code standard: 7" to 7.75"</div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#003865] mb-1">Tread Depth ({isMetric ? 'cm' : 'inches'})</label>
          <input
            type="number"
            value={treadDepthInches || ''}
            onChange={(e) => setTreadDepthInches(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-sm font-semibold text-[#003865] focus:outline-none transition-colors"
          />
          <div className="text-[10px] text-[#828892] mt-1">Code standard: 10" to 12"</div>
        </div>
      </div>

      {/* Top Landing Platform */}
      <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-[#003865]">
          <input
            type="checkbox"
            checked={hasTopLanding}
            onChange={(e) => setHasTopLanding(e.target.checked)}
            className="w-4 h-4 text-[#003865] rounded accent-[#003865]"
          />
          <span>Include Top Stoop / Landing Platform</span>
        </label>

        {hasTopLanding && (
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-[#2C3138]">Landing Depth ({isMetric ? 'm' : 'ft'}):</span>
            <input
              type="number"
              step="0.5"
              value={landingDepthFt || ''}
              onChange={(e) => setLandingDepthFt(parseFloat(e.target.value) || 0)}
              className="w-24 bg-white border border-[#E2DCB9] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#003865] text-center focus:border-[#003865] focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Results */}
      <div className="pt-5 border-t border-[#E2DCB9] space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#003865] rounded-xl p-4 text-center text-white shadow-xs border border-[#002b4d]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FBAF3C]">Total Concrete Volume</div>
            <div className="text-3xl font-bold font-mono mt-1 text-white tracking-tight">
              {formatNumber(totalCuYds, 2)} <span className="text-sm font-normal text-[#EFE6C8]">yd³</span>
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">{formatNumber(totalCuFt, 1)} cu ft</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">80 lb Bags</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {bags80lb.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">~{Math.ceil(totalLbs / 60)} 60lb bags</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Total Weight (Tons)</div>
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
