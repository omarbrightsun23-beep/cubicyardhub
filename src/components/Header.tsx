import React, { useState } from 'react';
import { ActiveTool, UnitSystem } from '../types';
import { Calculator, Sparkles, Scale, FileText, Share2, Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  unitSystem: UnitSystem;
  onToggleUnitSystem: () => void;
  onOpenTakeoffModal: () => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTool,
  onSelectTool,
  unitSystem,
  onToggleUnitSystem,
  onOpenTakeoffModal,
  onShare
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [materialsDropdownOpen, setMaterialsDropdownOpen] = useState(false);
  const [concreteDropdownOpen, setConcreteDropdownOpen] = useState(false);

  const navItems: { id: ActiveTool; label: string; group?: string }[] = [
    { id: 'universal', label: 'Universal Yardage' },
    { id: 'slab', label: 'Concrete Slabs' },
    { id: 'footing', label: 'Footings & Piers' },
    { id: 'dirt', label: 'Dirt & Soil' },
    { id: 'gravel', label: 'Gravel & Rock' },
    { id: 'sand', label: 'Sand' },
    { id: 'block', label: 'CMU Blocks' },
    { id: 'fence', label: 'Fence Posts' },
    { id: 'stairs', label: 'Concrete Stairs' },
    { id: 'driveway', label: 'Driveway Paving' },
    { id: 'converters', label: 'Yards to Tons' }
  ];

  return (
    <header className="bg-white border-b border-[#E2DCB9] sticky top-0 z-40 px-3 sm:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo Banner */}
        <button
          onClick={() => onSelectTool('universal')}
          className="flex items-center text-left group focus:outline-none cursor-pointer py-0.5"
          id="brand-logo-btn"
        >
          <img
            src="/logo-brand.svg"
            alt="CubicYardHub.com - Universal Material & Takeoff Engine"
            className="h-10 sm:h-12 md:h-13 w-auto max-w-[240px] sm:max-w-[290px] md:max-w-[330px] object-contain group-hover:opacity-95 transition-all"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1 text-xs font-medium">
          <button
            onClick={() => onSelectTool('universal')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTool === 'universal'
                ? 'bg-[#003865] text-white font-semibold shadow-xs'
                : 'text-[#2C3138] hover:text-[#003865] hover:bg-[#FAF8F2]'
            }`}
          >
            Universal Takeoff
          </button>

          {/* Concrete Menu */}
          <div className="relative">
            <button
              onClick={() => setConcreteDropdownOpen(!concreteDropdownOpen)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                ['slab', 'footing', 'block', 'fence', 'stairs'].includes(activeTool)
                  ? 'bg-[#EFE6C8] text-[#003865] font-semibold'
                  : 'text-[#2C3138] hover:text-[#003865] hover:bg-[#FAF8F2]'
              }`}
            >
              <span>Concrete & Masonry</span>
              <ChevronDown className="w-3 h-3 text-[#828892]" />
            </button>
            {concreteDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-[#E2DCB9] py-1.5 z-50 animate-in fade-in"
                onMouseLeave={() => setConcreteDropdownOpen(false)}
              >
                <button
                  onClick={() => { onSelectTool('slab'); setConcreteDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-[#2C3138] hover:bg-[#FAF8F2] hover:text-[#003865] font-medium"
                >
                  ■ Concrete Slabs & Patios
                </button>
                <button
                  onClick={() => { onSelectTool('footing'); setConcreteDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-[#2C3138] hover:bg-[#FAF8F2] hover:text-[#003865] font-medium"
                >
                  ● Footings, Sonotubes & Piers
                </button>
                <button
                  onClick={() => { onSelectTool('block'); setConcreteDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-[#2C3138] hover:bg-[#FAF8F2] hover:text-[#003865] font-medium"
                >
                  🧱 8x8x16 CMU Block Walls
                </button>
                <button
                  onClick={() => { onSelectTool('fence'); setConcreteDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-[#2C3138] hover:bg-[#FAF8F2] hover:text-[#003865] font-medium"
                >
                  🪵 Fence Post Concrete Holes
                </button>
                <button
                  onClick={() => { onSelectTool('stairs'); setConcreteDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-[#2C3138] hover:bg-[#FAF8F2] hover:text-[#003865] font-medium"
                >
                  ▲ Concrete Steps & Stairs
                </button>
              </div>
            )}
          </div>

          {/* Bulk Materials Menu */}
          <div className="relative">
            <button
              onClick={() => setMaterialsDropdownOpen(!materialsDropdownOpen)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                ['dirt', 'gravel', 'sand'].includes(activeTool)
                  ? 'bg-[#EFE6C8] text-[#003865] font-semibold'
                  : 'text-[#2C3138] hover:text-[#003865] hover:bg-[#FAF8F2]'
              }`}
            >
              <span>Bulk Aggregates</span>
              <ChevronDown className="w-3 h-3 text-[#828892]" />
            </button>
            {materialsDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-[#E2DCB9] py-1.5 z-50"
                onMouseLeave={() => setMaterialsDropdownOpen(false)}
              >
                <button
                  onClick={() => { onSelectTool('dirt'); setMaterialsDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-[#2C3138] hover:bg-[#FAF8F2] hover:text-[#003865] font-medium"
                >
                  🌱 Topsoil & Fill Dirt
                </button>
                <button
                  onClick={() => { onSelectTool('gravel'); setMaterialsDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-[#2C3138] hover:bg-[#FAF8F2] hover:text-[#003865] font-medium"
                >
                  🪨 Gravel, Stone & Pea Rock
                </button>
                <button
                  onClick={() => { onSelectTool('sand'); setMaterialsDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-[#2C3138] hover:bg-[#FAF8F2] hover:text-[#003865] font-medium"
                >
                  🏖️ Construction Sand & Paver
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectTool('driveway')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTool === 'driveway'
                ? 'bg-[#003865] text-white font-semibold shadow-xs'
                : 'text-[#2C3138] hover:text-[#003865] hover:bg-[#FAF8F2]'
            }`}
          >
            Driveway Estimator
          </button>

          <button
            onClick={() => onSelectTool('converters')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
              activeTool === 'converters'
                ? 'bg-[#003865] text-white font-semibold shadow-xs'
                : 'text-[#2C3138] hover:text-[#003865] hover:bg-[#FAF8F2]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#1BB954]" />
            <span>Yards to Tons</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Unit Toggle Button */}
          <button
            id="unit-toggle"
            onClick={onToggleUnitSystem}
            className="bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] hover:bg-[#EFE6C8] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Toggle between Imperial (Feet/Inches) and Metric (Meters/CM)"
          >
            <span className="font-mono text-[10px] bg-[#003865] text-[#FBAF3C] px-1.5 py-0.5 rounded font-bold">
              {unitSystem === 'imperial' ? 'IMP' : 'MET'}
            </span>
            <span className="hidden sm:inline text-xs">{unitSystem === 'imperial' ? 'Imperial' : 'Metric'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={onShare}
            className="bg-[#FAF8F2] hover:bg-[#EFE6C8] text-[#2C3138] border border-[#E2DCB9] p-2 rounded-lg text-xs font-medium transition-colors"
            title="Copy shareable takeoff link"
            id="quick-share-btn"
          >
            <Share2 className="w-3.5 h-3.5 text-[#003865]" />
          </button>

          {/* Print/Takeoff Sheet Button */}
          <button
            onClick={onOpenTakeoffModal}
            className="hidden sm:flex items-center gap-1.5 bg-white border border-[#003865] hover:bg-[#FAF8F2] text-[#003865] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            title="Generate contractor job site quote"
            id="quote-sheet-btn"
          >
            <FileText className="w-3.5 h-3.5 text-[#003865]" />
            <span>Print Quote</span>
          </button>

          {/* Quick Calculate Anchor CTA */}
          <a
            href="#calculator"
            className="bg-[#003865] hover:bg-[#002b4d] text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Calculator className="w-3.5 h-3.5 text-[#FBAF3C]" />
            <span className="hidden xs:inline">Calculate</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 text-[#2C3138] hover:text-[#003865] rounded-lg"
            id="mobile-nav-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E2DCB9] mt-3 pt-2.5 pb-3 space-y-1 text-xs">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#828892]">
            Specialized Takeoff Calculators
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTool(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between transition-colors ${
                activeTool === item.id
                  ? 'bg-[#003865] text-white font-semibold'
                  : 'text-[#2C3138] hover:bg-[#FAF8F2]'
              }`}
            >
              <span>{item.label}</span>
              {activeTool === item.id && <Sparkles className="w-3.5 h-3.5 text-[#FBAF3C]" />}
            </button>
          ))}
          <div className="pt-2 px-2 flex gap-2">
            <button
              onClick={() => {
                onOpenTakeoffModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-[#003865] text-white font-semibold py-2 rounded-lg text-center flex items-center justify-center gap-1.5 text-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#FBAF3C]" /> Print Job Takeoff
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
