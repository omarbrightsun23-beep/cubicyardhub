import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';
import { DollarSign, Layers, CheckCircle2, Award } from 'lucide-react';

interface DrivewayCostCalculatorProps {
  unitSystem: UnitSystem;
}

export const DrivewayCostCalculator: React.FC<DrivewayCostCalculatorProps> = ({ unitSystem }) => {
  const [drivewayLengthFt, setDrivewayLengthFt] = useState<number>(50);
  const [drivewayWidthFt, setDrivewayWidthFt] = useState<number>(12);
  const [projectScope, setProjectScope] = useState<'new_installation' | 'resurfacing' | 'replacement'>('new_installation');

  const sqFt = drivewayLengthFt * drivewayWidthFt;

  // Concrete Paving (4" to 5" Slab on 4" gravel base):
  // Average installed cost: $8.50 - $14.00 per sq ft
  const concreteRate = projectScope === 'replacement' ? 14.00 : projectScope === 'resurfacing' ? 7.50 : 10.50;
  const concreteCost = sqFt * concreteRate;
  const concreteCuYds = (sqFt * (5 / 12) * 1.10) / 27;

  // Asphalt Paving (Hot-Mix Asphalt 2.5" to 3" compacted on 6" gravel base):
  // Average installed cost: $4.50 - $8.00 per sq ft
  const asphaltRate = projectScope === 'replacement' ? 8.50 : projectScope === 'resurfacing' ? 3.75 : 5.75;
  const asphaltCost = sqFt * asphaltRate;
  const asphaltTons = ((sqFt * (3 / 12) * 1.10) / 27) * 1.95;

  // Gravel Driveway (6" compacted crusher run / road base + 2" top pea/river gravel):
  // Average installed cost: $2.00 - $4.00 per sq ft
  const gravelRate = projectScope === 'replacement' ? 4.50 : 2.75;
  const gravelCost = sqFt * gravelRate;
  const gravelTons = ((sqFt * (6 / 12) * 1.15) / 27) * 1.45;

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Paving Comparison & Lead-Gen Estimator
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Driveway Cost & Material Takeoff Calculator
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Compare total installed project pricing and material quantities across Poured Concrete, Hot-Mix Asphalt, and Crushed Gravel driveways.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Driveway Length (feet)</label>
          <input
            type="number"
            value={drivewayLengthFt || ''}
            onChange={(e) => setDrivewayLengthFt(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Driveway Width (feet)</label>
          <input
            type="number"
            value={drivewayWidthFt || ''}
            onChange={(e) => setDrivewayWidthFt(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          />
          <div className="text-[10px] text-[#828892] mt-1">1-car: 10-12 ft, 2-car: 20-24 ft</div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2C3138] mb-1">Project Scope</label>
          <select
            value={projectScope}
            onChange={(e) => setProjectScope(e.target.value as any)}
            className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
          >
            <option value="new_installation">New Driveway Construction</option>
            <option value="resurfacing">Resurfacing / Overlay on existing</option>
            <option value="replacement">Tear-Out & Full Replacement</option>
          </select>
        </div>
      </div>

      {/* Surface Area Banner */}
      <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-3.5 flex items-center justify-between text-xs">
        <span className="text-[#828892]">Total Driveway Surface Area:</span>
        <span className="font-bold text-sm text-[#003865]">{sqFt.toLocaleString()} sq ft</span>
      </div>

      {/* 3-Way Paving Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Concrete */}
        <div className="bg-white border-2 border-[#003865] rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#003865] text-[#FBAF3C] text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg tracking-wider">
            30+ YR LIFESPAN
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-[#003865] tracking-wider mb-1">Poured Concrete Slab</div>
            <div className="text-2xl font-bold text-[#003865] font-mono tracking-tight">{formatCurrency(concreteCost)}</div>
            <div className="text-[11px] text-[#828892] mt-0.5">~${concreteRate.toFixed(2)} / sq ft installed</div>

            <div className="mt-4 pt-4 border-t border-[#E2DCB9] space-y-2 text-xs text-[#828892]">
              <div className="flex justify-between">
                <span>Material Volume:</span>
                <strong className="text-[#003865]">{formatNumber(concreteCuYds, 1)} yd³</strong>
              </div>
              <div className="flex justify-between">
                <span>Recommended Thickness:</span>
                <strong className="text-[#003865]">5 to 6 inches</strong>
              </div>
              <div className="flex justify-between">
                <span>Maintenance:</span>
                <span className="text-[#1BB954] font-semibold">Low (Seal every 3-5 yrs)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Asphalt */}
        <div className="bg-white border border-[#E2DCB9] hover:border-[#003865] rounded-xl p-5 shadow-xs flex flex-col justify-between relative transition-colors">
          <div className="absolute top-0 right-0 bg-[#FAF8F2] text-[#003865] border-b border-l border-[#E2DCB9] text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg tracking-wider">
            POPULAR VALUE
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-[#2C3138] tracking-wider mb-1">Hot-Mix Asphalt</div>
            <div className="text-2xl font-bold text-[#003865] font-mono tracking-tight">{formatCurrency(asphaltCost)}</div>
            <div className="text-[11px] text-[#828892] mt-0.5">~${asphaltRate.toFixed(2)} / sq ft installed</div>

            <div className="mt-4 pt-4 border-t border-[#E2DCB9] space-y-2 text-xs text-[#828892]">
              <div className="flex justify-between">
                <span>Asphalt Tonnage:</span>
                <strong className="text-[#003865]">{formatNumber(asphaltTons, 1)} Tons</strong>
              </div>
              <div className="flex justify-between">
                <span>Recommended Depth:</span>
                <strong className="text-[#003865]">3" HMA on 6" gravel</strong>
              </div>
              <div className="flex justify-between">
                <span>Maintenance:</span>
                <span className="text-[#FBAF3C] font-semibold">Sealcoat every 2-3 yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gravel */}
        <div className="bg-white border border-[#E2DCB9] hover:border-[#003865] rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="text-xs font-bold uppercase text-[#2C3138] tracking-wider mb-1">Crushed Stone / Gravel</div>
            <div className="text-2xl font-bold text-[#003865] font-mono tracking-tight">{formatCurrency(gravelCost)}</div>
            <div className="text-[11px] text-[#828892] mt-0.5">~${gravelRate.toFixed(2)} / sq ft installed</div>

            <div className="mt-4 pt-4 border-t border-[#E2DCB9] space-y-2 text-xs text-[#828892]">
              <div className="flex justify-between">
                <span>Crusher Run + Top:</span>
                <strong className="text-[#003865]">{formatNumber(gravelTons, 1)} Tons</strong>
              </div>
              <div className="flex justify-between">
                <span>Recommended Depth:</span>
                <strong className="text-[#003865]">6" Base + 2" Top</strong>
              </div>
              <div className="flex justify-between">
                <span>Maintenance:</span>
                <span className="text-[#828892] font-semibold">Grade & top off yearly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
