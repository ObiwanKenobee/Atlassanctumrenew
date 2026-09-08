import { jsPDF } from 'jspdf';
import { PaymentRecord, ATLAS_TIERS } from './subscriptionManager';

/**
 * Generates an institutional-grade, beautifully styled PDF invoice for Atlas Sanctum subscriptions.
 * Supports automated client-side download or returns the jsPDF document object.
 */
export function generateSubscriptionPdfInvoice(
  record: PaymentRecord,
  autoDownload: boolean = false
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;

  // Header background banner (Dark Charcoal / Forest Slate)
  doc.setFillColor(16, 20, 18);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent bar
  doc.setFillColor(197, 160, 89);
  doc.rect(0, 42, pageWidth, 2, 'F');

  // Brand Header
  doc.setTextColor(245, 245, 240);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ATLAS SANCTUM', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(197, 160, 89);
  doc.text('CIVILIZATIONAL OPERATING SYSTEM // REGENERATIVE PROTOCOL', margin, 24);

  doc.setFontSize(7.5);
  doc.setTextColor(180, 185, 180);
  doc.text('Cryptographic Proof of Attribution & Official Subscription Tax Invoice', margin, 31);

  // Invoice Number & Date on top right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(245, 245, 240);
  doc.text('SUBSCRIPTION INVOICE', pageWidth - margin, 17, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(197, 160, 89);
  doc.text(record.invoiceNumber, pageWidth - margin, 24, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 185, 180);
  doc.setFontSize(8);
  const issuedDate = new Date(record.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  doc.text(`Issued: ${issuedDate}`, pageWidth - margin, 31, { align: 'right' });

  // Subscriber & Plan Details Grid
  let y = 52;
  const boxWidth = (pageWidth - margin * 2) / 2 - 3;

  // Box 1: Subscriber Info
  doc.setFillColor(248, 249, 248);
  doc.setDrawColor(215, 220, 215);
  doc.roundedRect(margin, y, boxWidth, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 130, 125);
  doc.text('SUBSCRIBER DETAILS', margin + 5, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 25, 22);
  doc.text(record.organizationName || 'Sovereign Steward Organization', margin + 5, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 70, 65);
  doc.text(`Contact: ${record.billingEmail || 'steward@atlassanctum.org'}`, margin + 5, y + 22);
  doc.text(`Record ID: ${record.id}`, margin + 5, y + 28);

  // Box 2: Plan & License Meta
  const rightBoxX = margin + boxWidth + 6;
  doc.roundedRect(rightBoxX, y, boxWidth, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 130, 125);
  doc.text('PLAN & BILLING SPECIFICATION', rightBoxX + 5, y + 7);

  const tierDef = ATLAS_TIERS[record.tier];
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 25, 22);
  doc.text(tierDef.name, rightBoxX + 5, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 70, 65);
  doc.text(`Billing Cycle: ${record.billingCycle.toUpperCase()} (Renewable)`, rightBoxX + 5, y + 22);

  const validUntil = new Date(record.expiresAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  doc.text(`Active Through: ${validUntil}`, rightBoxX + 5, y + 28);

  // License Key Banner
  y += 42;
  doc.setFillColor(244, 247, 245);
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 110, 45);
  doc.text('CRYPTOGRAPHIC PROTOCOL LICENSE KEY (VERIFIED PROVISIONING):', margin + 6, y + 5.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(18, 22, 20);
  doc.text(record.licenseKey, margin + 6, y + 11.5);

  // Line Items Table Header
  y += 22;
  doc.setFillColor(235, 238, 236);
  doc.rect(margin, y, pageWidth - margin * 2, 7.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(50, 60, 55);
  doc.text('CAPACITY DESCRIPTION', margin + 4, y + 5);
  doc.text('BILLING FREQUENCY', pageWidth - margin - 65, y + 5);
  doc.text('TOTAL (USD)', pageWidth - margin - 4, y + 5, { align: 'right' });

  // Main Item
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 25, 22);
  doc.text(`${tierDef.name} — Full Platform License`, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 100, 95);
  doc.text(tierDef.tagline, margin + 4, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(40, 45, 42);
  doc.text(record.billingCycle === 'annual' ? 'Annual (12 Months)' : 'Monthly (1 Month)', pageWidth - margin - 65, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${record.amountUsd.toLocaleString()}.00`, pageWidth - margin - 4, y + 7, { align: 'right' });

  // Divider
  y += 16;
  doc.setDrawColor(220, 225, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  // Non-Extractive Reinvestment line
  y += 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 115, 80);
  doc.text('100% Protocol Surplus: Allocated to sovereign sensor subsidies & open science schemas', margin + 4, y + 5);
  doc.text('$0.00 (Included)', pageWidth - margin - 4, y + 5, { align: 'right' });

  y += 8;
  doc.line(margin, y, pageWidth - margin, y);

  // Totals Section
  y += 6;
  const totalX = pageWidth - margin - 65;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 95, 92);
  doc.text('Subtotal:', totalX, y);
  doc.text(`$${record.amountUsd.toLocaleString()}.00`, pageWidth - margin - 4, y, { align: 'right' });

  y += 5.5;
  doc.text('Taxes & Surcharges (0% ReFi):', totalX, y);
  doc.text('$0.00', pageWidth - margin - 4, y, { align: 'right' });

  y += 6;
  doc.setFillColor(242, 246, 243);
  doc.rect(totalX - 3, y - 3.5, pageWidth - totalX - margin + 6, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 25, 22);
  doc.text('Total Settled:', totalX, y + 2.5);
  doc.setTextColor(25, 110, 55);
  doc.text(`$${record.amountUsd.toLocaleString()}.00 USD`, pageWidth - margin - 4, y + 2.5, { align: 'right' });

  // Payment Settlement Details Box
  y += 15;
  doc.setFillColor(248, 249, 248);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 130, 125);
  doc.text('PAYMENT SETTLEMENT & CRYPTOGRAPHIC TELEMETRY', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(40, 50, 45);
  doc.text(`Settlement Rail: ${record.paymentMethodSummary}`, margin + 5, y + 13);
  doc.text(`Status: VERIFIED & CONFIRMED (Level ${tierDef.level} Access Provisioned)`, margin + 5, y + 18.5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(110, 120, 115);
  doc.text(`Tx Verification Proof: ${record.txHash || 'N/A'}`, margin + 5, y + 23);

  // Offerings Granted
  y += 31;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 130, 125);
  doc.text('KEY CAPABILITIES & ENTITLEMENTS GRANTED:', margin, y);

  y += 4;
  tierDef.offerings.slice(0, 6).forEach((offering) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 35, 32);
    doc.text(`• [${offering.category}] ${offering.name}:`, margin + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 90, 85);
    const desc = offering.description.length > 78 ? offering.description.substring(0, 75) + '...' : offering.description;
    doc.text(desc, margin + 50, y);
    y += 4.5;
  });

  // Footer
  const footerY = pageHeight - 16;
  doc.setDrawColor(220, 225, 220);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(130, 135, 132);
  doc.text('Atlas Sanctum Civilizational Operating System • Non-Extractive Commons Protocol • www.atlassanctum.org', margin, footerY + 5);
  doc.text('Cryptographically bound via Merkle Root Evidence Ledger • Automated Institutional Invoice', margin, footerY + 9);
  doc.text(`Generated ${new Date().toISOString()}`, pageWidth - margin, footerY + 7, { align: 'right' });

  if (autoDownload) {
    try {
      doc.save(`${record.invoiceNumber}.pdf`);
    } catch (err) {
      console.warn('[PDF Generator] Auto-download error:', err);
    }
  }

  return doc;
}
