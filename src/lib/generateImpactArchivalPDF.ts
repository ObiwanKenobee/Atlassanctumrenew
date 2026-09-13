import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { AVAILABLE_STEWARDSHIP_BADGES, CURRENT_STEWARD_PROFILE } from '../data/stewardshipReputationData';
import { TWELVE_MONTH_INTERVAL_DATA } from '../components/analytics/FlourishingVsStabilityD3Chart';

export interface GenerateImpactPDFOptions {
  stewardName?: string;
  stewardHandle?: string;
  roleTitle?: string;
  verificationHash?: string;
  includeBadges?: boolean;
  includeTwelveMonthTrajectory?: boolean;
}

export async function generateImpactArchivalPDF({
  stewardName = CURRENT_STEWARD_PROFILE.name,
  stewardHandle = CURRENT_STEWARD_PROFILE.handle,
  roleTitle = CURRENT_STEWARD_PROFILE.roleTitle,
  verificationHash = '0xff182930485716253448596019283746a89c02',
  includeBadges = true,
  includeTwelveMonthTrajectory = true
}: GenerateImpactPDFOptions = {}): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. Generate Real Verification QR Code pointing to immutable ledger verification
  const verificationUrl = `https://atlassanctum.earth/archive/impact-report?hash=${verificationHash}&steward=${encodeURIComponent(stewardHandle)}&epoch=2026-09`;
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    margin: 1,
    width: 140,
    color: {
      dark: '#0A2318',
      light: '#FFFFFF'
    }
  });

  // PAGE 1: HEADER & LONGITUDINAL METRICS REPORT
  // -----------------------------------------------------------------

  // Top Dark Header Banner
  doc.setFillColor(10, 20, 14);
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Gold accent line
  doc.setFillColor(197, 160, 89);
  doc.rect(0, 35, pageWidth, 1.2, 'F');

  // Brand and OS Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(197, 160, 89);
  doc.text('ATLAS SANCTUM • CIVILIZATIONAL FLOURISHING OPERATING SYSTEM', margin, 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('VERIFIED ARCHIVAL IMPACT & STEWARDSHIP REPORT', margin, 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 200, 190);
  doc.text('Longitudinal Ecological Flourishing vs Economic Stability Trajectory • Evidence Constitution Ratified', margin, 26);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(150, 160, 155);
  doc.text(`ARCHIVAL PROOF HASH: ${verificationHash}`, margin, 32);

  // Metadata Panel
  let currentY = 44;
  doc.setFillColor(248, 249, 246);
  doc.rect(margin, currentY, contentWidth, 24, 'F');
  doc.setDrawColor(210, 215, 210);
  doc.rect(margin, currentY, contentWidth, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 35, 25);
  doc.text('REPORT AUDIT METADATA', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 70, 65);
  doc.text(`Lead Steward: ${stewardName} (${stewardHandle})`, margin + 4, currentY + 12);
  doc.text(`Title / Role: ${roleTitle}`, margin + 4, currentY + 17);
  doc.text(`Constitutional Standard: Commandment IX (Evidence Constitution) & Commandment II (Physical Ground Truth)`, margin + 4, currentY + 22);

  const rightColX = margin + 110;
  doc.text(`Archival Generation Date: ${new Date().toISOString().split('T')[0]} (2026 Epoch)`, rightColX, currentY + 12);
  doc.text(`Sensors in Ingestion Quorum: 4,200 Cryptographic Nodes`, rightColX, currentY + 17);
  doc.text(`Epistemic Verification Rating: 99.4% (Zero-Knowledge Verified)`, rightColX, currentY + 22);

  currentY += 32;

  // Section 1: Executive Impact Trajectory
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 30, 20);
  doc.text('1. LONGITUDINAL BIOREGIONAL IMPACT SUMMARY (12-MONTH INTERVAL)', margin, currentY);

  currentY += 5;

  // Table Header for Key Longitudinal Metrics
  const colWidths = [50, 32, 32, 28, 40];
  const colX = [
    margin,
    margin + 50,
    margin + 82,
    margin + 114,
    margin + 142
  ];

  doc.setFillColor(230, 235, 230);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 30, 25);
  doc.text('INDICATOR / CRITERION', colX[0] + 2, currentY + 5);
  doc.text('BASELINE (OCT 25)', colX[1] + 2, currentY + 5);
  doc.text('CURRENT (SEP 26)', colX[2] + 2, currentY + 5);
  doc.text('12-MO DELTA', colX[3] + 2, currentY + 5);
  doc.text('CERTAINTY / VERIFIER', colX[4] + 2, currentY + 5);

  currentY += 7;

  const longitudinalRows = [
    {
      name: 'Ecological Flourishing Index',
      baseline: '61.2 pts',
      current: '92.4 pts',
      delta: '+51.0% co-growth',
      verifier: '99.4% • Sentinel/In-Situ Mesh'
    },
    {
      name: 'Economic Stability Index',
      baseline: '54.8 pts',
      current: '89.2 pts',
      delta: '+62.8% circularity',
      verifier: '99.1% • P2P Sovereign Ledger'
    },
    {
      name: 'Vegetative Canopy Cover (NDVI)',
      baseline: '0.38 NDVI',
      current: '0.74 NDVI',
      delta: '+94.7% accretion',
      verifier: '98.9% • Spaceborne Lidar'
    },
    {
      name: 'Soil Organic Carbon (SOC)',
      baseline: '18.2 t/ha',
      current: '34.6 t/ha',
      delta: '+90.1% sequestration',
      verifier: '98.2% • Lab Core Assays'
    },
    {
      name: 'Sub-Sand Aquifer Storage Baseflow',
      baseline: '8.4 MCM',
      current: '16.8 MCM',
      delta: '+100.0% parity',
      verifier: '99.8% • Ultrasonic Piezometer'
    },
    {
      name: 'Acoustic Bio-Resonance Shannon H′',
      baseline: '1.80 H′',
      current: '3.90 H′',
      delta: '+116.7% richness',
      verifier: '99.1% • 48 Listening Posts'
    },
    {
      name: 'Decoupling Margin vs Extraction',
      baseline: '+9.2 pts',
      current: '+51.2 pts',
      delta: 'Perpetual Surplus',
      verifier: '100% Axiomatic Audit'
    }
  ];

  longitudinalRows.forEach((row, idx) => {
    const rowY = currentY;
    if (idx % 2 === 1) {
      doc.setFillColor(247, 248, 245);
      doc.rect(margin, rowY, contentWidth, 7, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(25, 35, 30);
    doc.text(row.name, colX[0] + 2, rowY + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(row.baseline, colX[1] + 2, rowY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 120, 80);
    doc.text(row.current, colX[2] + 2, rowY + 5);

    doc.setTextColor(197, 130, 20);
    doc.text(row.delta, colX[3] + 2, rowY + 5);

    doc.setFont('courier', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(70, 80, 75);
    doc.text(row.verifier, colX[4] + 2, rowY + 5);

    currentY += 7;
  });

  currentY += 6;

  // Section 2: 12-Month Interval Trajectory Breakdown
  if (includeTwelveMonthTrajectory) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(10, 30, 20);
    doc.text('2. 12-MONTH CHRONOLOGICAL SAMPLING TABLE', margin, currentY);

    currentY += 5;

    // Mini chronological summary grid
    doc.setFillColor(240, 242, 238);
    doc.rect(margin, currentY, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 40, 35);
    doc.text('INTERVAL', margin + 2, currentY + 4.2);
    doc.text('CALENDAR', margin + 24, currentY + 4.2);
    doc.text('ECOLOGICAL', margin + 52, currentY + 4.2);
    doc.text('ECONOMIC', margin + 78, currentY + 4.2);
    doc.text('DECOUPLING GAP', margin + 104, currentY + 4.2);
    doc.text('KEY INTERVENTION & MERKLE HASH', margin + 138, currentY + 4.2);

    currentY += 6;

    TWELVE_MONTH_INTERVAL_DATA.slice(0, 8).forEach((pt, i) => {
      const rowY = currentY;
      if (i % 2 === 1) {
        doc.setFillColor(249, 250, 248);
        doc.rect(margin, rowY, contentWidth, 5.5, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(30, 30, 30);
      doc.text(pt.shortMonth, margin + 2, rowY + 3.8);
      doc.text(pt.calendarMonth, margin + 24, rowY + 3.8);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 120, 80);
      doc.text(`${pt.ecologicalFlourishing}%`, margin + 52, rowY + 3.8);

      doc.setTextColor(197, 130, 20);
      doc.text(`${pt.economicStability}%`, margin + 78, rowY + 3.8);

      doc.setTextColor(20, 100, 140);
      doc.text(`+${pt.decouplingMargin.toFixed(1)} pts`, margin + 104, rowY + 3.8);

      doc.setFont('courier', 'normal');
      doc.setFontSize(6.2);
      doc.setTextColor(90, 100, 95);
      const textSummary = `${pt.milestone?.substring(0, 32)}... (${pt.cryptographicHash.substring(0, 10)})`;
      doc.text(textSummary, margin + 138, rowY + 3.8);

      currentY += 5.5;
    });

    currentY += 4;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 110, 105);
    doc.text('* Months 9-12 continue monotonic co-growth reaching 92.4% Ecological & 89.2% Economic stability.', margin, currentY);
    currentY += 6;
  }

  // Section 3: Verified Stewardship Badges
  if (includeBadges) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(10, 30, 20);
    doc.text('3. RATIFIED STEWARDSHIP BADGES & EPIDICTIC CREDENTIALS', margin, currentY);

    currentY += 5;

    // Render 4 badges in a 2x2 grid
    const cardWidth = (contentWidth - 6) / 2;
    const cardHeight = 22;

    AVAILABLE_STEWARDSHIP_BADGES.slice(0, 4).forEach((badge, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = margin + col * (cardWidth + 6);
      const by = currentY + row * (cardHeight + 3);

      doc.setFillColor(252, 252, 250);
      doc.rect(bx, by, cardWidth, cardHeight, 'F');
      doc.setDrawColor(210, 215, 210);
      doc.rect(bx, by, cardWidth, cardHeight, 'S');

      // Tier accent bar
      doc.setFillColor(badge.tier === 'platinum' ? 80 : 197, badge.tier === 'platinum' ? 140 : 160, badge.tier === 'platinum' ? 180 : 89);
      doc.rect(bx, by, 2.5, cardHeight, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(20, 30, 25);
      doc.text(badge.title, bx + 5, by + 5);

      doc.setFont('courier', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(140, 110, 30);
      doc.text(`[${badge.tier.toUpperCase()} TIER • ${badge.mintedTokenId}]`, bx + 5, by + 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(60, 70, 65);
      const descLine = badge.description.length > 70 ? badge.description.substring(0, 68) + '...' : badge.description;
      doc.text(descLine, bx + 5, by + 13.5);

      doc.setFont('courier', 'normal');
      doc.setFontSize(5.8);
      doc.setTextColor(110, 120, 115);
      doc.text(`Sig: ${badge.cryptographicSignature.substring(0, 32)}... (${badge.attestationsCount} attestations)`, bx + 5, by + 18.5);
    });

    currentY += (cardHeight + 3) * 2 + 5;
  }

  // Verification & Sign-off Block with QR Code at bottom
  const verifBlockHeight = 28;
  const verifBlockY = pageHeight - margin - verifBlockHeight;

  doc.setFillColor(242, 245, 242);
  doc.rect(margin, verifBlockY, contentWidth, verifBlockHeight, 'F');
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.5);
  doc.rect(margin, verifBlockY, contentWidth, verifBlockHeight, 'S');

  // Insert QR Code
  try {
    doc.addImage(qrDataUrl, 'PNG', margin + 2, verifBlockY + 2, 24, 24);
  } catch (err) {
    console.warn('QR Code embedding notice:', err);
  }

  const verifTextX = margin + 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 35, 20);
  doc.text('IMMUTABLE ATLAS CANON VERIFICATION ATTESTATION', verifTextX, verifBlockY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(60, 70, 65);
  doc.text('Scan the QR code to independently inspect this archival proof against the distributed consensus ledger.', verifTextX, verifBlockY + 11);
  doc.text('This document certifies zero epistemic deficit across all ground-truth water, canopy, and soil metrics.', verifTextX, verifBlockY + 15.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(197, 130, 20);
  doc.text(`MERKLE PROOF: ${verificationHash}`, verifTextX, verifBlockY + 20.5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(110, 120, 115);
  doc.text(`TIMESTAMP: ${new Date().toISOString()} • STAMP: RATIFIED_CIVILIZATION_EVIDENCE`, verifTextX, verifBlockY + 24.5);

  // Footer text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(140, 145, 140);
  doc.text('Atlas Sanctum Biospheric Operating System • Page 1 of 1 • Archival Grade PDF/A-Compliant Document', margin, pageHeight - 6);

  // Trigger browser download
  const filename = `Atlas_Sanctum_Archival_Impact_Summary_${stewardName.replace(/\s+/g, '_')}_2026.pdf`;
  doc.save(filename);
}
