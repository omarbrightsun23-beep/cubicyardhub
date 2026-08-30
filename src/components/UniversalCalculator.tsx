import React, { useState } from 'react';
import { AreaItem, CalculationResults, MaterialPreset, ShapeType, UnitSystem } from '../types';
import { MATERIAL_PRESETS } from '../data/materials';
import { calculateAreaVolume, formatCurrency, formatNumber } from '../utils/calculator';
import {
  Plus,
  Trash2,
  Share2,
  Printer,
  Code2,
  Check,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Layers,
  ShoppingBag,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface UniversalCalculatorProps {
  areas: AreaItem[];
  setAreas: React.Dispatch<React.SetStateAction<AreaItem[]>>;
  selectedMaterial: MaterialPreset;
  setSelectedMaterial: (mat: MaterialPreset) => void;
  wastePercent: number;
  setWastePercent: (w: number) => void;
  pricePerYard: number;
  setPricePerYard: (p: number) => void;
  unitSystem: UnitSystem;
  results: CalculationResults;
  onOpenTakeoffModal: () => void;
  onOpenEmbedModal: () => void;
  onShare: () => void;
}

export const UniversalCalculator: React.FC<UniversalCalculatorProps> = ({
  areas,
  setAreas,
  selectedMaterial,
  setSelectedMaterial,
  wastePercent,
  setWastePercent,
  pricePerYard,
  setPricePerYard,
  unitSystem,
  results,
  onOpenTakeoffModal,
  onOpenEmbedModal,
  onShare
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentShapeTab, setCurrentShapeTab] = useState<ShapeType>('rectangle');
  const [globalDepthUnit, setGlobalDepthUnit] = useState<'inches' | 'feet'>(
    unitSystem === 'metric' ? 'inches' : 'inches'
  );

  const isMetric = unitSystem === 'metric';

  // Add new area section
  const handleAddArea = () => {
    const newId = (areas.length + 1).toString();
    const newArea: AreaItem = {
      id: newId,
      name: `Section ${areas.length + 1}`,
      shape: currentShapeTab,
      length: isMetric ? 6 : 20,
      width: isMetric ? 3 : 10,
      depth: isMetric ? 10 : 4,
      depthUnit: isMetric ? 'cm' : globalDepthUnit,
      topWidth: isMetric ? 1.5 : 5,
      bottomWidth: isMetric ? 1.0 : 3,
      quantity: 1
    };
    setAreas([...areas, newArea]);
  };

  // Remove area section
  const handleRemoveArea = (id: string) => {
    if (areas.length <= 1) return;
    setAreas(areas.filter((a) => a.id !== id));
  };

  // Update specific area attribute
  const updateArea = (id: string, field: keyof AreaItem, value: any) => {
    setAreas((prev) =>
      prev.map((area) => {
        if (area.id === id) {
          return { ...area, [field]: value };
        }
        return area;
      })
    );
  };

  // Switch shape tab for all or active
  const handleShapeTabChange = (shape: ShapeType) => {
    setCurrentShapeTab(shape);
    // Update first area or all areas if only 1 exists
    if (areas.length === 1) {
      updateArea(areas[0].id, 'shape', shape);
    }
  };

  // Toggle depth unit globally
  const handleToggleGlobalDepth = (unit: 'inches' | 'feet') => {
    setGlobalDepthUnit(unit);
    const targetUnit = isMetric ? (unit === 'inches' ? 'cm' : 'meters') : unit;
    setAreas((prev) =>
      prev.map((a) => ({
        ...a,
        depthUnit: targetUnit,
        // Optional quick sensible value adjustment
        depth: unit === 'feet' && a.depthUnit === 'inches' ? +(a.depth / 12).toFixed(2) : a.depth
      }))
    );
  };

  const handleCopyShare = () => {
    onShare();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section id="calculator" className="max-w-5xl mx-auto px-3 sm:px-6 py-2 flex-grow">
      {/* Top Banner Notice */}
      <div className="bg-[#003865] text-white rounded-2xl p-5 sm:p-7 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 border border-[#002b4d]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FBAF3C]/20 text-[#FBAF3C] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#FBAF3C]/30">
            ⚡ Instant Takeoff & Hauling Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Universal Material & Cubic Yard Calculator
          </h1>
          <p className="text-xs text-[#EFE6C8] mt-1 max-w-2xl leading-relaxed">
            Calculate cubic yards, tonnage weight, retail bag counts, and vehicle payload safety warnings for ready-mix concrete, crushed stone, topsoil, sand, and mulch.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={onOpenTakeoffModal}
            className="flex-1 md:flex-none bg-[#FBAF3C] hover:bg-[#e59f30] text-[#003865] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            id="print-sheet-hero-btn"
          >
            <Printer className="w-3.5 h-3.5 text-[#003865]" />
            <span>Print Takeoff</span>
          </button>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white border border-[#E2DCB9] rounded-2xl p-5 sm:p-8 shadow-xs space-y-7">
        {/* Step 1: Shape Selector */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2C3138] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#003865] text-[#FBAF3C] inline-flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span>Select Geometry Shape</span>
            </label>

            {/* Depth Unit Switcher */}
            <div className="inline-flex bg-[#FAF8F2] border border-[#E2DCB9] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => handleToggleGlobalDepth('inches')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors ${
                  globalDepthUnit === 'inches'
                    ? 'bg-[#003865] text-white shadow-xs'
                    : 'text-[#828892] hover:text-[#003865]'
                }`}
              >
                {isMetric ? 'Depth in cm' : 'Depth in inches'}
              </button>
              <button
                type="button"
                onClick={() => handleToggleGlobalDepth('feet')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors ${
                  globalDepthUnit === 'feet'
                    ? 'bg-[#003865] text-white shadow-xs'
                    : 'text-[#828892] hover:text-[#003865]'
                }`}
              >
                {isMetric ? 'Depth in meters' : 'Depth in feet'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAF8F2] p-1.5 rounded-xl border border-[#E2DCB9] text-xs">
            <button
              type="button"
              onClick={() => handleShapeTabChange('rectangle')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                currentShapeTab === 'rectangle'
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'text-[#2C3138] hover:text-[#003865] font-medium'
              }`}
            >
              <span>■</span> Rectangle / Slab
            </button>
            <button
              type="button"
              onClick={() => handleShapeTabChange('cylinder')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                currentShapeTab === 'cylinder'
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'text-[#2C3138] hover:text-[#003865] font-medium'
              }`}
            >
              <span>●</span> Cylinder / Pier
            </button>
            <button
              type="button"
              onClick={() => handleShapeTabChange('triangle')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                currentShapeTab === 'triangle'
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'text-[#2C3138] hover:text-[#003865] font-medium'
              }`}
            >
              <span>▲</span> Triangle / Slope
            </button>
            <button
              type="button"
              onClick={() => handleShapeTabChange('trapezoid')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                currentShapeTab === 'trapezoid'
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'text-[#2C3138] hover:text-[#003865] font-medium'
              }`}
            >
              <span>⏢</span> Trench / Ditch
            </button>
          </div>
        </div>

        {/* Step 2: Dynamic Area Sections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2C3138] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#003865] text-[#FBAF3C] inline-flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>Project Dimensions ({areas.length} {areas.length === 1 ? 'Section' : 'Sections'})</span>
            </label>

            <button
              type="button"
              onClick={handleAddArea}
              className="bg-[#FAF8F2] hover:bg-[#EFE6C8] text-[#003865] border border-[#E2DCB9] font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              id="add-area-btn"
            >
              <Plus className="w-3.5 h-3.5 text-[#003865]" />
              <span>Add another area</span>
            </button>
          </div>

          <div className="space-y-3" id="areas-container">
            {areas.map((area) => {
              const { cuFt, sqFt } = calculateAreaVolume(area, unitSystem);
              const subCuYds = cuFt / 27;

              return (
                <div
                  key={area.id}
                  className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 sm:p-5 relative shadow-xs transition-colors hover:border-[#003865]"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2DCB9]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={area.name}
                        onChange={(e) => updateArea(area.id, 'name', e.target.value)}
                        className="text-xs font-bold uppercase tracking-wider text-[#003865] bg-transparent border-b border-transparent hover:border-[#828892] focus:border-[#003865] focus:outline-none px-1"
                      />
                      <span className="text-[10px] font-semibold text-[#828892] bg-white px-2 py-0.5 rounded border border-[#E2DCB9] capitalize">
                        {area.shape}
                      </span>
                    </div>

                    {areas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors text-xs font-semibold flex items-center gap-1"
                        title="Remove section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {/* Dynamic Inputs based on shape */}
                  {area.shape === 'cylinder' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
                      <div>
                        <label className="block text-xs font-medium text-[#2C3138] mb-1">
                          Diameter ({isMetric ? 'meters' : 'feet'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.length || ''}
                          onChange={(e) => updateArea(area.id, 'length', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:border-[#003865] focus:outline-none transition-colors"
                          placeholder="e.g. 2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#003865] mb-1">
                          Depth ({area.depthUnit})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.depth || ''}
                          onChange={(e) => updateArea(area.id, 'depth', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:outline-none transition-colors"
                          placeholder="e.g. 36"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#2C3138] mb-1">
                          Quantity (Piers/Poles)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={area.quantity || 1}
                          onChange={(e) => updateArea(area.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:border-[#003865] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  ) : area.shape === 'triangle' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
                      <div>
                        <label className="block text-xs font-medium text-[#2C3138] mb-1">
                          Base Length ({isMetric ? 'meters' : 'feet'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.length || ''}
                          onChange={(e) => updateArea(area.id, 'length', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:border-[#003865] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#2C3138] mb-1">
                          Perpendicular Height ({isMetric ? 'meters' : 'feet'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.width || ''}
                          onChange={(e) => updateArea(area.id, 'width', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:border-[#003865] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#003865] mb-1">
                          Depth ({area.depthUnit})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.depth || ''}
                          onChange={(e) => updateArea(area.id, 'depth', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  ) : area.shape === 'trapezoid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mt-3.5">
                      <div>
                        <label className="block text-xs font-medium text-[#2C3138] mb-1">
                          Trench Length ({isMetric ? 'm' : 'ft'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.length || ''}
                          onChange={(e) => updateArea(area.id, 'length', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:border-[#003865] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#2C3138] mb-1">
                          Top Width ({isMetric ? 'm' : 'ft'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.topWidth || ''}
                          onChange={(e) => updateArea(area.id, 'topWidth', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:border-[#003865] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#2C3138] mb-1">
                          Bottom Width ({isMetric ? 'm' : 'ft'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.bottomWidth || ''}
                          onChange={(e) => updateArea(area.id, 'bottomWidth', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:border-[#003865] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#003865] mb-1">
                          Depth ({area.depthUnit})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.depth || ''}
                          onChange={(e) => updateArea(area.id, 'depth', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  ) : (
                    // Standard Rectangle / Slab
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
                      <div>
                        <label className="block text-xs font-medium text-[#2C3138] mb-1">
                          Length ({isMetric ? 'meters' : 'feet'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.length || ''}
                          onChange={(e) => updateArea(area.id, 'length', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:border-[#003865] focus:outline-none transition-colors"
                          placeholder="e.g. 20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#2C3138] mb-1">
                          Width ({isMetric ? 'meters' : 'feet'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.width || ''}
                          onChange={(e) => updateArea(area.id, 'width', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:border-[#003865] focus:outline-none transition-colors"
                          placeholder="e.g. 10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#003865] mb-1 flex items-center justify-between">
                          <span>Depth / Thickness ({area.depthUnit})</span>
                          <span className="text-[10px] text-[#828892] font-normal">
                            {area.depthUnit === 'inches' ? `${(area.depth / 12).toFixed(2)} ft` : ''}
                          </span>
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={area.depth || ''}
                          onChange={(e) => updateArea(area.id, 'depth', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-[#003865] rounded-lg px-3 py-2 text-[#2C3138] font-semibold text-sm focus:outline-none transition-colors"
                          placeholder="e.g. 4"
                        />
                      </div>
                    </div>
                  )}

                  {/* Section subtotal */}
                  <div className="mt-3 pt-2.5 border-t border-[#E2DCB9] flex items-center justify-between text-xs">
                    <span className="text-[#828892] font-medium">
                      Surface Area: <strong className="text-[#003865]">{formatNumber(sqFt, 1)} sq ft</strong>
                    </span>
                    <div className="text-right font-semibold text-[#003865]">
                      Subtotal: <span className="font-mono text-[#003865]">{formatNumber(subCuYds, 2)} yd³</span> ({formatNumber(cuFt, 1)} ft³)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Material Preset & Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E2DCB9]">
          <div>
            <label className="text-xs font-bold text-[#003865] mb-1 flex items-center gap-1">
              <span>Material Preset</span>
              <span className="text-[10px] text-[#828892] font-normal">(determines density & tonnage)</span>
            </label>
            <select
              id="material-select"
              value={selectedMaterial.id}
              onChange={(e) => {
                const found = MATERIAL_PRESETS[e.target.value];
                if (found) {
                  setSelectedMaterial(found);
                  setPricePerYard(found.typicalPricePerYard);
                }
              }}
              className="w-full bg-white border border-[#E2DCB9] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
            >
              {Object.values(MATERIAL_PRESETS).map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.name} (~{mat.tonsPerYard} tons/yd³)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#828892] mt-1 leading-snug">
              {selectedMaterial.description}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#003865] mb-1">
              Estimated Price per Cubic Yard ($) — Optional
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#828892] text-sm font-bold">$</span>
              <input
                type="number"
                step="any"
                id="price-input"
                value={pricePerYard || ''}
                onChange={(e) => setPricePerYard(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E2DCB9] rounded-lg pl-8 pr-4 py-2 text-sm font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
                placeholder="0.00"
              />
            </div>
            <p className="text-[11px] text-[#828892] mt-1">
              Standard local market rate: ~${selectedMaterial.typicalPricePerYard}/yd³
            </p>
          </div>
        </div>

        {/* Step 4: Compaction & Waste Buffer */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#003865] flex items-center gap-1">
              <span>Waste & Compaction Safety Buffer</span>
              <span title="Uneven ground, spillage, and mechanical tamping reduce effective bulk volume." className="cursor-pointer text-[#828892] hover:text-[#003865]">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </label>
            <span className="text-xs font-semibold text-[#FBAF3C] bg-[#003865] px-2 py-0.5 rounded">+{wastePercent}% Extra Material</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 text-center text-xs">
            <button
              type="button"
              data-waste-btn="0"
              onClick={() => setWastePercent(0)}
              className={`py-2 rounded-lg font-medium transition-colors ${
                wastePercent === 0
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'bg-white border border-[#E2DCB9] text-[#2C3138] hover:border-[#003865] hover:text-[#003865]'
              }`}
            >
              0% Exact
            </button>
            <button
              type="button"
              data-waste-btn="5"
              onClick={() => setWastePercent(5)}
              className={`py-2 rounded-lg font-medium transition-colors ${
                wastePercent === 5
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'bg-white border border-[#E2DCB9] text-[#2C3138] hover:border-[#003865] hover:text-[#003865]'
              }`}
            >
              +5% (Light)
            </button>
            <button
              type="button"
              data-waste-btn="10"
              onClick={() => setWastePercent(10)}
              className={`py-2 rounded-lg font-medium transition-colors ${
                wastePercent === 10
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'bg-white border border-[#E2DCB9] text-[#2C3138] hover:border-[#003865] hover:text-[#003865]'
              }`}
            >
              +10% (Rec.)
            </button>
            <button
              type="button"
              data-waste-btn="15"
              onClick={() => setWastePercent(15)}
              className={`py-2 rounded-lg font-medium transition-colors ${
                wastePercent === 15
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'bg-white border border-[#E2DCB9] text-[#2C3138] hover:border-[#003865] hover:text-[#003865]'
              }`}
            >
              +15% (Heavy)
            </button>
            <button
              type="button"
              data-waste-btn="20"
              onClick={() => setWastePercent(20)}
              className={`hidden sm:block py-2 rounded-lg font-medium transition-colors ${
                wastePercent === 20
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'bg-white border border-[#E2DCB9] text-[#2C3138] hover:border-[#003865] hover:text-[#003865]'
              }`}
            >
              +20% (Trench)
            </button>
          </div>
        </div>

        {/* VOLUME RESULTS HERO STATS */}
        <div className="pt-5 border-t border-[#E2DCB9] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#003865] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FBAF3C]" />
              <span>Volume Results & Material Takeoff</span>
            </span>
            <span className="text-xs text-[#828892] font-medium">
              Includes {wastePercent}% safety buffer ({formatNumber(results.wasteCuYards, 2)} yd³ buffer)
            </span>
          </div>

          {/* 4 Primary Hero Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Cubic Yards */}
            <div className="bg-[#003865] rounded-xl p-4 text-center text-white shadow-xs relative overflow-hidden border border-[#002b4d]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#FBAF3C]">
                Cubic Yards
              </div>
              <div id="res-cubic-yards" className="text-3xl sm:text-4xl font-bold font-mono mt-1 text-white tracking-tight">
                {formatNumber(results.totalCuYards, 2)}
              </div>
              <div className="text-[10px] text-[#EFE6C8] mt-1">
                Exact: {formatNumber(results.rawCuFt / 27, 2)} yd³
              </div>
            </div>

            {/* Cubic Feet */}
            <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">
                Cubic Feet
              </div>
              <div id="res-cubic-feet" className="text-3xl sm:text-4xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
                {formatNumber(results.totalCuFt, 1)}
              </div>
              <div className="text-[10px] text-[#828892] mt-1">
                {formatNumber(results.totalCuMeters, 2)} m³ (Metric)
              </div>
            </div>

            {/* Estimated Tons */}
            <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">
                Estimated Weight
              </div>
              <div id="res-tons" className="text-3xl sm:text-4xl font-bold font-mono mt-1 text-[#003865] tracking-tight">
                {formatNumber(results.totalTons, 2)} <span className="text-sm font-semibold text-[#828892]">Tons</span>
              </div>
              <div id="res-lbs" className="text-[10px] text-[#828892] mt-1">
                {Math.round(results.totalLbs).toLocaleString()} lbs ({Math.round(results.totalKg).toLocaleString()} kg)
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#828892]">
                Material Budget
              </div>
              <div id="res-total-cost" className="text-3xl sm:text-4xl font-bold font-mono mt-1 text-[#1BB954] tracking-tight">
                {formatCurrency(results.totalCost)}
              </div>
              <div className="text-[10px] text-[#828892] mt-1">
                At ${pricePerYard}/yd³
              </div>
            </div>
          </div>

          {/* Retail Commercial Bags Breakdown */}
          <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-[#003865] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#003865]" />
                <span>Commercial Bag Equivalent Quantities (Retail Purchase)</span>
              </span>
              <span className="text-[11px] text-[#828892]">
                {selectedMaterial.unitType === 'volume' ? 'Volume bags (Mulch/Soil)' : 'Weight bags (Pre-Mix)'}
              </span>
            </div>

            {selectedMaterial.unitType === 'volume' || selectedMaterial.category === 'mulch' ? (
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-white border border-[#E2DCB9] rounded-lg p-3">
                  <div className="text-[10px] text-[#828892] uppercase font-semibold">1.5 cu ft Bags</div>
                  <div className="text-lg font-bold text-[#003865] font-mono mt-0.5">
                    {results.bagsMulch1_5CuFt.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#828892]">Small garden bags</div>
                </div>
                <div className="bg-white border-2 border-[#003865] rounded-lg p-3 shadow-xs">
                  <div className="text-[10px] text-[#003865] uppercase font-bold">2.0 cu ft Bags (Standard)</div>
                  <div className="text-xl font-bold text-[#003865] font-mono mt-0.5">
                    {results.bagsMulch2CuFt.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#1BB954] font-bold">Most Common Size</div>
                </div>
                <div className="bg-white border border-[#E2DCB9] rounded-lg p-3">
                  <div className="text-[10px] text-[#828892] uppercase font-semibold">3.0 cu ft Bags</div>
                  <div className="text-lg font-bold text-[#003865] font-mono mt-0.5">
                    {results.bagsMulch3CuFt.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#828892]">Jumbo contractor bags</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-white border border-[#E2DCB9] rounded-lg p-3">
                  <div className="text-[10px] text-[#828892] uppercase font-semibold">50 lb Bags</div>
                  <div id="bag-50-count" className="text-lg font-bold text-[#003865] font-mono mt-0.5">
                    {results.bags50lb.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#828892]">Fast-Setting Mix</div>
                </div>
                <div className="bg-white border border-[#E2DCB9] rounded-lg p-3">
                  <div className="text-[10px] text-[#828892] uppercase font-semibold">60 lb Bags</div>
                  <div id="bag-60-count" className="text-lg font-bold text-[#003865] font-mono mt-0.5">
                    {results.bags60lb.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#828892]">Sakrete Standard</div>
                </div>
                <div className="bg-white border-2 border-[#003865] rounded-lg p-3 shadow-xs">
                  <div className="text-[10px] text-[#003865] uppercase font-bold">80 lb Bags (Standard)</div>
                  <div id="bag-80-count" className="text-xl font-bold text-[#003865] font-mono mt-0.5">
                    {results.bags80lb.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#1BB954] font-bold">~45 bags / cubic yard</div>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC VEHICLE PAYLOAD & HAULING SAFETY ADVISORY ENGINE */}
          <div
            id="hauling-alert-box"
            className={`rounded-xl p-4 text-xs shadow-xs space-y-1.5 transition-colors ${
              results.haulingStatus === 'safe_single_pickup'
                ? 'bg-[#1BB954]/10 border border-[#1BB954]/30 text-[#003865]'
                : results.haulingStatus === 'moderate_pickup_trips'
                ? 'bg-[#FBAF3C]/15 border border-[#FBAF3C]/40 text-[#2C3138]'
                : 'bg-red-50 border border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-sm">
              <span id="hauling-alert-title" className="flex items-center gap-1.5">
                {results.haulingStatus === 'safe_single_pickup' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#1BB954]" />
                    <span className="text-[#003865] font-bold">SAFE TO HAUL IN 1 PICKUP TRIP</span>
                  </>
                ) : results.haulingStatus === 'moderate_pickup_trips' ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-[#FBAF3C]" />
                    <span className="text-[#003865] font-bold">VEHICLE PAYLOAD & MULTI-TRIP ADVISORY</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 text-red-600" />
                    <span className="text-red-700 font-bold">HEAVY LOAD — BULK DELIVERY RECOMMENDED</span>
                  </>
                )}
              </span>
              <span className="text-xs font-mono font-bold text-[#003865]">
                {formatNumber(results.totalTons, 2)} Tons Total
              </span>
            </div>

            <p id="hauling-alert-desc" className="text-[#2C3138] leading-relaxed font-normal">
              Total Weight: <strong>{formatNumber(results.totalTons, 2)} Tons ({Math.round(results.totalLbs).toLocaleString()} lbs)</strong>.
              {results.haulingStatus === 'safe_single_pickup'
                ? ' Fits comfortably within standard 1/2-Ton (F-150 / 1500) pickup bed payload rating (~1,800 lbs).'
                : ` Exceeds standard 1/2-Ton pickup (F-150 / 1500) safe bed payload capacity (~1,800 lbs max). Loading this entire volume into a 1/2-ton bed will severely damage suspension and axles.`}
            </p>

            <div id="hauling-alert-rec" className="font-semibold pt-1 flex flex-wrap items-center gap-2">
              <span className="bg-white px-2 py-0.5 rounded border border-[#E2DCB9] text-[11px] text-[#003865]">
                🚚 1/2-Ton Pickup Trips: <strong>{results.pickupTripsHalfTon}</strong>
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-[#E2DCB9] text-[11px] text-[#003865]">
                🛻 3/4-Ton (F-250) Trips: <strong>{results.pickupTripsThreeQuarterTon}</strong>
              </span>
              {results.totalCuYards >= 3 && (
                <span className="bg-white px-2 py-0.5 rounded border border-[#E2DCB9] text-[11px] text-[#003865]">
                  🚛 Dump Truck Loads: <strong>{results.dumpTruckTrips10Yard}</strong> (10 yd³)
                </span>
              )}
            </div>
          </div>

          {/* Action Bar (Share, Print, Embed) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
            <button
              type="button"
              id="share-btn"
              onClick={handleCopyShare}
              className="bg-[#003865] hover:bg-[#002b4d] text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#1BB954]" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? '✓ Link Copied to Clipboard!' : 'Copy Share Link'}</span>
            </button>

            <button
              type="button"
              id="print-btn"
              onClick={onOpenTakeoffModal}
              className="bg-white hover:bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4 text-[#003865]" />
              <span>Print Contractor Takeoff</span>
            </button>

            <button
              type="button"
              id="embed-btn"
              onClick={onOpenEmbedModal}
              className="bg-white hover:bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Code2 className="w-4 h-4 text-[#003865]" />
              <span>Embed Calculator</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
