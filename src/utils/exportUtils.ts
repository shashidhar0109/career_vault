import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { MasterResumeData, ActiveResumeSelection, JobApplication } from '../types';

/**
 * Generates a Word-compatible .doc file using standard MSO HTML namespace format.
 * Microsoft Word and Google Docs open this cleanly as a fully editable document.
 */
export function exportResumeToWord(
  masterData: MasterResumeData,
  selection: ActiveResumeSelection,
  filename: string
) {
  const selectedSummary = masterData.summaries.find((s) => s.id === selection.selectedSummaryId);
  const selectedExps = masterData.experiences.filter((e) =>
    selection.selectedExperienceIds.includes(e.id)
  );
  const selectedProjs = masterData.projects.filter((p) =>
    selection.selectedProjectIds.includes(p.id)
  );
  const selectedSkills = masterData.skillCategories.filter((s) =>
    selection.selectedSkillCategoryIds.includes(s.id)
  );
  const selectedEdus = masterData.educations.filter((ed) =>
    selection.selectedEducationIds.includes(ed.id)
  );
  const selectedCerts = masterData.certifications.filter((c) =>
    selection.selectedCertificationIds.includes(c.id)
  );

  const { personalInfo } = masterData;

  // Build contact items respecting hide flags and custom links
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (!selection.hideLinkedin && personalInfo.linkedin && personalInfo.linkedin.trim() !== '') {
    contactParts.push(personalInfo.linkedin);
  }
  if (!selection.hideGithub && personalInfo.github && personalInfo.github.trim() !== '') {
    contactParts.push(personalInfo.github);
  }
  if (!selection.hidePortfolio && personalInfo.portfolio && personalInfo.portfolio.trim() !== '') {
    contactParts.push(personalInfo.portfolio);
  }
  if (personalInfo.customLinks) {
    personalInfo.customLinks.forEach((l) => {
      if (l.url && l.url.trim() !== '') {
        contactParts.push(l.label ? `${l.label}: ${l.url}` : l.url);
      }
    });
  }

  const themeColors: Record<string, { primary: string; secondary: string }> = {
    blue: { primary: '#1e3a8a', secondary: '#2563eb' },
    indigo: { primary: '#1e1b4b', secondary: '#4338ca' },
    emerald: { primary: '#064e3b', secondary: '#059669' },
    violet: { primary: '#3b0764', secondary: '#7c3aed' },
    rose: { primary: '#4c0519', secondary: '#e11d48' },
    amber: { primary: '#451a03', secondary: '#d97706' },
  };

  const currentTheme = themeColors[selection.themeColor || 'blue'] || themeColors.blue;

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${personalInfo.fullName} - Resume</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 8.5in 11.0in;
          margin: 0.75in 0.75in 0.75in 0.75in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
        }
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 10.5pt;
          line-height: 1.35;
          color: #1a202c;
          margin: 0;
          padding: 0;
        }
        h1 {
          font-size: 24pt;
          font-weight: bold;
          color: ${currentTheme.primary};
          margin: 0 0 3pt 0;
          text-align: center;
          letter-spacing: 0.5pt;
        }
        .subtitle {
          font-size: 12pt;
          font-weight: 600;
          color: ${currentTheme.secondary};
          text-align: center;
          margin-bottom: 5pt;
        }
        .contact-line {
          font-size: 9.5pt;
          color: #4a5568;
          text-align: center;
          margin-bottom: 12pt;
          border-bottom: 1.5pt solid #cbd5e1;
          padding-bottom: 6pt;
        }
        .section-header {
          font-size: 11pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
          color: ${currentTheme.primary};
          border-bottom: 1.5pt solid ${currentTheme.secondary};
          padding-bottom: 2pt;
          margin-top: 10pt;
          margin-bottom: 5pt;
        }
        table.item-row {
          width: 100%;
          border-collapse: collapse;
          margin-top: 5pt;
          margin-bottom: 2pt;
        }
        table.item-row td {
          padding: 0;
          vertical-align: top;
        }
        .role-company {
          font-weight: bold;
          font-size: 10.5pt;
          color: #0f172a;
        }
        .dates-loc {
          text-align: right;
          font-size: 9.5pt;
          color: #475569;
          white-space: nowrap;
        }
        .item-sub {
          font-style: italic;
          color: #475569;
          font-size: 9.5pt;
          margin-bottom: 3pt;
        }
        ul {
          margin: 3pt 0 7pt 16pt;
          padding: 0;
        }
        li {
          margin-bottom: 2.5pt;
          font-size: 9.5pt;
          color: #334155;
          line-height: 1.35;
        }
        .skill-group {
          margin-bottom: 3.5pt;
          font-size: 9.5pt;
          line-height: 1.35;
        }
        .skill-group strong {
          color: #0f172a;
        }
        .page-break {
          page-break-before: always;
          mso-break-type: section-break;
          clear: both;
        }
      </style>
    </head>
    <body>
      <!-- Page 1 Content -->
      <h1>${personalInfo.fullName}</h1>
      <div class="subtitle">${personalInfo.targetTitle}</div>
      <div class="contact-line">
        ${contactParts.join(' &bull; ')}
      </div>

      ${
        selectedSummary
          ? `
        <div class="section-header">Professional Summary</div>
        <p style="margin: 4pt 0 8pt 0; font-size: 9.5pt; color: #334155; text-align: justify; line-height: 1.35;">
          ${selectedSummary.content}
        </p>
      `
          : ''
      }

      ${
        selectedSkills.length > 0
          ? `
        <div class="section-header">Technical Skills</div>
        <div style="margin-bottom: 6pt;">
          ${selectedSkills
            .map(
              (cat) => `
            <div class="skill-group">
              <strong>${cat.category}:</strong> ${cat.skills.join(', ')}
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }

      ${
        selectedExps.length > 0
          ? `
        <div class="section-header">Work Experience</div>
        ${selectedExps
          .map(
            (exp) => `
          <table class="item-row" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td class="role-company"><strong>${exp.role}</strong> &mdash; ${exp.company}</td>
              <td class="dates-loc">${exp.startDate} – ${exp.endDate} | ${exp.location}</td>
            </tr>
          </table>
          <ul>
            ${exp.bullets.map((b) => `<li>${b}</li>`).join('')}
          </ul>
        `
          )
          .join('')}
      `
          : ''
      }

      ${
        selectedProjs.length > 0
          ? `
        <div class="section-header">Selected Key Projects</div>
        ${selectedProjs
          .map(
            (proj) => `
          <table class="item-row" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td class="role-company"><strong>${proj.name}</strong> (${proj.role})</td>
              <td class="dates-loc" style="color: ${currentTheme.secondary};">${proj.link || ''}</td>
            </tr>
          </table>
          <div class="item-sub">Tech Stack: ${proj.techStack.join(', ')}</div>
          <ul>
            ${proj.bullets.map((b) => `<li>${b}</li>`).join('')}
          </ul>
        `
          )
          .join('')}
      `
          : ''
      }

      ${
        selectedEdus.length > 0
          ? `
        <div class="section-header">Education</div>
        ${selectedEdus
          .map(
            (edu) => `
          <table class="item-row" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td class="role-company"><strong>${edu.degree} in ${edu.field}</strong></td>
              <td class="dates-loc">Graduated: ${edu.graduationYear}</td>
            </tr>
          </table>
          <div class="item-sub">${edu.institution}${edu.gpa ? ` &bull; GPA: ${edu.gpa}` : ''}</div>
          ${edu.highlights ? `<p style="font-size: 9pt; margin: 2pt 0 5pt 0; color: #64748b;">${edu.highlights}</p>` : ''}
        `
          )
          .join('')}
      `
          : ''
      }

      ${
        selectedCerts.length > 0
          ? `
        <div class="section-header">Certifications & Accreditations</div>
        <ul>
          ${selectedCerts
            .map(
              (cert) => `
            <li><strong>${cert.name}</strong> &mdash; ${cert.issuer} (${cert.year})</li>
          `
            )
            .join('')}
        </ul>
      `
          : ''
      }
    </body>
    </html>
  `;

  const safeName = filename.endsWith('.docx')
    ? filename
    : filename.endsWith('.doc')
    ? filename
    : `${filename}.docx`;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and immediately downloads a genuine high-resolution .pdf document
 * using html2canvas and jsPDF with pixel-perfect A4 ratio preservation.
 */
export async function exportResumeToPDF(
  containerId: string,
  filename: string,
  onProgress?: (message: string) => void
): Promise<boolean> {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Element #${containerId} not found`);
    }

    onProgress?.('Rendering document to high-resolution canvas...');

    // Find paper page or use container directly
    const targetElement =
      (container.querySelector<HTMLElement>('.resume-paper-page') as HTMLElement) || container;

    // Render using html2canvas with transform reset in clone
    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // Reset any zoom transforms applied in the preview UI
        const clonedContainer = clonedDoc.getElementById(containerId);
        if (clonedContainer) {
          clonedContainer.style.transform = 'none';
        }
        const clonedPage = clonedDoc.querySelector<HTMLElement>('.resume-paper-page');
        if (clonedPage) {
          clonedPage.style.boxShadow = 'none';
          clonedPage.style.border = 'none';
          clonedPage.style.margin = '0 auto';
        }
      },
    });

    onProgress?.('Formatting PDF pages...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Exact A4 aspect ratio in pixels: height = width * (297 / 210)
    const a4Ratio = 297 / 210;
    const pageCanvasHeight = Math.floor(canvas.width * a4Ratio);
    const totalPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight));

    for (let page = 0; page < totalPages; page++) {
      onProgress?.(`Building Page ${page + 1} of ${totalPages}...`);
      if (page > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Create an exact A4 page canvas to preserve 100% optical aspect ratio
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;
      const ctx = pageCanvas.getContext('2d');

      if (ctx) {
        // Pristine white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        const sourceY = page * pageCanvasHeight;
        const sourceHeight = Math.min(pageCanvasHeight, canvas.height - sourceY);

        if (sourceHeight > 0) {
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight
          );
        }

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
    }

    onProgress?.('Saving PDF file...');
    const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(safeName);
    return true;
  } catch (err) {
    console.error('Error generating PDF with jsPDF:', err);
    // Fallback gracefully to browser print
    window.print();
    return false;
  }
}

/**
 * Triggers standard print dialogue focused on the resume preview container
 * which browsers effortlessly save as a pixel-perfect PDF.
 */
export function printResumeAsPdf() {
  window.print();
}

/**
 * Export Application Tracker to CSV format
 */
export function exportApplicationsToCSV(applications: JobApplication[]) {
  const headers = [
    'App Number',
    'Date Applied',
    'Company',
    'Job Title',
    'Status',
    'Resume Used',
    'HR Email',
    'Followed Up?',
    'Last Follow Up Date',
    'Salary Range',
    'Team Members Count',
    'Notes',
  ];

  const rows = applications.map((app) => [
    `"${app.appNumber}"`,
    `"${app.dateApplied}"`,
    `"${app.companyName.replace(/"/g, '""')}"`,
    `"${app.jobTitle.replace(/"/g, '""')}"`,
    `"${app.status}"`,
    `"${(app.resumeUsedName || '').replace(/"/g, '""')}"`,
    `"${app.companyHrEmail}"`,
    `"${app.followedUp ? 'Yes' : 'No'}"`,
    `"${app.lastFollowUpDate || ''}"`,
    `"${(app.salaryExpectation || '').replace(/"/g, '""')}"`,
    `"${app.teamMembers.length}"`,
    `"${(app.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Job_Applications_Tracker_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
