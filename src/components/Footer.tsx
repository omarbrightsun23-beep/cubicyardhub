import React from 'react';
import { ActiveTool, ModalType } from '../types';

interface FooterProps {
  onSelectTool: (tool: ActiveTool) => void;
  onOpenModal: (modal: ModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool, onOpenModal }) => {
  return (
    <footer className="bg-[#003865] text-[#EFE6C8] pt-14 pb-12 border-t border-[#002b4d] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12 border-b border-[#002b4d]/80">
          {/* Brand Col */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 space-y-3.5 pr-0 lg:pr-6">
            <button
              onClick={() => onSelectTool('universal')}
              className="text-left focus:outline-none cursor-pointer group block"
            >
              <img
                src="/logo-brand-dark.svg"
                alt="CubicYardHub.com"
                className="h-10 sm:h-12 w-auto max-w-[250px] sm:max-w-[280px] object-contain group-hover:opacity-90 transition-opacity"
              />
            </button>
            <p className="text-xs text-[#EFE6C8]/80 leading-relaxed max-w-sm">
              Professional volume takeoff, tonnage conversion, retail bag equivalents, and hauling payload safety engine for construction and landscaping.
            </p>
            <div className="text-[11px] text-[#FAF8F2]/60">
              © 2026 CubicYardHub. All rights reserved.
            </div>
          </div>

          {/* Col 1: Bulk Materials */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBAF3C] mb-3">
              Bulk Materials
            </h4>
            <ul className="space-y-2 text-xs text-[#EFE6C8]">
              <li>
                <button onClick={() => onSelectTool('dirt')} className="hover:text-white transition-colors text-left">
                  Dirt & Topsoil Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('gravel')} className="hover:text-white transition-colors text-left">
                  Gravel & Crushed Stone
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('sand')} className="hover:text-white transition-colors text-left">
                  Construction Sand
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('gravel')} className="hover:text-white transition-colors text-left">
                  Pea Gravel & River Rock
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('universal')} className="hover:text-white transition-colors text-left">
                  Bark & Wood Mulch
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Concrete & Masonry */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBAF3C] mb-3">
              Concrete & Masonry
            </h4>
            <ul className="space-y-2 text-xs text-[#EFE6C8]">
              <li>
                <button onClick={() => onSelectTool('slab')} className="hover:text-white transition-colors text-left">
                  Concrete Slab & Patio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('footing')} className="hover:text-white transition-colors text-left">
                  Footing & Sonotube Piers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('block')} className="hover:text-white transition-colors text-left">
                  Concrete Block CMU Walls
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('fence')} className="hover:text-white transition-colors text-left">
                  Fence Post Concrete Holes
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('stairs')} className="hover:text-white transition-colors text-left">
                  Concrete Steps & Stairs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Cost & Converters */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBAF3C] mb-3">
              Cost & Converters
            </h4>
            <ul className="space-y-2 text-xs text-[#EFE6C8]">
              <li>
                <button onClick={() => onSelectTool('driveway')} className="hover:text-white transition-colors text-left">
                  Driveway Cost Estimator
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('converters')} className="hover:text-white transition-colors text-left">
                  Yards to Tons Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('converters')} className="hover:text-white transition-colors text-left">
                  Tons to Cubic Yards Converter
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('converters')} className="hover:text-white transition-colors text-left">
                  Cubic Feet to Cubic Yards
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('converters')} className="hover:text-white transition-colors text-left">
                  Square Feet to Cubic Yards
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBAF3C] mb-3">
              Trust & Engineering
            </h4>
            <ul className="space-y-2 text-xs text-[#EFE6C8]">
              <li>
                <button onClick={() => onOpenModal('about')} className="hover:text-white transition-colors text-left">
                  About Our Team
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal('contact')} className="hover:text-white transition-colors text-left">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal('disclaimer')} className="hover:text-white transition-colors text-left text-white font-medium">
                  Material Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal('privacy')} className="hover:text-white transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal('terms')} className="hover:text-white transition-colors text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 text-center text-[11px] text-[#FAF8F2]/60 leading-relaxed">
          All calculations are mathematical estimates based on standard material densities. Verify exact volume with local ready-mix dispatchers and aggregate quarries prior to pouring or ordering.
        </div>
      </div>
    </footer>
  );
};
