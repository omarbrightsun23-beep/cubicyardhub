import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';
import { Sprout, Truck, AlertTriangle } from 'lucide-react';

interface DirtSoilCalculatorProps {
  unitSystem: UnitSystem;
}

export const DirtSoilCalculator: React.FC<DirtSoilCalculatorProps> = ({ unitSystem }) => {
  const [dirtType, setDirtType] = useState<'topsoil' | 'fill_dirt' | 'compost'>('topsoil');
  const [length, setLength] = useState<number>(30);
  const [width, setWidth] = useState<number>(10);
  const [depthInches, setDepthInches] = useState<number>(3);
  const [compactionPercent, setCompactionPercent] = useState<number>(15);
  const [pricePerYard, setPricePerYard] = useState<number>(45);

  const isMetric = unitSystem === 'metric';
  const lengthFt = isMetric ? length * 3.28084 : length;
  const widthFt = isMetric ? width * 3.28084 : width;
  const depthFt = (isMetric ? depthInches / 2.54 : depthInches) / 12;

  const sqFt = lengthFt * widthFt;
  const rawCuFt = sqFt * depthFt;
  const totalCuFt = rawCuFt * (1 + compactionPercent / 100);
  const totalCuYds = totalCuFt / 27;

  // Densities
  const densities: Record<string, number> = {
    topsoil: 2200, // lbs/yd³
    fill_dirt: 2400,
    compost: 1400
  };
  const densityLbs = densities[dirtType] || 2200;
  const totalLbs = totalCuYds * densityLbs;
  const totalTons = totalLbs / 2000;
  const totalCost = totalCuYds * pricePerYard;

  // Bags (standard 40lb soil bags or 1 cu ft bags)
  const bags40lb = Math.ceil(totalLbs / 40);
  const bags1CuFt = Math.ceil(totalCuFt / 1.0);

  // Pickup trips
  const pickupTripsHalfTon = Math.ceil(totalLbs / 1800);

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Landscaping & Lawn Leveling Engine
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Topsoil, Fill Dirt & Raised Garden Bed Calculator
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Calculate exact cubic yards, tons, and 40lb bag counts for lawn topdressing, garden leveling, and heavy subgrade fill dirt with automatic settlement compaction buffer.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Soil / Dirt Type</label>
          <select
            value={dirtType}
            onChange={(e) => setDirtType(e.target.value as any)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          >
            <option value="topsoil">Screened Topsoil (~1.10 tons/yd³)</option>
            <option value="fill_dirt">Unscreened Fill Dirt (~1.20 tons/yd³)</option>
            <option value="compost">Organic Compost (~0.70 tons/yd³)</option>
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
          <div className="text-[10px] text-[#828892] mt-1">Topdressing: 0.5-1", New Lawn: 3-4", Raised Bed: 8-12"</div>
        </div>
      </div>

      {/* Compaction Factor Guide */}
      <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <div className="font-semibold text-[#003865]">Compaction & Settling Buffer: +{compactionPercent}% Extra</div>
          <p className="text-[#828892] text-[11px] mt-0.5">
            Loose soil settles up to 20% after watering, rain, and mechanical rolling.
          </p>
        </div>
        <div className="flex gap-1.5">
          {[5, 10, 15, 20].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setCompactionPercent(pct)}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition ${
                compactionPercent === pct
                  ? 'bg-[#003865] text-white shadow-xs'
                  : 'bg-white border border-[#E2DCB9] text-[#2C3138] hover:border-[#003865] hover:text-[#003865]'
              }`}
            >
              +{pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="pt-5 border-t border-[#E2DCB9] space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#003865] rounded-xl p-4 text-center text-white shadow-xs border border-[#002b4d]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FBAF3C]">Cubic Yards Needed</div>
            <div className="text-3xl font-bold font-mono mt-1 text-white tracking-tight">
              {formatNumber(totalCuYds, 2)} <span className="text-sm font-normal text-[#EFE6C8]">yd³</span>
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">{formatNumber(sqFt, 0)} sq ft coverage</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Total Weight (Tons)</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {formatNumber(totalTons, 2)} <span className="text-sm font-normal text-[#828892]">Tons</span>
            </div>
            <div className="text-[10px] text-[#828892] mt-1">{Math.round(totalLbs).toLocaleString()} lbs</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Retail 40 lb Bags</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
              {bags40lb.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">Or {bags1CuFt} (1 cu ft bags)</div>
          </div>

          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">Estimated Cost</div>
            <div className="text-3xl font-bold font-mono mt-1 text-[#1BB954] tracking-tight">
              {formatCurrency(totalCost)}
            </div>
            <div className="text-[10px] text-[#828892] mt-1">At ${pricePerYard}/yd³ bulk rate</div>
          </div>
        </div>

        {/* Hauling Recommendation */}
        <div className="bg-[#FBAF3C]/15 border border-[#FBAF3C]/40 rounded-xl p-3.5 text-xs text-[#2C3138] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#003865]" />
            <span>
              Requires <strong>{pickupTripsHalfTon} pickup truck {pickupTripsHalfTon === 1 ? 'trip' : 'trips'}</strong> (F-150 / 1500) OR 1 single-axle dump truck bulk delivery.
            </span>
          </span>
          <span className="font-bold text-[#003865]">
            {totalCuYds >= 4 ? 'Recommend Dump Truck' : 'Pickup Trip Viable'}
          </span>
        </div>
      </div>
    </div>
  );
};
