import { Request, Response } from 'express';
import { generateLessonPlanGroq, generateIEPGroq, generateExitTicketGroq, generateReportCommentGroq, generateAssignmentsGroq, generateDirectionsGroq } from '../utils/gemini';
import { generateRubricGroq } from '../utils/gemini';
import LessonPlan from '../models/LessonPlan';
import Rubric from '../models/Rubric';
import IEP from '../models/IEP';
import ExitTicket from '../models/ExitTicket';
import ReportComment from '../models/ReportComment';
import Assignment from '../models/Assignment';
import Direction from '../models/Direction';

const aiController = {
  generateLessonPlan: async (req: Request, res: Response) => {
    try {
      const { subject, topic, gradeLevel, duration, objectives, materials } = req.body;
      const prompt = `Generate a detailed lesson plan for the following:\nSubject: ${subject}\nTopic: ${topic}\nGrade Level: ${gradeLevel}\nDuration: ${duration}\nObjectives: ${objectives}\nMaterials: ${materials}`;
      const aiResponse = await generateLessonPlanGroq(prompt);
      
      // Save to database
      const lessonPlan = new LessonPlan({
        title: topic,
        subject,
        gradeLevel,
        duration,
        objectives,
        materials,
        activities: aiResponse,
        assessment: 'Generated assessment included in activities'
      });
      await lessonPlan.save();
      
      res.json({ result: aiResponse, id: lessonPlan._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate lesson plan.' });
    }
  },
  generateRubric: async (req: Request, res: Response) => {
    try {
      const { assignment, criteria, levels, gradeLevel, subject } = req.body;
      const prompt = `Generate a detailed grading rubric for the following assignment:\nAssignment: ${assignment}\nSubject: ${subject}\nGrade Level: ${gradeLevel}\nCriteria: ${criteria}\nScoring Levels: ${levels}`;
      const aiResponse = await generateRubricGroq(prompt);
      
      // Save to database
      const rubric = new Rubric({
        title: assignment,
        subject,
        gradeLevel,
        criteria,
        levels: aiResponse
      });
      await rubric.save();
      
      res.json({ result: aiResponse, id: rubric._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate rubric.' });
    }
  },
  generateIEP: async (req: Request, res: Response) => {
    try {
      const { studentName, grade, disability, currentPerformance, goals, accommodations } = req.body;
      const prompt = `Draft an Individualized Education Program (IEP) for the following student:\nStudent Name: ${studentName}\nGrade: ${grade}\nDisability: ${disability}\nCurrent Performance: ${currentPerformance}\nGoals: ${goals}\nAccommodations: ${accommodations}`;
      const aiResponse = await generateIEPGroq(prompt);
      
      // Save to database
      const iep = new IEP({
        studentName,
        gradeLevel: grade,
        subject: 'General',
        goals,
        accommodations,
        modifications: aiResponse
      });
      await iep.save();
      
      res.json({ result: aiResponse, id: iep._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate IEP.' });
    }
  },
  generateExitTicket: async (req: Request, res: Response) => {
    try {
      const { topic, gradeLevel, questionType, objectives, numQuestions } = req.body;
      const prompt = `Generate an end-of-lesson exit ticket for the following:\nTopic: ${topic}\nGrade Level: ${gradeLevel}\nObjectives: ${objectives}\nQuestion Type: ${questionType}\nNumber of Questions: ${numQuestions}`;
      const aiResponse = await generateExitTicketGroq(prompt);
      
      // Save to database
      const exitTicket = new ExitTicket({
        subject: 'General',
        gradeLevel,
        topic,
        questions: aiResponse
      });
      await exitTicket.save();
      
      res.json({ result: aiResponse, id: exitTicket._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate exit ticket.' });
    }
  },
  generateReportComment: async (req: Request, res: Response) => {
    try {
      const { studentName, subject, tone, performance, strengths, improvements, behavior } = req.body;
      const prompt = `Generate a progress report comment for the following student:\nStudent Name: ${studentName}\nSubject: ${subject}\nTone: ${tone}\nPerformance: ${performance}\nStrengths: ${strengths}\nAreas for Improvement: ${improvements}\nBehavior: ${behavior}`;
      const aiResponse = await generateReportCommentGroq(prompt);
      
      // Save to database
      const reportComment = new ReportComment({
        studentName,
        gradeLevel: 'General',
        subject,
        performance,
        comment: aiResponse
      });
      await reportComment.save();
      
      res.json({ result: aiResponse, id: reportComment._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate report comment.' });
    }
  },
  generateAssignments: async (req: Request, res: Response) => {
    try {
      const { subject, gradeLevel, currentLevel, learningStyle, interests, timeAvailable, goals } = req.body;
      const prompt = `Suggest personalized assignments for a student with the following details:\nSubject: ${subject}\nGrade Level: ${gradeLevel}\nCurrent Performance Level: ${currentLevel}\nLearning Style: ${learningStyle}\nInterests: ${interests}\nTime Available: ${timeAvailable}\nGoals: ${goals}`;
      const aiResponse = await generateAssignmentsGroq(prompt);
      
      // Save to database
      const assignment = new Assignment({
        subject,
        gradeLevel,
        topic: 'Personalized Assignments',
        studentLevel: currentLevel,
        assignments: aiResponse
      });
      await assignment.save();
      
      res.json({ result: aiResponse, id: assignment._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate assignments.' });
    }
  },
  generateDirections: async (req: Request, res: Response) => {
    try {
      const { activityType, gradeLevel, timeLimit, materials, objective, complexity } = req.body;
      const prompt = `Generate clear, step-by-step directions for a classroom activity:\nActivity Type: ${activityType}\nGrade Level: ${gradeLevel}\nTime Limit: ${timeLimit}\nMaterials: ${materials}\nObjective: ${objective}\nComplexity: ${complexity}`;
      const aiResponse = await generateDirectionsGroq(prompt);
      
      // Save to database
      const direction = new Direction({
        activity: activityType,
        gradeLevel,
        subject: 'General',
        directions: aiResponse
      });
      await direction.save();
      
      res.json({ result: aiResponse, id: direction._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate directions.' });
    }
  },
};

export default aiController; 