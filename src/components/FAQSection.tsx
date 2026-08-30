import React, { useState, useMemo } from 'react';
import { FAQ_DATA } from '../data/guides';
import { HelpCircle, ChevronDown, ChevronUp, Search, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Questions (26)' },
    { id: 'formula', label: 'Core Units & Formulas' },
    { id: 'weights', label: 'Material Weights' },
    { id: 'cost', label: 'Costs & Truckloads' },
    { id: 'concrete', label: 'Concrete, Slabs & Bags' }
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        (item.searchVolume && item.searchVolume.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-[#FBAF3C]" />
          Knowledge Base & SERP Snippets
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#003865] tracking-tight">
          Frequently Asked Takeoff & Material Questions
        </h2>
        <p className="text-xs text-[#828892] max-w-2xl mx-auto leading-relaxed">
          Snippet-ready answers to high-volume contractor calculations, material weight conversions, ready-mix batching, and hauling capacities.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative">
        <Search className="w-4 h-4 text-[#828892] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search question keywords (e.g. 'how much does a yard of concrete weigh', 'driveway', '10-yard truck')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2DCB9] rounded-xl text-xs sm:text-sm text-[#2C3138] placeholder-[#828892] focus:border-[#003865] focus:outline-none shadow-xs transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#828892] hover:text-[#003865] font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setActiveCategory(cat.id);
              setOpenIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#003865] text-white shadow-xs'
                : 'bg-white border border-[#E2DCB9] text-[#2C3138] hover:text-[#003865] hover:border-[#003865]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-white border border-[#E2DCB9] rounded-xl text-xs text-[#828892]">
            No matching questions found for "{searchQuery}". Try a different keyword or reset filters.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E2DCB9] rounded-xl overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 focus:outline-none"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <HelpCircle className="w-4 h-4 text-[#FBAF3C] shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm text-[#003865] truncate sm:whitespace-normal">
                      {faq.q}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#828892] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#828892] shrink-0" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-[#2C3138] leading-relaxed border-t border-[#E2DCB9] whitespace-pre-line bg-[#FAF8F2]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
