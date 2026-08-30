import React from 'react';
import { ModalType } from '../types';
import { X, ShieldAlert, Mail, Info, FileText, CheckCircle } from 'lucide-react';

interface LegalModalsProps {
  modalType: ModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ modalType, onClose }) => {
  if (!modalType || ['share', 'print', 'embed'].includes(modalType)) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#003865]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#E2DCB9] flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-[#003865] text-white p-4 px-6 flex items-center justify-between border-b border-[#002b4d]">
          <div className="flex items-center gap-2">
            {modalType === 'disclaimer' && <ShieldAlert className="w-5 h-5 text-[#FBAF3C]" />}
            {modalType === 'about' && <Info className="w-5 h-5 text-[#FBAF3C]" />}
            {modalType === 'contact' && <Mail className="w-5 h-5 text-[#FBAF3C]" />}
            {(modalType === 'privacy' || modalType === 'terms') && <FileText className="w-5 h-5 text-[#FBAF3C]" />}
            <h3 className="font-bold text-sm sm:text-base capitalize">
              {modalType === 'about' && 'About CubicYardHub Engineering'}
              {modalType === 'contact' && 'Contact & Engineering Support'}
              {modalType === 'privacy' && 'Privacy Policy'}
              {modalType === 'terms' && 'Terms and Conditions of Use'}
              {modalType === 'disclaimer' && 'Construction & Material Disclaimer'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-[#EFE6C8] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#2C3138] leading-relaxed">
          {modalType === 'about' && (
            <>
              <p>
                <strong className="text-[#003865]">CubicYardHub</strong> was created by civil engineers and construction software developers to solve the frustrations of outdated, ad-cluttered online calculators.
              </p>
              <p>
                Our mission is to provide an instant, mathematically verified volume takeoff engine that helps homeowners, DIY builders, and professional contractors avoid costly material overages, short loads, and pickup truck axle overloading.
              </p>
              <div className="bg-[#FAF8F2] border border-[#E2DCB9] p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-[#003865]">Core Platform Highlights:</div>
                <ul className="list-disc list-inside space-y-1 text-[#828892]">
                  <li>Standardized cubic yard (27 cu ft) geometric calculations for slabs, cylinders, triangles, and trenches.</li>
                  <li>Real-time material density indexing (gravel, topsoil, sand, ready-mix concrete, mulch, asphalt).</li>
                  <li>Dynamic vehicle hauling safety checks against standard 1/2-Ton (F-150 / 1500) payload limits.</li>
                  <li>Client-side performance with zero latency and 1-click URL state sharing.</li>
                </ul>
              </div>
            </>
          )}

          {modalType === 'contact' && (
            <>
              <p>
                Have questions, suggestions, or need a custom material density preset added to our engine? We welcome feedback from contractors, landscape architects, and DIYers.
              </p>
              <div className="bg-[#FAF8F2] border border-[#E2DCB9] p-4 rounded-xl space-y-2 text-xs">
                <div><strong className="text-[#003865]">Email Support:</strong> <span className="text-[#003865] font-mono font-semibold ml-1">support@cubicyardhub.com</span></div>
                <div><strong className="text-[#003865]">Technical Team:</strong> <span className="text-[#003865] font-mono font-semibold ml-1">engineering@cubicyardhub.com</span></div>
                <div className="text-[#828892] pt-1">We typically reply within 24 hours on standard business days.</div>
              </div>
              <div className="pt-2 text-xs text-[#828892] border-t border-[#E2DCB9]">
                <strong className="text-[#003865] block mb-1">Engineering Reference Standards:</strong>
                Calculations strictly follow American Concrete Institute (ACI 318 / ACI 301), ASTM C29 / C128 aggregate density testing protocols, and Federal Highway Administration (FHWA) haul safety guidelines.
              </div>
            </>
          )}

          {modalType === 'privacy' && (
            <>
              <p>
                At <strong className="text-[#003865]">CubicYardHub</strong>, we respect your privacy. All project calculations, custom measurements, pricing inputs, and section layouts are processed strictly <strong>client-side inside your browser</strong>.
              </p>
              <p>
                We do not store, sell, or transmit your project estimates to third parties. We use standard anonymous analytics to track aggregate website usage and monitor Core Web Vitals performance.
              </p>
            </>
          )}

          {modalType === 'terms' && (
            <>
              <p>
                By using CubicYardHub, you agree to utilize our calculation engines for informational and estimating purposes. All mathematical equations are based on standard nominal dimensions and published loose bulk material densities.
              </p>
              <p>
                You may embed our calculator widgets on third-party contractor or supply websites provided that reciprocal attribution links remain intact.
              </p>
            </>
          )}

          {modalType === 'disclaimer' && (
            <>
              <div className="bg-[#FAF8F2] border border-[#E2DCB9] p-3.5 rounded-xl text-[#003865] font-semibold text-xs">
                ⚠️ Estimates are for preliminary planning purposes only. Real-world material densities vary based on moisture content, quarry grading, and subgrade compaction.
              </div>
              <p>
                <strong className="text-[#003865]">1. Material Moisture & Compaction:</strong> Wet or rain-saturated sand and topsoil can weigh 15% to 30% more than dry loose material. Aggregates and road bases compact by 10% to 20% once tamped with a plate compactor.
              </p>
              <p>
                <strong className="text-[#003865]">2. Vehicle Payload Limits:</strong> Always verify your truck’s door-jamb GVWR sticker and owner manual before loading bulk materials into your truck bed. CubicYardHub assumes no liability for vehicle damage, broken leaf springs, or road safety incidents.
              </p>
              <p>
                <strong className="text-[#003865]">3. Ready-Mix Concrete Ordering:</strong> Always confirm exact forms depth and subgrade prep prior to scheduling ready-mix batch delivery.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F2] p-3 px-6 border-t border-[#E2DCB9] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#003865] hover:bg-[#002b4d] text-white font-semibold px-4 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
