import React from 'react';
import { Ruler, Calculator, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';

export const StepGuide: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Measure Project Boundaries',
      desc: 'Measure the length and width of your area in feet. For irregular shapes, split your layout into smaller squares and rectangles.',
      icon: Ruler,
      highlight: 'Length (ft) × Width (ft)'
    },
    {
      num: 2,
      title: 'Convert Depth to Feet',
      desc: 'Since depth is usually measured in inches, divide your inches by 12 (e.g. 4 inches ÷ 12 = 0.333 ft; 6 inches ÷ 12 = 0.50 ft).',
      icon: Calculator,
      highlight: 'Depth in inches ÷ 12'
    },
    {
      num: 3,
      title: 'Calculate Cubic Feet (ft³)',
      desc: 'Multiply Length (ft) × Width (ft) × Depth (ft) to calculate the total solid volume in cubic feet.',
      icon: Calculator,
      highlight: 'L × W × D = Cubic Feet'
    },
    {
      num: 4,
      title: 'Divide by 27 for Cubic Yards',
      desc: 'Divide your total cubic feet by 27. There are exactly 27 cubic feet in one cubic yard (3 ft × 3 ft × 3 ft = 27 cu ft).',
      icon: ShoppingCart,
      highlight: 'Cubic Feet ÷ 27 = Yards'
    },
    {
      num: 5,
      title: 'Add 10% Waste & Check Payload',
      desc: 'Add a 5% to 15% safety buffer for compaction, settling, and uneven grade. Check total weight against truck bed capacity before hauling.',
      icon: Truck,
      highlight: '+10% Buffer Recommended'
    }
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest">
          Contractor Field Best Practices
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          How to Calculate Cubic Yards in 5 Simple Steps
        </h2>
        <p className="text-xs text-[#828892] max-w-xl mx-auto leading-relaxed">
          Follow the industry standard calculation formula to avoid costly short-load delivery fees and material runouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white border border-[#E2DCB9] rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3 relative hover:border-[#003865] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#003865] text-[#FBAF3C] font-bold text-xs flex items-center justify-center">
                    {step.num}
                  </div>
                  <Icon className="w-4 h-4 text-[#828892]" />
                </div>
                <h3 className="font-bold text-xs text-[#003865] leading-snug">{step.title}</h3>
                <p className="text-[11px] text-[#828892] mt-1.5 leading-relaxed">{step.desc}</p>
              </div>

              <div className="bg-[#FAF8F2] border border-[#E2DCB9] rounded-lg p-2 text-center text-[10px] font-bold text-[#003865] font-mono">
                {step.highlight}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
