import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTool, AreaItem, ModalType, UnitSystem } from './types';
import { MATERIAL_PRESETS } from './data/materials';
import { calculateTakeoff } from './utils/calculator';
import { ColorStrip } from './components/ColorStrip';
import { Header } from './components/Header';
import { UniversalCalculator } from './components/UniversalCalculator';
import { SlabCalculator } from './components/SpecializedTools/SlabCalculator';
import { FootingCalculator } from './components/SpecializedTools/FootingCalculator';
import { DirtSoilCalculator } from './components/SpecializedTools/DirtSoilCalculator';
import { GravelRockCalculator } from './components/SpecializedTools/GravelRockCalculator';
import { SandCalculator } from './components/SpecializedTools/SandCalculator';
import { ConcreteBlockCalculator } from './components/SpecializedTools/ConcreteBlockCalculator';
import { FencePostCalculator } from './components/SpecializedTools/FencePostCalculator';
import { StairsCalculator } from './components/SpecializedTools/StairsCalculator';
import { DrivewayCostCalculator } from './components/SpecializedTools/DrivewayCostCalculator';
import { UnitConverters } from './components/SpecializedTools/UnitConverters';
import { ReferenceTables } from './components/ReferenceTables';
import { StepGuide } from './components/StepGuide';
import { FAQSection } from './components/FAQSection';
import { AdSlot } from './components/AdSlot';
import { JobTakeoffModal } from './components/JobTakeoffModal';
import { EmbedModal } from './components/EmbedModal';
import { LegalModals } from './components/LegalModals';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('universal');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [pricePerYard, setPricePerYard] = useState<number>(65.0);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIAL_PRESETS.gravel);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [shareToast, setShareToast] = useState(false);

  // Dynamic area list for universal takeoff
  const [areas, setAreas] = useState<AreaItem[]>([
    {
      id: '1',
      name: 'Main Section',
      shape: 'rectangle',
      length: 20,
      width: 10,
      depth: 4,
      depthUnit: 'inches',
      quantity: 1
    }
  ]);

  // Load URL query params on initial mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('tool')) {
        const t = params.get('tool') as ActiveTool;
        if (t) setActiveTool(t);
      }
      if (params.has('unit')) {
        const u = params.get('unit') as UnitSystem;
        if (u === 'imperial' || u === 'metric') setUnitSystem(u);
      }
      if (params.has('mat') && MATERIAL_PRESETS[params.get('mat')!]) {
        setSelectedMaterial(MATERIAL_PRESETS[params.get('mat')!]);
      }
      if (params.has('waste')) {
        setWastePercent(parseFloat(params.get('waste')!) || 10);
      }
      if (params.has('price')) {
        setPricePerYard(parseFloat(params.get('price')!) || 65);
      }
      if (params.has('l') && params.has('w') && params.has('d')) {
        setAreas([
          {
            id: '1',
            name: 'Main Section',
            shape: (params.get('shape') as any) || 'rectangle',
            length: parseFloat(params.get('l')!) || 20,
            width: parseFloat(params.get('w')!) || 10,
            depth: parseFloat(params.get('d')!) || 4,
            depthUnit: (params.get('du') as any) || 'inches',
            quantity: 1
          }
        ]);
      }
    } catch (e) {
      console.error('Error parsing URL parameters', e);
    }
  }, []);

  // Update URL search parameters when calculation changes
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      params.set('tool', activeTool);
      params.set('unit', unitSystem);
      params.set('mat', selectedMaterial.id);
      params.set('waste', wastePercent.toString());
      params.set('price', pricePerYard.toString());
      if (areas.length > 0) {
        params.set('shape', areas[0].shape);
        params.set('l', areas[0].length.toString());
        params.set('w', areas[0].width.toString());
        params.set('d', areas[0].depth.toString());
        params.set('du', areas[0].depthUnit);
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    } catch (e) {
      console.error('Error updating URL parameters', e);
    }
  }, [activeTool, unitSystem, selectedMaterial, wastePercent, pricePerYard, areas]);

  // Master calculation engine results
  const results = useMemo(() => {
    return calculateTakeoff(areas, selectedMaterial, wastePercent, pricePerYard, unitSystem);
  }, [areas, selectedMaterial, wastePercent, pricePerYard, unitSystem]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    });
  };

  const toolTabs: { id: ActiveTool; label: string; icon: string }[] = [
    { id: 'universal', label: 'Universal Yardage', icon: '⚡' },
    { id: 'slab', label: 'Concrete Slabs', icon: '■' },
    { id: 'footing', label: 'Footings & Piers', icon: '●' },
    { id: 'dirt', label: 'Dirt & Topsoil', icon: '🌱' },
    { id: 'gravel', label: 'Gravel & Rock', icon: '🪨' },
    { id: 'sand', label: 'Sand & Paver', icon: '🏖️' },
    { id: 'block', label: 'CMU Blocks', icon: '🧱' },
    { id: 'fence', label: 'Fence Posts', icon: '🪵' },
    { id: 'stairs', label: 'Concrete Stairs', icon: '▲' },
    { id: 'driveway', label: 'Driveway Paving', icon: '🚗' },
    { id: 'converters', label: 'Yards to Tons', icon: '⚖️' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#2C3138]">
      {/* Top Accent Strip */}
      <ColorStrip />

      {/* Main Sticky Header */}
      <Header
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        unitSystem={unitSystem}
        onToggleUnitSystem={() => setUnitSystem((prev) => (prev === 'imperial' ? 'metric' : 'imperial'))}
        onOpenTakeoffModal={() => setModalType('print')}
        onShare={handleShare}
      />

      {/* Sub-Navigation Calculator Carousel Tabs */}
      <div className="bg-[#FAF8F2] border-b border-[#E2DCB9] px-3 sm:px-6 py-2.5 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {toolTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTool(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTool === tab.id
                  ? 'bg-[#003865] text-white font-semibold shadow-xs'
                  : 'bg-white text-[#2C3138] border border-[#E2DCB9] hover:text-[#003865] hover:border-[#003865] hover:bg-[#FAF8F2] font-medium'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Calculator Body */}
      <main className="flex-grow py-6">
        {activeTool === 'universal' && (
          <UniversalCalculator
            areas={areas}
            setAreas={setAreas}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            wastePercent={wastePercent}
            setWastePercent={setWastePercent}
            pricePerYard={pricePerYard}
            setPricePerYard={setPricePerYard}
            unitSystem={unitSystem}
            results={results}
            onOpenTakeoffModal={() => setModalType('print')}
            onOpenEmbedModal={() => setModalType('embed')}
            onShare={handleShare}
          />
        )}

        {activeTool === 'slab' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <SlabCalculator unitSystem={unitSystem} />
          </div>
        )}

        {activeTool === 'footing' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <FootingCalculator unitSystem={unitSystem} />
          </div>
        )}

        {activeTool === 'dirt' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <DirtSoilCalculator unitSystem={unitSystem} />
          </div>
        )}

        {activeTool === 'gravel' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <GravelRockCalculator unitSystem={unitSystem} />
          </div>
        )}

        {activeTool === 'sand' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <SandCalculator unitSystem={unitSystem} />
          </div>
        )}

        {activeTool === 'block' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <ConcreteBlockCalculator unitSystem={unitSystem} />
          </div>
        )}

        {activeTool === 'fence' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <FencePostCalculator unitSystem={unitSystem} />
          </div>
        )}

        {activeTool === 'stairs' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <StairsCalculator unitSystem={unitSystem} />
          </div>
        )}

        {activeTool === 'driveway' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <DrivewayCostCalculator unitSystem={unitSystem} />
          </div>
        )}

        {activeTool === 'converters' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2">
            <UnitConverters unitSystem={unitSystem} />
          </div>
        )}

        {/* Step Guide */}
        <StepGuide />

        {/* 1. Middle of Page Google Ad Slot */}
        <AdSlot
          slotId="mid-page-ad-01"
          label="Advertisement"
          adFormat="auto"
        />

        {/* Reference & Master Density Tables */}
        <ReferenceTables />

        {/* Searchable FAQ Section */}
        <FAQSection />

        {/* 2. Pre-Footer Google Ad Slot */}
        <AdSlot
          slotId="pre-footer-ad-02"
          label="Sponsored Links"
          adFormat="auto"
        />
      </main>

      {/* Footer */}
      <Footer
        onSelectTool={setActiveTool}
        onOpenModal={(m) => setModalType(m)}
      />

      {/* Job Takeoff & Print Quotation Modal */}
      <JobTakeoffModal
        isOpen={modalType === 'print'}
        onClose={() => setModalType(null)}
        areas={areas}
        material={selectedMaterial}
        results={results}
        pricePerYard={pricePerYard}
        unitSystem={unitSystem}
      />

      {/* Embed Code Modal */}
      <EmbedModal
        isOpen={modalType === 'embed'}
        onClose={() => setModalType(null)}
      />

      {/* Trust & Legal Modals */}
      <LegalModals
        modalType={modalType}
        onClose={() => setModalType(null)}
      />

      {/* Share Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#003865] text-white border border-[#E2DCB9] px-4 py-3 rounded-xl shadow-xl font-medium text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="text-[#1BB954] font-bold">✓</span>
          <span>Shareable link copied to clipboard</span>
        </div>
      )}
    </div>
  );
}
