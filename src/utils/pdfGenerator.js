// ============================================================
// pdfGenerator.js — Generate a nice PDF from the fitness plan
// ============================================================

import { jsPDF } from 'jspdf';

// ---------- Brand colors ----------
const COLORS = {
  primary: [249, 115, 22],       // orange
  primarySoft: [255, 245, 237],  // light orange bg
  textPrimary: [28, 25, 23],
  textSecondary: [87, 83, 78],
  textMuted: [168, 162, 158],
  border: [231, 232, 229],
  bgSurface: [250, 250, 249],
};

// A4 page dimensions in pt
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 40;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ============================================================
// Main export
// ============================================================
export function downloadPlanPDF(plan, userData) {
  if (!plan) return false;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  let y = MARGIN;

  // ---------- Header band ----------
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE_W, 80, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Athlos', MARGIN, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Your Personalized Fitness Plan', MARGIN, 58);

  y = 110;

  // ---------- Greeting ----------
  doc.setTextColor(...COLORS.textPrimary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`Hey ${userData?.name || 'there'},`, MARGIN, y);
  y += 22;

  // ---------- Summary ----------
  if (plan.summary) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.textSecondary);
    const summaryLines = doc.splitTextToSize(plan.summary, CONTENT_W);
    doc.text(summaryLines, MARGIN, y);
    y += summaryLines.length * 14 + 18;
  }

  // ============================================================
  // DIET SECTION
  // ============================================================
  y = ensureSpace(doc, y, 60);
  y = drawSectionHeader(doc, 'Diet Plan', y);
  y += 6;

  const diet = plan.diet;
  if (diet) {
    // Calories + macros row
    if (diet.dailyCalories) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...COLORS.primary);
      doc.text(`${diet.dailyCalories.toLocaleString()} kcal / day`, MARGIN, y);
      y += 18;
    }

    if (diet.macros) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.textSecondary);
      const macroLine = `Protein ${diet.macros.protein}g · Carbs ${diet.macros.carbs}g · Fats ${diet.macros.fats}g`;
      doc.text(macroLine, MARGIN, y);
      y += 20;
    }

    // Meals
    if (diet.meals && diet.meals.length > 0) {
      diet.meals.forEach((meal) => {
        y = ensureSpace(doc, y, 40);

        // Meal heading
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...COLORS.textPrimary);
        doc.text(meal.time || '', MARGIN, y);

        if (meal.calories) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(...COLORS.textMuted);
          const calText = `${meal.calories} kcal`;
          const calWidth = doc.getTextWidth(calText);
          doc.text(calText, PAGE_W - MARGIN - calWidth, y);
        }
        y += 14;

        // Items
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.textSecondary);
        (meal.items || []).forEach((item) => {
          y = ensureSpace(doc, y, 20);
          const lines = doc.splitTextToSize(`• ${item}`, CONTENT_W - 10);
          doc.text(lines, MARGIN + 10, y);
          y += lines.length * 13;
        });
        y += 8;
      });
    }
  }

  y += 8;

  // ============================================================
  // WORKOUT SECTION
  // ============================================================
  y = ensureSpace(doc, y, 60);
  y = drawSectionHeader(doc, 'Workout Plan', y);
  y += 6;

  const workout = plan.workout;
  if (workout) {
    if (workout.split) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.textSecondary);
      const splitLines = doc.splitTextToSize(workout.split, CONTENT_W);
      doc.text(splitLines, MARGIN, y);
      y += splitLines.length * 13 + 12;
    }

    (workout.days || []).forEach((day) => {
      y = ensureSpace(doc, y, 50);

      // Day header — day name (small caps style) + focus
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.textMuted);
      doc.text((day.day || '').toUpperCase(), MARGIN, y);
      y += 13;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.textPrimary);
      doc.text(day.focus || '', MARGIN, y);
      y += 16;

      // Exercises
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.textSecondary);

      (day.exercises || []).forEach((ex) => {
        y = ensureSpace(doc, y, 20);

        const exName = `• ${ex.name}`;
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(exName, MARGIN + 6, y);

        const metaText = `${ex.sets} × ${ex.reps}`;
        const metaWidth = doc.getTextWidth(metaText);
        doc.setTextColor(...COLORS.textMuted);
        doc.text(metaText, PAGE_W - MARGIN - metaWidth, y);

        y += 14;
      });

      y += 10;
    });
  }

  y += 8;

  // ============================================================
  // TIPS SECTION
  // ============================================================
  if (plan.tips && plan.tips.length > 0) {
    y = ensureSpace(doc, y, 60);
    y = drawSectionHeader(doc, 'Notes & Tips', y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.textSecondary);

    plan.tips.forEach((tip) => {
      y = ensureSpace(doc, y, 30);
      const lines = doc.splitTextToSize(`• ${tip}`, CONTENT_W - 10);
      doc.text(lines, MARGIN + 6, y);
      y += lines.length * 13 + 4;
    });
  }

  // ============================================================
  // FOOTER on every page
  // ============================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, PAGE_H - 40, PAGE_W - MARGIN, PAGE_H - 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textMuted);
    doc.text('Generated by Athlos — athlos.app', MARGIN, PAGE_H - 24);

    const pageText = `Page ${i} of ${totalPages}`;
    const pageWidth = doc.getTextWidth(pageText);
    doc.text(pageText, PAGE_W - MARGIN - pageWidth, PAGE_H - 24);
  }

  // ---------- Save ----------
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeName = (userData?.name || 'plan').replace(/[^\w]/g, '-');
  doc.save(`athlos-${safeName}-${dateStr}.pdf`);

  return true;
}

// ============================================================
// Helpers
// ============================================================

// Add a new page if we're near the bottom
function ensureSpace(doc, y, needed) {
  if (y + needed > PAGE_H - 60) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

// Draw a section header with a colored left bar
function drawSectionHeader(doc, title, y) {
  const barW = 3;
  const barH = 16;

  doc.setFillColor(...COLORS.primary);
  doc.rect(MARGIN, y - 12, barW, barH, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.textPrimary);
  doc.text(title, MARGIN + 12, y);

  return y + 24;
}