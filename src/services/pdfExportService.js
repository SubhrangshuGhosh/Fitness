import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class PDFExportService {
  static async exportWorkoutPlan(plan, userData, elementId = 'workout-plan-content') {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Plan content not found for PDF export');
    }

    // Create a temporary container for better PDF formatting
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '800px';
    tempContainer.style.padding = '20px';
    tempContainer.style.background = 'white';
    tempContainer.style.fontFamily = 'Inter, sans-serif';
    
    // Add content to temporary container
    tempContainer.innerHTML = this.generatePDFContent(plan, userData);
    document.body.appendChild(tempContainer);

    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 800,
        windowWidth: 800
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `workout-plan-${userData.name}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
    }
  }

  static generatePDFContent(plan, userData) {
    return `
      <div style="font-family: 'Inter', sans-serif; color: #1f2937; max-width: 760px; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
          <h1 style="color: #6366f1; font-size: 28px; margin-bottom: 10px; font-weight: 700;">💪 AI Fitness Coach</h1>
          <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 15px;">Personalized Workout Plan</h2>
          <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; font-size: 14px;">
            <span style="background: #f3f4f6; padding: 5px 10px; border-radius: 12px;">Name: ${userData.name}</span>
            <span style="background: #f3f4f6; padding: 5px 10px; border-radius: 12px;">Goal: ${userData.fitnessGoal}</span>
            <span style="background: #f3f4f6; padding: 5px 10px; border-radius: 12px;">Level: ${userData.fitnessLevel}</span>
            <span style="background: #f3f4f6; padding: 5px 10px; border-radius: 12px;">Generated: ${new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <!-- Plan Overview -->
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #6366f1;">
          <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 10px; font-weight: 600;">${plan.title}</h3>
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 15px;">${plan.description}</p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <span style="background: white; padding: 8px 12px; border-radius: 20px; font-size: 14px; border: 1px solid #e5e7eb;">
              Duration: ${plan.duration}
            </span>
          </div>
        </div>

        <!-- Weekly Schedule -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 15px; font-weight: 600;">📅 Weekly Schedule</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            ${plan.weeklySchedule.map(day => `
              <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 15px;">
                <h4 style="color: #1f2937; font-size: 16px; margin-bottom: 8px; font-weight: 600;">${day.day}</h4>
                <p style="color: #6366f1; font-size: 14px; margin-bottom: 10px; font-weight: 600;">${day.focus}</p>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                  ${day.exercises.map(exercise => `
                    <div style="background: #f8fafc; padding: 8px; border-radius: 8px; font-size: 14px; border-left: 3px solid #6366f1;">
                      ${exercise.name}
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Detailed Exercises -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 15px; font-weight: 600;">💪 Exercise Details</h3>
          ${plan.weeklySchedule.map(day => `
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 15px; margin-bottom: 15px;">
              <h4 style="color: #1f2937; font-size: 16px; margin-bottom: 12px; font-weight: 600;">${day.day} - ${day.focus}</h4>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${day.exercises.map(exercise => `
                  <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 4px solid #10b981;">
                    <div style="display: flex; justify-content: between; margin-bottom: 8px;">
                      <strong style="color: #1f2937; font-size: 14px;">${exercise.name}</strong>
                      <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                        ${exercise.sets} sets × ${exercise.reps}
                      </span>
                    </div>
                    <div style="display: flex; gap: 15px; font-size: 13px; color: #6b7280;">
                      <span>Rest: ${exercise.rest}</span>
                      ${exercise.tips ? `<span style="color: #f59e0b;">💡 ${exercise.tips}</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Tips -->
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #10b981;">
          <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 15px; font-weight: 600;">💡 Pro Tips</h3>
          <ul style="padding-left: 20px;">
            ${plan.tips.map(tip => `<li style="margin-bottom: 8px; color: #1f2937;">${tip}</li>`).join('')}
          </ul>
        </div>

        <!-- Motivation -->
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
          <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 10px; font-weight: 600;">💬 Motivation</h3>
          <p style="color: #1f2937; font-style: italic; line-height: 1.6;">${plan.motivation}</p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>Generated by AI Fitness Coach • ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;
  }

  static async exportDietPlan(plan, userData) {
    // Similar implementation for diet plans
    const pdf = new jsPDF();
    // Add diet plan content to PDF
    const fileName = `diet-plan-${userData.name}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }
}