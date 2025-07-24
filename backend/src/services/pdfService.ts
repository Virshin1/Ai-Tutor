import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export class PDFService {
  static async generatePDF(content: any, type: string, title: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let yPosition = height - 50;
    const margin = 50;
    const lineHeight = 20;
    
    // Title
    page.drawText(title, {
      x: margin,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0)
    });
    
    yPosition -= 40;
    
    // Date
    const date = new Date().toLocaleDateString();
    page.drawText(`Generated on: ${date}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
    
    yPosition -= 30;
    
    // Content based on type
    switch (type) {
      case 'lessonPlan':
        await this.addLessonPlanContent(page, content, font, boldFont, margin, yPosition, lineHeight);
        break;
      case 'rubric':
        await this.addRubricContent(page, content, font, boldFont, margin, yPosition, lineHeight);
        break;
      case 'iep':
        await this.addIEPContent(page, content, font, boldFont, margin, yPosition, lineHeight);
        break;
      case 'exitTicket':
        await this.addExitTicketContent(page, content, font, boldFont, margin, yPosition, lineHeight);
        break;
      case 'reportComment':
        await this.addReportCommentContent(page, content, font, boldFont, margin, yPosition, lineHeight);
        break;
      case 'assignment':
        await this.addAssignmentContent(page, content, font, boldFont, margin, yPosition, lineHeight);
        break;
      case 'direction':
        await this.addDirectionContent(page, content, font, boldFont, margin, yPosition, lineHeight);
        break;
      default:
        await this.addGenericContent(page, content, font, boldFont, margin, yPosition, lineHeight);
    }
    
    return await pdfDoc.save();
  }
  
  private static async addLessonPlanContent(page: any, content: any, font: any, boldFont: any, margin: number, yPosition: number, lineHeight: number) {
    let y = yPosition;
    
    if (content.objectives) {
      page.drawText('Learning Objectives:', {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
      
      const objectives = Array.isArray(content.objectives) ? content.objectives : [content.objectives];
      objectives.forEach((obj: string) => {
        page.drawText(`• ${obj}`, {
          x: margin + 20,
          y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        });
        y -= lineHeight;
      });
      y -= 10;
    }
    
    if (content.activities) {
      page.drawText('Activities:', {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
      
      const activities = Array.isArray(content.activities) ? content.activities : [content.activities];
      activities.forEach((activity: string) => {
        page.drawText(`• ${activity}`, {
          x: margin + 20,
          y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        });
        y -= lineHeight;
      });
    }
  }
  
  private static async addRubricContent(page: any, content: any, font: any, boldFont: any, margin: number, yPosition: number, lineHeight: number) {
    let y = yPosition;
    
    if (content.criteria) {
      page.drawText('Assessment Criteria:', {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
      
      const criteria = Array.isArray(content.criteria) ? content.criteria : [content.criteria];
      criteria.forEach((criterion: string) => {
        page.drawText(`• ${criterion}`, {
          x: margin + 20,
          y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        });
        y -= lineHeight;
      });
    }
  }
  
  private static async addIEPContent(page: any, content: any, font: any, boldFont: any, margin: number, yPosition: number, lineHeight: number) {
    let y = yPosition;
    
    if (content.goals) {
      page.drawText('IEP Goals:', {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
      
      const goals = Array.isArray(content.goals) ? content.goals : [content.goals];
      goals.forEach((goal: string) => {
        page.drawText(`• ${goal}`, {
          x: margin + 20,
          y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        });
        y -= lineHeight;
      });
    }
  }
  
  private static async addExitTicketContent(page: any, content: any, font: any, boldFont: any, margin: number, yPosition: number, lineHeight: number) {
    let y = yPosition;
    
    if (content.questions) {
      page.drawText('Exit Ticket Questions:', {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
      
      const questions = Array.isArray(content.questions) ? content.questions : [content.questions];
      questions.forEach((question: string, index: number) => {
        page.drawText(`${index + 1}. ${question}`, {
          x: margin + 20,
          y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        });
        y -= lineHeight;
      });
    }
  }
  
  private static async addReportCommentContent(page: any, content: any, font: any, boldFont: any, margin: number, yPosition: number, lineHeight: number) {
    let y = yPosition;
    
    if (content.comment) {
      page.drawText('Report Comment:', {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
      
      // Split long text into lines
      const words = content.comment.split(' ');
      let line = '';
      for (const word of words) {
        const testLine = line + word + ' ';
        if (testLine.length > 80) {
          page.drawText(line, {
            x: margin,
            y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
          });
          y -= lineHeight;
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      if (line) {
        page.drawText(line, {
          x: margin,
          y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        });
      }
    }
  }
  
  private static async addAssignmentContent(page: any, content: any, font: any, boldFont: any, margin: number, yPosition: number, lineHeight: number) {
    let y = yPosition;
    
    if (content.description) {
      page.drawText('Assignment Description:', {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
      
      const words = content.description.split(' ');
      let line = '';
      for (const word of words) {
        const testLine = line + word + ' ';
        if (testLine.length > 80) {
          page.drawText(line, {
            x: margin,
            y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
          });
          y -= lineHeight;
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      if (line) {
        page.drawText(line, {
          x: margin,
          y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        });
      }
    }
  }
  
  private static async addDirectionContent(page: any, content: any, font: any, boldFont: any, margin: number, yPosition: number, lineHeight: number) {
    let y = yPosition;
    
    if (content.directions) {
      page.drawText('Clear Directions:', {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
      
      const directions = Array.isArray(content.directions) ? content.directions : [content.directions];
      directions.forEach((direction: string) => {
        page.drawText(`• ${direction}`, {
          x: margin + 20,
          y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        });
        y -= lineHeight;
      });
    }
  }
  
  private static async addGenericContent(page: any, content: any, font: any, boldFont: any, margin: number, yPosition: number, lineHeight: number) {
    let y = yPosition;
    
    page.drawText('Content:', {
      x: margin,
      y,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0)
    });
    y -= lineHeight;
    
    const contentStr = JSON.stringify(content, null, 2);
    const lines = contentStr.split('\n');
    lines.forEach((line: string) => {
      if (line.length > 80) {
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine + word + ' ';
          if (testLine.length > 80) {
            page.drawText(currentLine, {
              x: margin,
              y,
              size: 12,
              font: font,
              color: rgb(0, 0, 0)
            });
            y -= lineHeight;
            currentLine = word + ' ';
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
          });
          y -= lineHeight;
        }
      } else {
        page.drawText(line, {
          x: margin,
          y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        });
        y -= lineHeight;
      }
    });
  }
} 