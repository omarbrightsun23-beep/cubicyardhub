import React, { useState } from 'react';
import { UnitSystem } from '../../types';
import { formatNumber } from '../../utils/calculator';
import { ArrowRightLeft, Scale, RefreshCw } from 'lucide-react';

interface UnitConvertersProps {
  unitSystem: UnitSystem;
}

export const UnitConverters: React.FC<UnitConvertersProps> = ({ unitSystem }) => {
  // Converter 1: Yards to Tons
  const [inputYards, setInputYards] = useState<number>(5);
  const [materialTonsPerYard, setMaterialTonsPerYard] = useState<number>(1.40);

  // Converter 2: Tons to Yards
  const [inputTons, setInputTons] = useState<number>(10);
  const [materialDensityForTons, setMaterialDensityForTons] = useState<number>(1.40);

  // Converter 3: Cubic Feet to Cubic Yards
  const [inputCuFt, setInputCuFt] = useState<number>(135);

  // Converter 4: Square Feet to Cubic Yards at Depth
  const [inputSqFt, setInputSqFt] = useState<number>(500);
  const [inputDepthInches, setInputDepthInches] = useState<number>(4);

  // Math
  const yardsToTonsResult = inputYards * materialTonsPerYard;
  const tonsToYardsResult = materialDensityForTons > 0 ? inputTons / materialDensityForTons : 0;
  const cuFtToYardsResult = inputCuFt / 27;
  const sqFtToYardsResult = (inputSqFt * (inputDepthInches / 12)) / 27;

  return (
    <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#E2DCB9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-2">
          Bi-Directional Unit Takeoff
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Universal Yards to Tons & Volume Converters
        </h2>
        <p className="text-xs text-[#828892] mt-1 leading-relaxed">
          Instantly convert cubic yards to tons, tons to cubic yards, cubic feet to yards, and square feet coverage at any thickness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Converter 1: Cubic Yards to Tons */}
        <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between font-bold text-xs text-[#003865]">
            <span className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#003865]" />
              <span>Cubic Yards to Tons Converter</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#2C3138] mb-1">Cubic Yards (yd³)</label>
              <input
                type="number"
                value={inputYards || ''}
                onChange={(e) => setInputYards(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#2C3138] mb-1">Material Density</label>
              <select
                value={materialTonsPerYard}
                onChange={(e) => setMaterialTonsPerYard(parseFloat(e.target.value))}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#003865] focus:border-[#003865] focus:outline-none transition-colors"
              >
                <option value={1.40}>Gravel / Stone (1.40 t/yd³)</option>
                <option value={2.03}>Concrete (2.03 t/yd³)</option>
                <option value={1.10}>Topsoil / Dirt (1.10 t/yd³)</option>
                <option value={1.35}>Sand (1.35 t/yd³)</option>
                <option value={0.40}>Mulch (0.40 t/yd³)</option>
                <option value={1.95}>Asphalt (1.95 t/yd³)</option>
              </select>
            </div>
          </div>

          <div className="bg-[#003865] text-white p-4 rounded-xl text-center shadow-xs border border-[#002b4d]">
            <div className="text-[10px] uppercase text-[#FBAF3C] font-bold tracking-widest">Calculated Weight</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tracking-tight">
              {formatNumber(yardsToTonsResult, 2)} Tons
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">
              {Math.round(yardsToTonsResult * 2000).toLocaleString()} lbs ({Math.round(yardsToTonsResult * 907.185).toLocaleString()} kg)
            </div>
          </div>
        </div>

        {/* Converter 2: Tons to Cubic Yards */}
        <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between font-bold text-xs text-[#003865]">
            <span className="flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-[#003865]" />
              <span>Tons to Cubic Yards Converter</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#2C3138] mb-1">Weight in Tons</label>
              <input
                type="number"
                value={inputTons || ''}
                onChange={(e) => setInputTons(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#2C3138] mb-1">Material Density</label>
              <select
                value={materialDensityForTons}
                onChange={(e) => setMaterialDensityForTons(parseFloat(e.target.value))}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-xs font-semibold text-[#003865] focus:border-[#003865] focus:outline-none transition-colors"
              >
                <option value={1.40}>Gravel / Stone (1.40 t/yd³)</option>
                <option value={2.03}>Concrete (2.03 t/yd³)</option>
                <option value={1.10}>Topsoil / Dirt (1.10 t/yd³)</option>
                <option value={1.35}>Sand (1.35 t/yd³)</option>
                <option value={0.40}>Mulch (0.40 t/yd³)</option>
                <option value={1.95}>Asphalt (1.95 t/yd³)</option>
              </select>
            </div>
          </div>

          <div className="bg-[#003865] text-white p-4 rounded-xl text-center shadow-xs border border-[#002b4d]">
            <div className="text-[10px] uppercase text-[#FBAF3C] font-bold tracking-widest">Calculated Volume</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tracking-tight">
              {formatNumber(tonsToYardsResult, 2)} Cubic Yards
            </div>
            <div className="text-[10px] text-[#EFE6C8] mt-1">
              {formatNumber(tonsToYardsResult * 27, 1)} Cubic Feet (ft³)
            </div>
          </div>
        </div>

        {/* Converter 3: Cubic Feet to Cubic Yards */}
        <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-5 space-y-4">
          <div className="font-bold text-xs text-[#003865]">Cubic Feet (ft³) to Cubic Yards (yd³)</div>
          <div>
            <label className="block text-[11px] font-semibold text-[#2C3138] mb-1">Cubic Feet (ft³)</label>
            <input
              type="number"
              value={inputCuFt || ''}
              onChange={(e) => setInputCuFt(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
            />
          </div>
          <div className="bg-white border border-[#E2DCB9] p-4 rounded-xl text-center shadow-xs">
            <div className="text-[10px] uppercase text-[#828892] font-bold tracking-widest">Result (Divide by 27)</div>
            <div className="text-2xl font-bold font-mono text-[#003865] mt-1 tracking-tight">
              {formatNumber(cuFtToYardsResult, 2)} yd³
            </div>
          </div>
        </div>

        {/* Converter 4: Square Feet to Cubic Yards at Depth */}
        <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-5 space-y-4">
          <div className="font-bold text-xs text-[#003865]">Square Feet (sq ft) to Cubic Yards at Depth</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#2C3138] mb-1">Surface Area (sq ft)</label>
              <input
                type="number"
                value={inputSqFt || ''}
                onChange={(e) => setInputSqFt(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#2C3138] mb-1">Depth (inches)</label>
              <input
                type="number"
                value={inputDepthInches || ''}
                onChange={(e) => setInputDepthInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="bg-white border border-[#E2DCB9] p-4 rounded-xl text-center shadow-xs">
            <div className="text-[10px] uppercase text-[#828892] font-bold tracking-widest">Result at {inputDepthInches}" Thickness</div>
            <div className="text-2xl font-bold font-mono text-[#003865] mt-1 tracking-tight">
              {formatNumber(sqFtToYardsResult, 2)} yd³
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
