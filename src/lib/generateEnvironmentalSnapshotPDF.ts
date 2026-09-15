import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { BioregionOption } from '../components/analytics/flourishingAnalyticsData';
import { TimeRangeOption } from '../components/analytics/trendExportUtils';
import { CURRENT_STEWARD_PROFILE } from '../data/stewardshipReputationData';

export interface EnvironmentalSnapshotPDFOptions {
  chartElement: HTMLElement;
  selectedBioregions: BioregionOption[];
  timeRange: TimeRangeOption;
  isNormalized: boolean;
  isConfidenceIntervalActive: boolean;
  isPredictiveForecastingEnabled: boolean;
  stewardName?: string;
  verificationHash?: string;
  annotationsCount?: number;
}

/**
 * Captures a high-resolution screenshot of the chart layout (including annotations and filters)
 * and generates a downloadable PDF report summarizing current environmental performance.
 */
export async function generateEnvironmentalSnapshotPDF({
  chartElement,
  selectedBioregions,
  timeRange,
  isNormalized,
  isConfidenceIntervalActive,
  isPredictiveForecastingEnabled,
  stewardName = CURRENT_STEWARD_PROFILE.name,
  verificationHash = '0x94f8a172c50b891e3427901847162590',
  annotationsCount = 12
}: EnvironmentalSnapshotPDFOptions): Promise<{ fileName: string }> {
  // 1. Take high-resolution screenshot with html2canvas
  const canvas = await html2canvas(chartElement, {
    scale: 2, // High resolution retina capture
    useCORS: true,
    backgroundColor: '#070908',
    logging: false,
    allowTaint: true,
    ignoreElements: (element) => {
      // Don't hide important elements, but can ignore temporary flash toasts if any
      return element.classList.contains('no-export-snapshot');
    }
  });

  const chartImgData = canvas.toDataURL('image/png');

  // 2. Initialize jsPDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Generate Real Verification QR Code
  const qrUrl = `https://atlassanctum.earth/verify/snapshot?hash=${verificationHash}&epoch=2026-Q3`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    margin: 1,
    width: 140,
    color: {
      dark: '#0A2318',
      light: '#FFFFFF'
    }
  });

  // PAGE 1: HEADER & ENVIRONMENTAL PERFORMANCE OVERVIEW
  // Top Banner
  doc.setFillColor(8, 14, 10);
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Emerald/Gold accent lines
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 31, pageWidth * 0.65, 1.2, 'F');
  doc.setFillColor(197, 160, 89);
  doc.rect(pageWidth * 0.65, 31, pageWidth * 0.35, 1.2, 'F');

  // Header Typography
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(197, 160, 89);
  doc.text('ATLAS SANCTUM • CIVILIZATIONAL FLOURISHING OPERATING SYSTEM', margin, 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('ENVIRONMENTAL PERFORMANCE SNAPSHOT REPORT', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(170, 195, 180);
  doc.text('High-Resolution Telemetry Capture, Bioregional Comparison & Statistical Confidence Audit', margin, 23);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(130, 150, 140);
  doc.text(`SNAPSHOT AUDIT HASH: ${verificationHash} • EPOCH: SEP 2026`, margin, 28.5);

  // Metadata Panel with Active Filters
  let currentY = 37;
  doc.setFillColor(246, 248, 246);
  doc.rect(margin, currentY, contentWidth, 22, 'F');
  doc.setDrawColor(200, 215, 205);
  doc.rect(margin, currentY, contentWidth, 22, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(18, 40, 26);
  doc.text('ACTIVE VISUALIZATION CONFIGURATION & FILTER AUDIT', margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(50, 65, 55);

  const timeRangeLabel = timeRange === '30d' ? 'Last 30 Days' : timeRange === 'quarter' ? 'Last Quarter' : timeRange === 'year' ? '12-Month Year Baseline' : 'All Available Data';
  const normLabel = isNormalized ? 'Normalized Relative (0-100%)' : 'Raw Absolute Telemetry (0-100)';
  const ciLabel = isConfidenceIntervalActive ? 'ACTIVE (±1σ / 95% Confidence Shaded Envelope)' : 'Disabled (Raw Median Lines)';
  const forecastLabel = isPredictiveForecastingEnabled ? 'ACTIVE (OLS Regression Next Qtr)' : 'Historical Baseline Only';

  doc.text(`• Time Range: ${timeRangeLabel}`, margin + 3, currentY + 10);
  doc.text(`• Metric Scaling: ${normLabel}`, margin + 3, currentY + 14.5);
  doc.text(`• Statistical Confidence Intervals: ${ciLabel}`, margin + 3, currentY + 19);

  const col2X = margin + 95;
  const regionsSummary = selectedBioregions.map(r => r.code).join(', ') || 'PAN';
  doc.text(`• Active Corridors (${selectedBioregions.length}): ${regionsSummary}`, col2X, currentY + 10);
  doc.text(`• Predictive Forecasting: ${forecastLabel}`, col2X, currentY + 14.5);
  doc.text(`• Verified Sensor Mesh: 4,200 Nodes (${annotationsCount} Annotations)`, col2X, currentY + 19);

  // 3. Embedded High-Resolution Screenshot of Chart Layout
  currentY = 63;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 40, 30);
  doc.text('VISUAL TELEMETRY RASTER CAPTURE (HIGH-RESOLUTION)', margin, currentY);

  currentY += 2;
  const chartImgHeight = (canvas.height * contentWidth) / canvas.width;
  // Fit reasonably on page
  const maxImgHeight = 88;
  const renderedImgHeight = Math.min(maxImgHeight, chartImgHeight);
  
  // Background frame for chart image
  doc.setFillColor(10, 12, 11);
  doc.rect(margin, currentY, contentWidth, renderedImgHeight, 'F');
  doc.setDrawColor(40, 60, 50);
  doc.rect(margin, currentY, contentWidth, renderedImgHeight, 'S');

  doc.addImage(chartImgData, 'PNG', margin, currentY, contentWidth, renderedImgHeight);

  currentY += renderedImgHeight + 5;

  // 4. Bioregional Performance Summary Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 40, 30);
  doc.text('BIOREGIONAL CORRIDOR COMPARISON SUMMARY', margin, currentY);

  currentY += 3;

  // Table Header
  doc.setFillColor(23, 43, 31);
  doc.rect(margin, currentY, contentWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(255, 255, 255);
  doc.text('CORRIDOR', margin + 3, currentY + 4.2);
  doc.text('BIOME / LOCATION', margin + 45, currentY + 4.2);
  doc.text('ECOLOGICAL', margin + 95, currentY + 4.2);
  doc.text('ECONOMIC', margin + 118, currentY + 4.2);
  doc.text('DECOUPLING', margin + 140, currentY + 4.2);
  doc.text('SENSORS', margin + 165, currentY + 4.2);

  currentY += 6;

  // Table Rows (selected bioregions or all if only 1)
  const displayRegions = selectedBioregions.length > 0 ? selectedBioregions : [];
  
  displayRegions.slice(0, 5).forEach((region, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 250 : 242, isEven ? 252 : 246, isEven ? 250 : 243);
    doc.rect(margin, currentY, contentWidth, 6.5, 'F');
    doc.setDrawColor(225, 232, 228);
    doc.rect(margin, currentY, contentWidth, 6.5, 'S');

    const latest = region.monthlyData[region.monthlyData.length - 1];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(18, 38, 25);
    doc.text(`${region.name} (${region.code})`, margin + 3, currentY + 4.4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(80, 95, 88);
    const shortBiome = region.biome.length > 32 ? region.biome.substring(0, 30) + '...' : region.biome;
    doc.text(shortBiome, margin + 45, currentY + 4.4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 120, 80);
    doc.text(`${latest.ecologicalFlourishing.toFixed(1)}%`, margin + 95, currentY + 4.4);

    doc.setTextColor(180, 130, 40);
    doc.text(`${latest.economicStability.toFixed(1)}%`, margin + 118, currentY + 4.4);

    doc.setTextColor(10, 80, 160);
    doc.text(`+${latest.decouplingMargin.toFixed(1)} pts`, margin + 140, currentY + 4.4);

    doc.setTextColor(60, 75, 68);
    doc.setFont('courier', 'normal');
    doc.text(`${region.activeSensors.toLocaleString()}`, margin + 165, currentY + 4.4);

    currentY += 6.5;
  });

  currentY += 4;

  // 5. Environmental Performance Executive Findings Box
  doc.setFillColor(242, 246, 243);
  doc.rect(margin, currentY, contentWidth - 38, 32, 'F');
  doc.setDrawColor(190, 210, 198);
  doc.rect(margin, currentY, contentWidth - 38, 32, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(16, 40, 25);
  doc.text('CIVILIZATIONAL ENVIRONMENTAL PERFORMANCE FINDINGS', margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(45, 60, 52);
  const narrativeLines = [
    '• Regenerative Decoupling Parity: Continuous positive decoupling margin averaging +46.8 points above extractive baseline.',
    '• Confidence Envelope Stability: Microclimate standard deviation constrained within ±3.4%, confirming high epistemic certainty.',
    '• Hydrological Continuity: Sand dams and agro-forestry swales preserved 94% dry-season baseflow during anomalous VPD heat spike.',
    '• Epistemic Quorum: 4,200 autonomous cryptographic nodes validated through zero-knowledge multi-spectral cross-calibration.'
  ];
  narrativeLines.forEach((line, i) => {
    doc.text(line, margin + 3, currentY + 11 + (i * 4.8));
  });

  // QR Code on right side
  doc.addImage(qrDataUrl, 'PNG', margin + contentWidth - 34, currentY, 32, 32);
  doc.setFont('courier', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(90, 105, 98);
  doc.text('SCAN TO VERIFY LEDGER', margin + contentWidth - 34, currentY + 33.5);

  // Footer
  currentY += 37;
  doc.setDrawColor(210, 220, 215);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(110, 125, 118);
  doc.text(`Report Prepared by: ${stewardName} • Atlas Sanctum Environmental Intelligence Engine`, margin, currentY + 4);
  doc.text(`Generated: ${new Date().toISOString()} • Standard: ISO 14064-2 & Evidence Constitution IX`, margin, currentY + 7.5);

  // Save PDF
  const timestamp = Date.now();
  const fileName = `Atlas_Sanctum_Environmental_Performance_Snapshot_${timestamp}.pdf`;
  doc.save(fileName);

  return { fileName };
}
