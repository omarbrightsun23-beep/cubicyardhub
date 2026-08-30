import React, { useState } from 'react';
import { AreaItem, CalculationResults, MaterialPreset, UnitSystem } from '../types';
import { calculateAreaVolume, formatCurrency, formatNumber } from '../utils/calculator';
import { X, Printer, FileText, Check, Download, Table, Sparkles, Building, Phone, Calendar, ArrowDownToLine } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface JobTakeoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  areas: AreaItem[];
  material: MaterialPreset;
  results: CalculationResults;
  pricePerYard: number;
  unitSystem: UnitSystem;
}

export const JobTakeoffModal: React.FC<JobTakeoffModalProps> = ({
  isOpen,
  onClose,
  areas,
  material,
  results,
  pricePerYard,
  unitSystem
}) => {
  const [contractorName, setContractorName] = useState('Apex Construction & Paving');
  const [contractorPhone, setContractorPhone] = useState('(555) 382-9104');
  const [clientName, setClientName] = useState('Valued Client');
  const [jobAddress, setJobAddress] = useState('100 Main Street, Project Site');
  const [laborMarkupPercent, setLaborMarkupPercent] = useState<number>(20);
  const [notes, setNotes] = useState(
    'Estimate valid for 30 days. Material quantities include standard compaction and subgrade safety buffer.'
  );
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const materialSubtotal = results.totalCost;
  const markupAmount = materialSubtotal * (laborMarkupPercent / 100);
  const grandTotal = materialSubtotal + markupAmount;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const quoteRefNumber = `CYH-${Math.floor(100000 + Math.random() * 900000)}`;

  // Direct Vector PDF Generation (.pdf format) using jsPDF
  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
      });

      const pageWidth = 612;
      const pageHeight = 792;
      const margin = 40;
      const contentWidth = pageWidth - margin * 2; // 532pt
      let y = margin;

      // 1. Top Decorative Bar
      doc.setFillColor(0, 56, 101); // Navy #003865
      doc.rect(0, 0, pageWidth, 8, 'F');

      // 2. Header Banner
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(0, 56, 101);
      doc.text('CubicYardHub Takeoff Report', margin, y + 20);

      // Gold Accent dot
      doc.setFillColor(251, 175, 60);
      doc.circle(margin + 295, y + 14, 4, 'F');

      // Reference Badge
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(250, 248, 242);
      doc.setDrawColor(226, 220, 185);
      doc.roundedRect(pageWidth - margin - 140, y + 4, 140, 22, 4, 4, 'FD');
      doc.setTextColor(0, 56, 101);
      doc.text(`Ref: ${quoteRefNumber}`, pageWidth - margin - 130, y + 19);

      y += 45;

      // 3. Contractor & Client Two-Column Meta Box
      doc.setFillColor(250, 248, 242);
      doc.setDrawColor(226, 220, 185);
      doc.roundedRect(margin, y, contentWidth, 70, 6, 6, 'FD');

      // Left column: Contractor
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(130, 136, 146);
      doc.text('CONTRACTOR DETAILS', margin + 14, y + 18);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 56, 101);
      doc.text(contractorName || 'Apex Construction', margin + 14, y + 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(44, 49, 56);
      doc.text(`Phone: ${contractorPhone || '(555) 000-0000'}`, margin + 14, y + 52);
      doc.text(`Date: ${currentDate}`, margin + 14, y + 64);

      // Right column: Client & Site
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(130, 136, 146);
      doc.text('PREPARED FOR', margin + contentWidth / 2 + 10, y + 18);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 56, 101);
      doc.text(clientName || 'Valued Client', margin + contentWidth / 2 + 10, y + 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(44, 49, 56);
      doc.text(`Project Site: ${jobAddress || 'Project Location'}`, margin + contentWidth / 2 + 10, y + 52);
      doc.text(`Material Preset: ${material.name}`, margin + contentWidth / 2 + 10, y + 64);

      y += 85;

      // 4. Itemized Sections Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 56, 101);
      doc.text('ITEMIZED JOB SECTION BREAKDOWN', margin, y + 10);
      y += 18;

      // Table Header Row
      doc.setFillColor(0, 56, 101);
      doc.rect(margin, y, contentWidth, 22, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('SECTION / AREA', margin + 10, y + 15);
      doc.text('SHAPE', margin + 160, y + 15);
      doc.text('DIMENSIONS', margin + 240, y + 15);
      doc.text('THICKNESS', margin + 350, y + 15);
      doc.text('VOLUME (YD³)', margin + 440, y + 15);

      y += 22;

      // Table Rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      areas.forEach((area, index) => {
        const { cuFt } = calculateAreaVolume(area, unitSystem);
        const cuYds = cuFt / 27;

        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(255, 255, 255);
        } else {
          doc.setFillColor(250, 248, 242);
        }
        doc.rect(margin, y, contentWidth, 20, 'F');
        doc.setDrawColor(226, 220, 185);
        doc.line(margin, y + 20, margin + contentWidth, y + 20);

        doc.setTextColor(0, 56, 101);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${area.name}`, margin + 10, y + 14);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(44, 49, 56);
        doc.text(area.shape.toUpperCase(), margin + 160, y + 14);
        doc.text(
          `${area.length} × ${area.width || area.topWidth || '—'} ${unitSystem === 'metric' ? 'm' : 'ft'}`,
          margin + 240,
          y + 14
        );
        doc.text(`${area.depth} ${area.depthUnit}`, margin + 350, y + 14);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 56, 101);
        doc.text(`${formatNumber(cuYds, 2)} yd³`, margin + 440, y + 14);

        y += 20;
      });

      y += 15;

      // 5. Four Key Summary Metric Boxes
      const boxWidth = (contentWidth - 18) / 4; // ~128pt each
      const boxHeight = 52;

      const metrics = [
        { label: 'NET VOLUME', val: `${formatNumber(results.totalCuYards, 2)} yd³`, sub: `+${results.wastePercent}% buffer` },
        { label: 'TOTAL WEIGHT', val: `${formatNumber(results.totalTons, 2)} Tons`, sub: `${Math.round(results.totalLbs).toLocaleString()} lbs` },
        { label: '80 LB BAGS', val: `${results.bags80lb.toLocaleString()}`, sub: 'Retail pre-mix' },
        { label: '1/2 TON TRIPS', val: `${results.pickupTripsHalfTon} Trips`, sub: 'F-150 / 1500 payload' }
      ];

      metrics.forEach((m, idx) => {
        const bx = margin + idx * (boxWidth + 6);
        doc.setFillColor(250, 248, 242);
        doc.setDrawColor(226, 220, 185);
        doc.roundedRect(bx, y, boxWidth, boxHeight, 4, 4, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(130, 136, 146);
        doc.text(m.label, bx + boxWidth / 2, y + 14, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 56, 101);
        doc.text(m.val, bx + boxWidth / 2, y + 30, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(130, 136, 146);
        doc.text(m.sub, bx + boxWidth / 2, y + 43, { align: 'center' });
      });

      y += boxHeight + 20;

      // 6. Notes & Financial Cost Summary Box
      const notesWidth = contentWidth - 210;
      const pricingWidth = 195;

      // Notes Box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 220, 185);
      doc.roundedRect(margin, y, notesWidth, 75, 4, 4, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 56, 101);
      doc.text('TERMS & SCOPE OF WORK:', margin + 10, y + 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(44, 49, 56);
      const splitNotes = doc.splitTextToSize(notes || 'Quantities calculated with subgrade safety buffer.', notesWidth - 20);
      doc.text(splitNotes, margin + 10, y + 30);

      // Financial Totals Box
      const px = margin + notesWidth + 15;
      doc.setFillColor(250, 248, 242);
      doc.setDrawColor(226, 220, 185);
      doc.roundedRect(px, y, pricingWidth, 75, 4, 4, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(44, 49, 56);
      doc.text('Material Subtotal:', px + 10, y + 18);
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(materialSubtotal), px + pricingWidth - 10, y + 18, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.text(`Labor & Prep (${laborMarkupPercent}%):`, px + 10, y + 35);
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(markupAmount), px + pricingWidth - 10, y + 35, { align: 'right' });

      doc.setDrawColor(0, 56, 101);
      doc.setLineWidth(1);
      doc.line(px + 10, y + 44, px + pricingWidth - 10, y + 44);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 56, 101);
      doc.text('ESTIMATED TOTAL:', px + 10, y + 62);
      doc.setTextColor(27, 185, 84); // Green
      doc.text(formatCurrency(grandTotal), px + pricingWidth - 10, y + 62, { align: 'right' });

      y += 105;

      // 7. Signature Lines
      const sigWidth = (contentWidth - 30) / 2;
      doc.setDrawColor(156, 163, 175);
      doc.setLineWidth(0.8);
      doc.line(margin, y, margin + sigWidth, y);
      doc.line(margin + sigWidth + 30, y, margin + contentWidth, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(107, 114, 128);
      doc.text('Contractor Authorized Signature & Date', margin, y + 14);
      doc.text('Client Acceptance Signature & Date', margin + sigWidth + 30, y + 14);

      // 8. Footer Watermark
      doc.setFontSize(7.5);
      doc.setTextColor(156, 163, 175);
      doc.text(
        'Generated by CubicYardHub Contractor Takeoff Calculator • https://cubicyardhub.com',
        pageWidth / 2,
        pageHeight - 20,
        { align: 'center' }
      );

      // Trigger standard .pdf file download
      const filename = `takeoff-quote-${quoteRefNumber.toLowerCase()}.pdf`;
      doc.save(filename);

      setDownloadSuccess(`Downloaded ${filename} successfully!`);
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      // Fallback to print
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Browser Print trigger (also offers PDF download in toast)
  const handlePrint = () => {
    // 1. First trigger direct PDF save
    handleDownloadPDF();
    // 2. Also invoke native window.print for physical printer options
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Export to CSV for Excel / Google Sheets
  const handleExportCSV = () => {
    const headers = ['Area Name', 'Shape', 'Length', 'Width/TopWidth', 'Depth', 'Depth Unit', 'Cubic Feet', 'Cubic Yards'];
    const rows = areas.map((area) => {
      const { cuFt } = calculateAreaVolume(area, unitSystem);
      const cuYds = cuFt / 27;
      return [
        `"${area.name}"`,
        `"${area.shape}"`,
        area.length,
        area.width || area.topWidth || '',
        area.depth,
        `"${area.depthUnit}"`,
        cuFt.toFixed(2),
        cuYds.toFixed(2)
      ];
    });

    const summaryRows = [
      [],
      ['Total Net Volume (yd3)', results.totalCuYards.toFixed(2)],
      ['Safety Buffer %', results.wastePercent],
      ['Total Weight (Tons)', results.totalTons.toFixed(2)],
      ['Total Weight (Lbs)', Math.round(results.totalLbs)],
      ['80lb Pre-Mix Bags', results.bags80lb],
      ['1/2 Ton Pickup Trips', results.pickupTripsHalfTon],
      ['Material Subtotal ($)', materialSubtotal.toFixed(2)],
      ['Labor Markup %', laborMarkupPercent],
      ['Grand Total ($)', grandTotal.toFixed(2)]
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(',')),
      ...summaryRows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `takeoff-data-${quoteRefNumber.toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('CSV Spreadsheet Exported!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#003865]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-[#E2DCB9] flex flex-col max-h-[92vh] printable-takeoff-container">
        {/* Modal Header */}
        <div className="bg-[#003865] text-white p-4 px-6 flex items-center justify-between no-print border-b border-[#002b4d]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FBAF3C]" />
            <h3 className="font-bold text-sm sm:text-base">Contractor Job Site Takeoff & Quote Sheet</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="modal-print-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-[#FBAF3C] hover:bg-[#e0982b] text-[#003865] font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs active:scale-95 cursor-pointer"
              title="Download true .PDF file directly"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-[#003865]" />
              <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF (.pdf)'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[#EFE6C8] hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Status Toast */}
        {downloadSuccess && (
          <div className="bg-[#1BB954] text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 no-print transition-all">
            <Check className="w-4 h-4" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Printable Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#2C3138] text-xs sm:text-sm printable-takeoff-content">
          {/* Editable Contractor & Client Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-[#E2DCB9]">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-brand.svg"
                  alt="CubicYardHub.com"
                  className="h-10 sm:h-12 w-auto max-w-[280px] object-contain"
                />
                <span className="text-[11px] font-mono font-semibold bg-[#FAF8F2] text-[#003865] px-2 py-0.5 rounded border border-[#E2DCB9]">
                  {quoteRefNumber}
                </span>
              </div>
              <div className="text-xs text-[#828892] flex items-center gap-1 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date: {currentDate}</span>
              </div>

              {/* Editable Contractor Inputs */}
              <div className="pt-2 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-20 text-[#828892] font-semibold">Contractor:</span>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    className="flex-1 bg-[#FAF8F2] border border-[#E2DCB9] rounded px-2 py-1 text-xs text-[#003865] font-semibold focus:outline-none focus:border-[#003865]"
                    placeholder="Contractor / Company Name"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-[#828892] font-semibold">Phone:</span>
                  <input
                    type="text"
                    value={contractorPhone}
                    onChange={(e) => setContractorPhone(e.target.value)}
                    className="flex-1 bg-[#FAF8F2] border border-[#E2DCB9] rounded px-2 py-1 text-xs text-[#2C3138] focus:outline-none focus:border-[#003865]"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Editable Client Info */}
            <div className="space-y-1.5 flex-1 sm:text-right">
              <div className="text-xs font-semibold text-[#828892] uppercase tracking-wider">Prepared For:</div>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full sm:text-right bg-[#FAF8F2] border border-[#E2DCB9] rounded px-2 py-1 text-xs text-[#003865] font-bold focus:outline-none focus:border-[#003865]"
                placeholder="Client / Property Owner"
              />
              <input
                type="text"
                value={jobAddress}
                onChange={(e) => setJobAddress(e.target.value)}
                className="w-full sm:text-right bg-[#FAF8F2] border border-[#E2DCB9] rounded px-2 py-1 text-xs text-[#2C3138] focus:outline-none focus:border-[#003865]"
                placeholder="Project Site Address"
              />
              <div className="inline-block bg-[#FAF8F2] border border-[#E2DCB9] text-[#003865] px-2.5 py-0.5 rounded-full text-[11px] font-semibold mt-1">
                Material Preset: <strong>{material.name}</strong>
              </div>
            </div>
          </div>

          {/* Itemized Areas Table */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#003865] mb-2 flex items-center justify-between">
              <span>Itemized Section Breakdown ({areas.length} {areas.length === 1 ? 'Area' : 'Areas'})</span>
            </div>
            <table className="w-full text-left text-xs border border-[#E2DCB9] rounded-xl overflow-hidden">
              <thead className="bg-[#003865] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5">Area Name</th>
                  <th className="p-2.5">Shape</th>
                  <th className="p-2.5">Dimensions</th>
                  <th className="p-2.5">Thickness</th>
                  <th className="p-2.5 text-right">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCB9]">
                {areas.map((area) => {
                  const { cuFt } = calculateAreaVolume(area, unitSystem);
                  const cuYds = cuFt / 27;
                  return (
                    <tr key={area.id} className="hover:bg-[#FAF8F2] transition-colors">
                      <td className="p-2.5 font-bold text-[#003865]">{area.name}</td>
                      <td className="p-2.5 capitalize text-[#2C3138]">{area.shape}</td>
                      <td className="p-2.5 text-[#2C3138] font-mono">
                        {area.length} × {area.width || area.topWidth || '—'} {unitSystem === 'metric' ? 'm' : 'ft'}
                      </td>
                      <td className="p-2.5 font-semibold text-[#003865]">{area.depth} {area.depthUnit}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-[#003865]">
                        {formatNumber(cuYds, 2)} yd³ ({formatNumber(cuFt, 1)} ft³)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Quantities & Hauling Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F2] border border-[#E2DCB9] p-4 rounded-xl text-center">
            <div>
              <div className="text-[10px] text-[#828892] uppercase font-semibold">Total Net Volume</div>
              <div className="text-base font-bold text-[#003865] font-mono mt-0.5">
                {formatNumber(results.totalCuYards, 2)} yd³
              </div>
              <div className="text-[10px] text-[#828892]">+{results.wastePercent}% buffer included</div>
            </div>
            <div>
              <div className="text-[10px] text-[#828892] uppercase font-semibold">Total Weight</div>
              <div className="text-base font-bold text-[#003865] font-mono mt-0.5">
                {formatNumber(results.totalTons, 2)} Tons
              </div>
              <div className="text-[10px] text-[#828892]">{Math.round(results.totalLbs).toLocaleString()} lbs</div>
            </div>
            <div>
              <div className="text-[10px] text-[#828892] uppercase font-semibold">80 lb Pre-Mix Bags</div>
              <div className="text-base font-bold text-[#003865] font-mono mt-0.5">
                {results.bags80lb.toLocaleString()} Bags
              </div>
              <div className="text-[10px] text-[#828892]">Retail store count</div>
            </div>
            <div>
              <div className="text-[10px] text-[#828892] uppercase font-semibold">Pickup Trips (1/2 Ton)</div>
              <div className="text-base font-bold text-[#003865] font-mono mt-0.5">
                {results.pickupTripsHalfTon} {results.pickupTripsHalfTon === 1 ? 'Trip' : 'Trips'}
              </div>
              <div className="text-[10px] text-[#828892]">F-150 / 1500 payload</div>
            </div>
          </div>

          {/* Pricing & Total Estimate */}
          <div className="border-t border-[#E2DCB9] pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-[#828892] flex-1 max-w-sm">
              <strong className="text-[#003865]">Terms & Scope Notes:</strong>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 bg-[#FAF8F2] border border-[#E2DCB9] rounded-lg p-2 text-xs text-[#2C3138] focus:outline-none focus:border-[#003865]"
                placeholder="Job site terms, expiration dates, or site prep specifications..."
              />
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-[#2C3138] bg-[#FAF8F2] p-3 rounded-xl border border-[#E2DCB9]">
              <div className="flex justify-between">
                <span>Material ({formatNumber(results.totalCuYards, 2)} yd³ @ ${pricePerYard}):</span>
                <strong className="text-[#003865]">{formatCurrency(materialSubtotal)}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Labor Markup ({laborMarkupPercent}%):</span>
                <strong className="text-[#003865]">{formatCurrency(markupAmount)}</strong>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#003865] pt-1.5 border-t border-[#E2DCB9]">
                <span>ESTIMATED TOTAL:</span>
                <span className="text-[#1BB954] font-mono">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#FAF8F2] p-4 px-6 border-t border-[#E2DCB9] flex flex-wrap items-center justify-between gap-3 no-print">
          {/* Quick Export Formats */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-white hover:bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Download actual .PDF document file directly"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-[#FBAF3C]" />
              <span>{isGeneratingPDF ? 'Generating...' : 'Save as PDF (.pdf)'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="bg-white hover:bg-[#FAF8F2] text-[#003865] border border-[#E2DCB9] font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export raw data to CSV spreadsheet"
            >
              <Table className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-[#E2DCB9] text-[#2C3138] font-semibold px-4 py-2 rounded-lg text-xs hover:bg-[#FAF8F2] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              id="modal-print-quote-btn"
              onClick={handlePrint}
              disabled={isGeneratingPDF}
              className="bg-[#003865] hover:bg-[#002b4d] text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#FBAF3C]" />
              <span>Print / Export Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
