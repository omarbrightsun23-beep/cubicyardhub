import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';
import { Layers, Truck } from 'lucide-react';

interface GravelRockCalculatorProps {
  unitSystem: UnitSystem;
}

export const GravelRockCalculator: React.FC<GravelRockCalculatorProps> = ({ unitSystem }) => {
  const [gravelType, setGravelType] = useState<string>('crushed_stone');
  const [length, setLength] = useState<number>(30);
  const [width, setWidth] = useState<number>(10);
  const [depthInches, setDepthInches] = useState<number>(4);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [pricePerTon, setPricePerTon] = useState<number>(48);

  const isMetric = unitSystem === 'metric';
  const lengthFt = isMetric ? length * 3.28084 : length;
  const widthFt = isMetric ? width * 3.28084 : width;
  const depthFt = (isMetric ? depthInches / 2.54 : depthInches) / 12;

  const sqFt = lengthFt * widthFt;
  const rawCuFt = sqFt * depthFt;
  const totalCuFt = rawCuFt * (1 + wastePercent / 100);
  const totalCuYds = totalCuFt / 27;

  const densities: Record<string, { name: string; densityLbs: number; tonsPerYard: number; desc: string }> = {
    crushed_stone: { name: '#57 Crushed Stone / Gravel', densityLbs: 2800, tonsPerYard: 1.40, desc: 'Angular limestone. 3/4" - 1" for driveways and French drains.' },
    pea_gravel: { name: 'Pea Gravel (3/8" Smooth)', densityLbs: 2700, tonsPerYard: 1.35, desc: 'Smooth round river pebbles for walkways and dog runs.' },
    river_rock: { name: 'River Rock (1" - 3")', densityLbs: 2850, tonsPerYard: 1.42, desc: 'Decorative river stones for dry creek beds and borders.' },
    crusher_run: { name: 'Crusher Run / Road Base (#411)', densityLbs: 3000, tonsPerYard: 1.50, desc: 'Crushed stone with stone dust for heavy compaction.' },
    drain_rock: { name: '#4 Clean Drain Rock (1.5" - 2")', densityLbs: 2750, tonsPerYard: 1.38, desc: 'Large clean stone for septic drain fields and erosion control.' }
  };

  const selected = densities[gravelType] || densities.crushed_stone;
  const totalLbs = totalCuYds * selected.densityLbs;
  const totalTons = totalLbs / 2000;
  const totalCost = totalTons * pricePerTon;

  const bags50lb = Math.ceil(totalLbs / 50);
  const pickupTripsHalfTon = Math.ceil(totalLbs / 1800);

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Quarry & Driveway Aggregates
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Gravel, Crushed Stone & River Rock Calculator
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Calculate cubic yards, tons, and bags for #57 crushed limestone, pea gravel, river rock, and crusher run base for driveways, patios, and drainage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Aggregate Type</label>
          <select
            value={gravelType}
            onChange={(e) => setGravelType(e.target.value)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          >
            {Object.entries(densities).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name} (~{item.tonsPerYard} t/yd³)
              </option>
            ))}
          </select>
          <p className="text-[10px] text-[#828892] mt-1 leading-normal">{selected.desc}</p>
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
          <label className="block text-xs font-semibold text-[#003865] mb-1">Layer Depth ({isMetric ? 'cm' : 'inches'})</label>
          <input
            type="number"
            value={depthInches || ''}
            onChange={(e) => setDepthInches(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-sm font-semibold text-[#003865] focus:outline-none transition-colors"
          />
          <div className="text-[10px] text-[#828892] mt-1">Walkway: 2-3", Driveway: 4-6", Base: 4"</div>
        </div>
      </div>

      {/* Results */}
      <div className="pt-5 border-t border-[#E2DCB9] space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#003865] rounded-xl p-4 text-center text-white shadow-xs border border-[#002b4d]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FBAF3C]">Total Tonnage</div>
            <div className="text-3xl font-bold font-mono mt-1 text-white tracking-tight">
              {formatNumber(totalTons, 2)} <span className="text-sm font-normal text-[#EFE6C8]">Tons</span>
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">Quarries sell by the ton</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Cubic Yards</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {formatNumber(totalCuYds, 2)} <span className="text-sm font-normal text-[#828892]">yd³</span>
            </div>
            <div className="text-[10px] text-[#828892] mt-1">{formatNumber(totalCuFt, 1)} cu ft</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">50 lb Retail Bags</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {bags50lb.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">~{Math.ceil(totalLbs / 60)} 60lb bags</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Estimated Cost</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#1BB954] tracking-tight">
              {formatCurrency(totalCost)}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">At ${pricePerTon}/ton bulk quarry rate</div>
          </div>
        </div>

        {/* Hauling Alert */}
        <div className="bg-[#FBAF3C]/15 border border-[#FBAF3C]/40 rounded-xl p-3.5 text-xs text-[#2C3138] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#003865]" />
            <span>
              Total Weight: <strong>{formatNumber(totalTons, 2)} Tons ({Math.round(totalLbs).toLocaleString()} lbs)</strong> → Requires {pickupTripsHalfTon} pickup truck trips.
            </span>
          </span>
          <span className="font-bold text-[#003865]">
            {totalTons >= 3 ? 'Recommend Tri-Axle Delivery' : 'Pickup Trips Viable'}
          </span>
        </div>
      </div>
    </div>
  );
};
