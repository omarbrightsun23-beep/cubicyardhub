import React, { useState } from 'react';
import { COMMON_PROJECT_ROWS } from '../data/guides';
import { MATERIAL_PRESETS } from '../data/materials';
import { formatNumber } from '../utils/calculator';
import { Table, Search, Scale, Layers } from 'lucide-react';

export const ReferenceTables: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = COMMON_PROJECT_ROWS.filter((row) =>
    row.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.dimensions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="reference-tables" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Table 1: Common Project Dimensions & Volume */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              Quick Rule-of-Thumb Benchmarks
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
              Cubic Yard Reference Table for Common Projects
            </h2>
            <p className="text-xs text-[#828892] mt-0.5 leading-relaxed">
              Standard patio slabs, garage floors, driveways, garden beds, and footings with estimated cubic yards and weight.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#828892]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E2DCB9] rounded-lg text-xs font-semibold text-[#2C3138] focus:border-[#003865] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E2DCB9] shadow-xs bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#003865] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Project Type</th>
                <th className="py-3 px-3">Dimensions</th>
                <th className="py-3 px-3">Depth</th>
                <th className="py-3 px-3">Cubic Feet</th>
                <th className="py-3 px-4 font-bold text-[#FBAF3C]">Cubic Yards (yd³)</th>
                <th className="py-3 px-3">Concrete (Tons)</th>
                <th className="py-3 px-3">Gravel (Tons)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DCB9]">
              {filteredProjects.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-[#FAF8F2]' : 'bg-white hover:bg-[#EFE6C8]/40 transition-colors'}>
                  <td className="py-3 px-4 font-bold text-[#003865]">{row.project}</td>
                  <td className="py-3 px-3 text-[#2C3138] font-mono">{row.dimensions}</td>
                  <td className="py-3 px-3 text-[#2C3138] font-semibold">{row.depthInches}"</td>
                  <td className="py-3 px-3 text-[#828892] font-mono">{row.cuFt} ft³</td>
                  <td className="py-3 px-4 font-bold text-[#003865] font-mono text-sm">{row.cuYards} yd³</td>
                  <td className="py-3 px-3 text-[#2C3138] font-mono">{row.weightTonsConcrete} t</td>
                  <td className="py-3 px-3 text-[#2C3138] font-mono">{row.weightTonsGravel} t</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Material Density & Tonnage Master Index */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest mb-1.5">
            Bulk Quarry & Supplier Densities
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#003865] tracking-tight">
            Material Density & Weight Chart (per Cubic Yard)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.values(MATERIAL_PRESETS).map((mat) => (
            <div key={mat.id} className="bg-white border border-[#E2DCB9] hover:border-[#003865] rounded-xl p-4 shadow-xs space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#003865]">{mat.name}</span>
                <span className="text-[10px] font-bold bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] px-2 py-0.5 rounded">
                  {mat.tonsPerYard} Tons / yd³
                </span>
              </div>
              <p className="text-[11px] text-[#828892] leading-snug">{mat.description}</p>
              <div className="pt-2 border-t border-[#E2DCB9] flex items-center justify-between text-[10px] text-[#828892] font-mono">
                <span>{mat.densityLbs.toLocaleString()} lbs/yd³</span>
                <span>Rec. Buffer: +{mat.compactionRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
