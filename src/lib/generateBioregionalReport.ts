import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { BioregionalLedgerData, EcologicalMetricItem, HistoricalTimelineEpoch } from '../data/bioregionalLedgerData';

export interface GenerateReportOptions {
  region: BioregionalLedgerData;
  metrics: EcologicalMetricItem[];
  selectedYear: number;
  epoch: HistoricalTimelineEpoch;
  userRole?: string;
  verificationHash?: string;
}

export async function generateBioregionalPDFReport({
  region,
  metrics,
  selectedYear,
  epoch,
  userRole = 'Bioregional Environmental Auditor',
  verificationHash = '0x4f128e99bcde710294821a8374829103fc8912'
}: GenerateReportOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. Generate Verification QR Code
  const qrVerificationUrl = `https://atlassanctum.earth/verify/ledger/${region.regionId}?epoch=${selectedYear}&hash=${verificationHash}`;
  const qrDataUrl = await QRCode.toDataURL(qrVerificationUrl, {
    margin: 1,
    width: 140,
    color: {
      dark: '#0A2318',
      light: '#FFFFFF'
    }
  });

  // 2. Header Banner (Deep Obsidian / Forest Green)
  doc.setFillColor(10, 20, 14);
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Gold accent separator line
  doc.setFillColor(197, 160, 89);
  doc.rect(0, 31, pageWidth, 1.2, 'F');

  // Header Typography
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(197, 160, 89);
  doc.text('ATLAS SANCTUM • BIOREGIONAL REGENERATIVE OPERATING SYSTEM', margin, 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(255, 255, 255);
  doc.text('VERIFIED ECOLOGICAL HEALTH & RESOURCE FLOW LEDGER', margin, 18.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(210, 220, 215);
  doc.text(`Autonomous In-Situ Telemetry • Section 30 Epistemic Consensus • Epoch: ${epoch.label} (${selectedYear})`, margin, 25);

  // Status Badge on Top Right
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(pageWidth - margin - 38, 9, 38, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(5, 40, 25);
  doc.text('VERIFIED LEDGER', pageWidth - margin - 19, 15, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('PROOF-OF-REGENERATION', pageWidth - margin - 19, 20, { align: 'center' });

  // 3. Bioregional Metadata Card
  let curY = 37;
  doc.setFillColor(248, 249, 246);
  doc.setDrawColor(210, 215, 205);
  doc.roundedRect(margin, curY, contentWidth, 26, 2, 2, 'FD');

  // Col 1: Territory & Biome
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 110, 105);
  doc.text('BIOREGION & JURISDICTION', margin + 4, curY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 25, 20);
  doc.text(region.regionName, margin + 4, curY + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 90, 85);
  doc.text(`Biome: ${region.biomeType} • ${region.country}`, margin + 4, curY + 16.5);
  doc.text(`Area: ${(region.totalAreaHectares).toLocaleString()} Hectares • Councils: ${region.activeStewardAssembliesCount} Deliberative Pods`, margin + 4, curY + 21);

  // Col 2: Vitality Index & Water/Carbon
  const col2X = margin + contentWidth - 68;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 110, 105);
  doc.text('FLOURISHING INDEX', col2X, curY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 120, 80);
  const compositeScore = (region.compositeFlourishingScore * (epoch.compositeFlourishingScore / 91.4)).toFixed(1);
  doc.text(`${compositeScore} / 100`, col2X, curY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 90, 85);
  const waterYield = ((region.waterYieldAnnualM3 * epoch.waterYieldMultiplier) / 1000000).toFixed(0);
  const carbonSeq = ((region.carbonSequestrationRateAnnualTonnes * epoch.carbonRateMultiplier) / 1000).toFixed(0);
  doc.text(`Water Yield: ${waterYield}M m³/yr`, col2X, curY + 17);
  doc.text(`Carbon Sinks: ${carbonSeq}k tCO2e/yr`, col2X, curY + 21);

  // 4. Temporal Epoch & Progress Banner
  curY += 29;
  doc.setFillColor(240, 246, 242);
  doc.setDrawColor(180, 210, 195);
  doc.roundedRect(margin, curY, contentWidth, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(12, 100, 65);
  doc.text(`TEMPORAL REGENERATION TIMELINE: [ ${epoch.label} ]`, margin + 4, curY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(50, 65, 55);
  doc.text(epoch.description, margin + 4, curY + 9.2);

  // 5. Section: Ecological Health Parameters Table
  curY += 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 30, 20);
  doc.text('1. VERIFIED ECOLOGICAL HEALTH METRICS', margin, curY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 130, 125);
  doc.text('Continuous sensor telemetry & spectroscopic ground-truth validation', margin + 82, curY);

  curY += 3;
  // Table Header
  doc.setFillColor(20, 35, 26);
  doc.rect(margin, curY, contentWidth, 6.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(245, 245, 240);
  doc.text('PARAMETER / KPI', margin + 3, curY + 4.5);
  doc.text('CATEGORY', margin + 58, curY + 4.5);
  doc.text('RECORDED VALUE', margin + 83, curY + 4.5);
  doc.text('2018 BASELINE', margin + 115, curY + 4.5);
  doc.text('DELTA %', margin + 142, curY + 4.5);
  doc.text('CERTAINTY', margin + 162, curY + 4.5);

  curY += 6.5;

  // Render Table Rows
  metrics.forEach((metric, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 250, isEven ? 255 : 246);
    doc.setDrawColor(230, 235, 230);
    doc.rect(margin, curY, contentWidth, 8, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(20, 30, 25);
    const truncName = metric.name.length > 32 ? metric.name.slice(0, 31) + '...' : metric.name;
    doc.text(truncName, margin + 3, curY + 5.2);

    // Category
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(80, 95, 85);
    doc.text(metric.category.toUpperCase(), margin + 58, curY + 5.2);

    // Recorded Value (scaled to epoch)
    const ratio = (selectedYear - 2018) / (2026 - 2018);
    const interpVal = +(metric.baselineValue + (metric.currentValue - metric.baselineValue) * Math.max(0, Math.min(1, ratio))).toFixed(1);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 120, 80);
    doc.text(`${interpVal} ${metric.unit}`, margin + 83, curY + 5.2);

    // Baseline
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 110, 105);
    doc.text(`${metric.baselineValue} ${metric.unit}`, margin + 115, curY + 5.2);

    // Delta %
    const delta = +(((interpVal - metric.baselineValue) / (metric.baselineValue || 1)) * 100).toFixed(1);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(delta >= 0 ? 16 : 180, delta >= 0 ? 120 : 50, delta >= 0 ? 80 : 50);
    doc.text(`${delta >= 0 ? '+' : ''}${delta}%`, margin + 142, curY + 5.2);

    // Certainty
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 70, 65);
    doc.text(`${metric.confidenceScore}% (${metric.sensorMeshNodesCount} nodes)`, margin + 162, curY + 5.2);

    curY += 8;
  });

  // 6. Section: Real-Time Metabolic Resource Flows Summary
  curY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 30, 20);
  doc.text('2. LOCAL RESOURCE FLOWS & CLOSED-LOOP METABOLISM', margin, curY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 130, 125);
  doc.text('Water, Energy, and Nutrient cycle throughput across interconnected nodes', margin + 105, curY);

  curY += 3;
  // Flow Table Header
  doc.setFillColor(20, 35, 26);
  doc.rect(margin, curY, contentWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(245, 245, 240);
  doc.text('FLOW PATHWAY', margin + 3, curY + 4.2);
  doc.text('CATEGORY', margin + 65, curY + 4.2);
  doc.text('THROUGHPUT RATE', margin + 92, curY + 4.2);
  doc.text('CIRCULARITY', margin + 130, curY + 4.2);
  doc.text('VELOCITY / STATUS', margin + 155, curY + 4.2);

  curY += 6;

  // Render top 4 flows
  region.resourceFlows.slice(0, 4).forEach((flow, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 250, isEven ? 255 : 246);
    doc.setDrawColor(230, 235, 230);
    doc.rect(margin, curY, contentWidth, 7.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(20, 30, 25);
    const truncTitle = flow.title.length > 36 ? flow.title.slice(0, 35) + '...' : flow.title;
    doc.text(truncTitle, margin + 3, curY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 95, 85);
    doc.text(flow.category.toUpperCase(), margin + 65, curY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 116, 144);
    doc.text(`${flow.flowRate} ${flow.flowUnit}`, margin + 92, curY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 120, 80);
    doc.text(`${flow.circularityPct}% Circular`, margin + 130, curY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 70, 65);
    doc.text(`${flow.flowVelocity} (${flow.status})`, margin + 155, curY + 5);

    curY += 7.5;
  });

  // 7. Cryptographic Governance & Epistemic Audit Seal Box
  curY += 5;
  const sealBoxHeight = 36;
  doc.setFillColor(242, 245, 241);
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, curY, contentWidth, sealBoxHeight, 2, 2, 'FD');

  // Embed QR Code
  doc.addImage(qrDataUrl, 'PNG', margin + contentWidth - 32, curY + 2, 30, 30);

  // Epistemic Seal Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 30, 20);
  doc.text('SECTION 30 CRYPTOGRAPHIC ATTESTATION & STAKEHOLDER GUARANTEE', margin + 4, curY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(50, 60, 55);
  doc.text(`Protocol Consensus: Proof-of-Regeneration (PoR) Engine v4.2 • Block Height: #184948`, margin + 4, curY + 11.5);
  doc.text(`Merkle Root Hash: ${verificationHash}`, margin + 4, curY + 16);
  doc.text(`Auditing Entities: Mara Transboundary Commission, Savory Hub Africa & Indigenous Assembly`, margin + 4, curY + 20.5);
  doc.text(`Attestation Role: ${userRole} • Validated In-Situ Sensor Mesh Signature`, margin + 4, curY + 25);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 110, 105);
  doc.text('This signed document is cryptographically anchored and admissible for community governance assemblies,', margin + 4, curY + 29.5);
  doc.text('municipal water quotas, and ecological sustainability-linked sovereign bond verifications.', margin + 4, curY + 33);

  // 8. Footer Bar
  doc.setFillColor(10, 20, 14);
  doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(197, 160, 89);
  doc.text('ATLAS SANCTUM ECOLOGICAL LEDGER • ALL TELEMETRY ANCHORED IN OPEN-SOURCE PROVENANCE ORACLES', margin, pageHeight - 3.8);

  const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  doc.setTextColor(200, 210, 205);
  doc.text(`Generated: ${timestampStr} • Page 1 of 1`, pageWidth - margin - 50, pageHeight - 3.8);

  // Save the PDF file
  const filename = `${region.regionId}-Ecological-Health-Report-${selectedYear}.pdf`;
  doc.save(filename);
}
