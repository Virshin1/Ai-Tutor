import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleClassroomService {
  private oauth2Client: OAuth2Client;
  private classroom: any;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    
    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing Google OAuth environment variables:', {
        GOOGLE_CLIENT_ID: !!clientId,
        GOOGLE_CLIENT_SECRET: !!clientSecret,
        GOOGLE_REDIRECT_URI: !!redirectUri
      });
      throw new Error('Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI environment variables.');
    }
    
    this.oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
  }

  // Initialize the service with access token
  async initialize(accessToken: string) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    this.classroom = google.classroom({ version: 'v1', auth: this.oauth2Client });
  }

  // Get user's Google Classroom courses
  async getCourses() {
    try {
      const response = await this.classroom.courses.list({
        courseStates: ['ACTIVE', 'ARCHIVED']
      });
      return response.data.courses || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch Google Classroom courses');
    }
  }

  // Get students in a specific course
  async getCourseStudents(courseId: string) {
    try {
      const response = await this.classroom.courses.students.list({
        courseId: courseId
      });
      return response.data.students || [];
    } catch (error) {
      console.error('Error fetching course students:', error);
      throw new Error('Failed to fetch course students');
    }
  }

  // Create an assignment in Google Classroom
  async createAssignment(courseId: string, assignmentData: {
    title: string;
    description: string;
    materials?: any[];
    dueDate?: string;
    dueTime?: string;
  }) {
    try {
      const courseWork: any = {
        title: assignmentData.title,
        description: assignmentData.description,
        materials: assignmentData.materials || [],
        maxPoints: 100,
        workType: 'ASSIGNMENT',
        state: 'PUBLISHED'
      };

      if (assignmentData.dueDate) {
        courseWork.dueDate = {
          year: new Date(assignmentData.dueDate).getFullYear(),
          month: new Date(assignmentData.dueDate).getMonth() + 1,
          day: new Date(assignmentData.dueDate).getDate()
        };
      }

      if (assignmentData.dueTime) {
        courseWork.dueTime = {
          hours: new Date(assignmentData.dueTime).getHours(),
          minutes: new Date(assignmentData.dueTime).getMinutes()
        };
      }

      const response = await this.classroom.courses.courseWork.create({
        courseId: courseId,
        requestBody: courseWork
      });

      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw new Error('Failed to create Google Classroom assignment');
    }
  }

  // Create a material (document) in Google Classroom
  async createMaterial(courseId: string, materialData: {
    title: string;
    description: string;
    materials: any[];
  }) {
    try {
      const courseWork = {
        title: materialData.title,
        description: materialData.description,
        materials: materialData.materials,
        workType: 'MATERIAL',
        state: 'PUBLISHED'
      };

      const response = await this.classroom.courses.courseWork.create({
        courseId: courseId,
        requestBody: courseWork
      });

      return response.data;
    } catch (error) {
      console.error('Error creating material:', error);
      throw new Error('Failed to create Google Classroom material');
    }
  }

  // Get assignment submissions
  async getSubmissions(courseId: string, courseWorkId: string) {
    try {
      const response = await this.classroom.courses.courseWork.studentSubmissions.list({
        courseId: courseId,
        courseWorkId: courseWorkId
      });
      return response.data.studentSubmissions || [];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new Error('Failed to fetch submissions');
    }
  }

  async syncContentBatch(courseId: string, items: Array<{ content: any; contentType: 'assignment' | 'material' | 'announcement' }>) {
    const results = [];

    for (const [index, item] of items.entries()) {
      try {
        const result = await this.syncContentToClassroom(courseId, item.content, item.contentType);
        results.push({ index, success: true, result });
      } catch (error) {
        results.push({
          index,
          success: false,
          error: error instanceof Error ? error.message : 'Failed to sync item'
        });
      }
    }

    return results;
  }

  async getCourseWork(courseId: string) {
    try {
      const response = await this.classroom.courses.courseWork.list({
        courseId,
        courseWorkStates: ['PUBLISHED', 'DRAFT']
      });
      return response.data.courseWork || [];
    } catch (error) {
      console.error('Error fetching course work:', error);
      throw new Error('Failed to fetch Google Classroom course work');
    }
  }

  async getCourseAnalytics(courseId: string) {
    const [students, courseWork] = await Promise.all([
      this.getCourseStudents(courseId),
      this.getCourseWork(courseId)
    ]);
    const submissions = await Promise.all(
      courseWork.map((work: any) => this.getSubmissions(courseId, work.id))
    );
    const flattenedSubmissions = submissions.flat();
    const gradedSubmissions = flattenedSubmissions.filter(
      (submission: any) => typeof submission.assignedGrade === 'number'
    );
    const totalPoints = gradedSubmissions.reduce(
      (sum: number, submission: any) => sum + submission.assignedGrade,
      0
    );

    return {
      courseId,
      studentCount: students.length,
      courseWorkCount: courseWork.length,
      submissionCount: flattenedSubmissions.length,
      gradedSubmissionCount: gradedSubmissions.length,
      averageGrade: gradedSubmissions.length ? totalPoints / gradedSubmissions.length : null,
      coursework: courseWork.map((work: any, index: number) => ({
        id: work.id,
        title: work.title,
        submissionCount: submissions[index].length,
        gradedSubmissionCount: submissions[index].filter(
          (submission: any) => typeof submission.assignedGrade === 'number'
        ).length
      }))
    };
  }

  // Grade a submission
  async gradeSubmission(courseId: string, courseWorkId: string, submissionId: string, grade: number) {
    try {
      const response = await this.classroom.courses.courseWork.studentSubmissions.patch({
        courseId: courseId,
        courseWorkId: courseWorkId,
        id: submissionId,
        requestBody: {
          assignedGrade: grade,
          draftGrade: grade
        },
        updateMask: 'assignedGrade,draftGrade'
      });
      return response.data;
    } catch (error) {
      console.error('Error grading submission:', error);
      throw new Error('Failed to grade submission');
    }
  }

  // Create a Google Drive file and share it
  async createAndShareDocument(fileName: string, content: string, mimeType: string = 'text/plain') {
    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      
      // Create file metadata
      const fileMetadata = {
        name: fileName,
        mimeType: mimeType
      };

      // Create file
      const file = await drive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: mimeType,
          body: content
        }
      });

      // Make file accessible to anyone with the link
      await drive.permissions.create({
        fileId: file.data.id!,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });

      return {
        fileId: file.data.id,
        webViewLink: file.data.webViewLink,
        webContentLink: file.data.webContentLink
      };
    } catch (error) {
      console.error('Error creating Google Drive document:', error);
      throw new Error('Failed to create Google Drive document');
    }
  }

  // Get course announcements
  async getAnnouncements(courseId: string) {
    try {
      const response = await this.classroom.courses.announcements.list({
        courseId: courseId
      });
      return response.data.announcements || [];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw new Error('Failed to fetch announcements');
    }
  }

  // Create an announcement
  async createAnnouncement(courseId: string, announcementData: {
    text: string;
    materials?: any[];
  }) {
    try {
      const response = await this.classroom.courses.announcements.create({
        courseId: courseId,
        requestBody: {
          text: announcementData.text,
          materials: announcementData.materials || [],
          state: 'PUBLISHED'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw new Error('Failed to create announcement');
    }
  }

  // Sync our content with Google Classroom
  async syncContentToClassroom(courseId: string, content: any, contentType: 'assignment' | 'material' | 'announcement') {
    try {
      switch (contentType) {
        case 'assignment':
          return await this.createAssignment(courseId, {
            title: content.title || 'Generated Assignment',
            description: this.formatContentForClassroom(content),
            dueDate: content.dueDate,
            dueTime: content.dueTime
          });
        
        case 'material':
          return await this.createMaterial(courseId, {
            title: content.title || 'Generated Material',
            description: this.formatContentForClassroom(content),
            materials: []
          });
        
        case 'announcement':
          return await this.createAnnouncement(courseId, {
            text: this.formatContentForClassroom(content),
            materials: []
          });
        
        default:
          throw new Error('Invalid content type');
      }
    } catch (error) {
      console.error('Error syncing content to Google Classroom:', error);
      throw error;
    }
  }

  // Format our content for Google Classroom
  private formatContentForClassroom(content: any): string {
    let formattedContent = '';
    
    if (content.objectives) {
      formattedContent += `<h3>Learning Objectives:</h3><ul>`;
      const objectives = Array.isArray(content.objectives) ? content.objectives : [content.objectives];
      objectives.forEach((obj: string) => {
        formattedContent += `<li>${obj}</li>`;
      });
      formattedContent += `</ul>`;
    }

    if (content.activities) {
      formattedContent += `<h3>Activities:</h3><ul>`;
      const activities = Array.isArray(content.activities) ? content.activities : [content.activities];
      activities.forEach((activity: string) => {
        formattedContent += `<li>${activity}</li>`;
      });
      formattedContent += `</ul>`;
    }

    if (content.criteria) {
      formattedContent += `<h3>Assessment Criteria:</h3><ul>`;
      const criteria = Array.isArray(content.criteria) ? content.criteria : [content.criteria];
      criteria.forEach((criterion: string) => {
        formattedContent += `<li>${criterion}</li>`;
      });
      formattedContent += `</ul>`;
    }

    if (content.questions) {
      formattedContent += `<h3>Questions:</h3><ol>`;
      const questions = Array.isArray(content.questions) ? content.questions : [content.questions];
      questions.forEach((question: string) => {
        formattedContent += `<li>${question}</li>`;
      });
      formattedContent += `</ol>`;
    }

    if (content.comment) {
      formattedContent += `<h3>Comment:</h3><p>${content.comment}</p>`;
    }

    if (content.description) {
      formattedContent += `<h3>Description:</h3><p>${content.description}</p>`;
    }

    if (content.directions) {
      formattedContent += `<h3>Directions:</h3><ul>`;
      const directions = Array.isArray(content.directions) ? content.directions : [content.directions];
      directions.forEach((direction: string) => {
        formattedContent += `<li>${direction}</li>`;
      });
      formattedContent += `</ul>`;
    }

    return formattedContent || 'Generated content from AI Tutor Tools';
  }
} 