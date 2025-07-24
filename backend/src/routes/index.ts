import { Router } from 'express';
import { sampleController, saveDocument, getDocuments } from '../controllers/sampleController';
import aiController from '../controllers/aiController';
import LessonPlan from '../models/LessonPlan';
import Rubric from '../models/Rubric';
import IEP from '../models/IEP';
import ExitTicket from '../models/ExitTicket';
import ReportComment from '../models/ReportComment';
import Assignment from '../models/Assignment';
import Direction from '../models/Direction';
import Student from '../models/Student';
import Template from '../models/Template';
import Share from '../models/Share';
import { PDFService } from '../services/pdfService';
import { AnalyticsService } from '../services/analyticsService';
import { GoogleClassroomService } from '../services/googleClassroomService';
import Document from '../models/Document';
import mongoose from 'mongoose';

console.log('ROUTES FILE LOADED');

const router = Router();

router.delete('/documents/:id', async (req, res) => {
  const { id } = req.params;
  console.log('INSIDE DELETE ROUTE', id);
  console.log('DELETE /documents/:id called with id:', id);
  console.log('ObjectId.isValid:', mongoose.Types.ObjectId.isValid(id));
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid document ID:', id);
      return res.status(400).json({ error: 'Invalid document ID.' });
    }
    const deleted = await Document.findByIdAndDelete(id);
    if (!deleted) {
      console.error('Document not found for ID:', id);
      return res.status(404).json({ error: 'Document not found.' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete document.' });
  }
});

router.get('/sample', sampleController);
router.post('/ai/lesson-plan', aiController.generateLessonPlan);
router.post('/ai/rubric', aiController.generateRubric);
router.post('/ai/iep', aiController.generateIEP);
router.post('/ai/exit-ticket', aiController.generateExitTicket);
router.post('/ai/report-comment', aiController.generateReportComment);
router.post('/ai/assignments', aiController.generateAssignments);
router.post('/ai/directions', aiController.generateDirections);

// Dashboard data routes
router.get('/dashboard/lesson-plans', async (req, res) => {
  try {
    const lessonPlans = await LessonPlan.find().sort({ createdAt: -1 }).limit(10);
    res.json(lessonPlans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson plans.' });
  }
});

router.get('/dashboard/rubrics', async (req, res) => {
  try {
    const rubrics = await Rubric.find().sort({ createdAt: -1 }).limit(10);
    res.json(rubrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rubrics.' });
  }
});

router.get('/dashboard/ieps', async (req, res) => {
  try {
    const ieps = await IEP.find().sort({ createdAt: -1 }).limit(10);
    res.json(ieps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch IEPs.' });
  }
});

router.get('/dashboard/exit-tickets', async (req, res) => {
  try {
    const exitTickets = await ExitTicket.find().sort({ createdAt: -1 }).limit(10);
    res.json(exitTickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exit tickets.' });
  }
});

router.get('/dashboard/report-comments', async (req, res) => {
  try {
    const reportComments = await ReportComment.find().sort({ createdAt: -1 }).limit(10);
    res.json(reportComments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report comments.' });
  }
});

router.get('/dashboard/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).limit(10);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
});

router.get('/dashboard/directions', async (req, res) => {
  try {
    const directions = await Direction.find().sort({ createdAt: -1 }).limit(10);
    res.json(directions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch directions.' });
  }
});

// Summary route for dashboard
router.get('/dashboard/summary', async (req, res) => {
  try {
    const [lessonPlans, rubrics, ieps, exitTickets, reportComments, assignments, directions] = await Promise.all([
      LessonPlan.countDocuments(),
      Rubric.countDocuments(),
      IEP.countDocuments(),
      ExitTicket.countDocuments(),
      ReportComment.countDocuments(),
      Assignment.countDocuments(),
      Direction.countDocuments()
    ]);

    res.json({
      lessonPlans,
      rubrics,
      ieps,
      exitTickets,
      reportComments,
      assignments,
      directions,
      total: lessonPlans + rubrics + ieps + exitTickets + reportComments + assignments + directions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary.' });
  }
});

// Search and filtering routes
router.get('/search/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { q, subject, gradeLevel, startDate, endDate } = req.query;
    
    let query: any = {};
    
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { gradeLevel: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filter by subject
    if (subject) {
      query.subject = subject;
    }
    
    // Filter by grade level
    if (gradeLevel) {
      query.gradeLevel = gradeLevel;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }
    
    let results;
    switch (type) {
      case 'lesson-plans':
        results = await LessonPlan.find(query).sort({ createdAt: -1 });
        break;
      case 'rubrics':
        results = await Rubric.find(query).sort({ createdAt: -1 });
        break;
      case 'ieps':
        results = await IEP.find(query).sort({ createdAt: -1 });
        break;
      case 'exit-tickets':
        results = await ExitTicket.find(query).sort({ createdAt: -1 });
        break;
      case 'report-comments':
        results = await ReportComment.find(query).sort({ createdAt: -1 });
        break;
      case 'assignments':
        results = await Assignment.find(query).sort({ createdAt: -1 });
        break;
      case 'directions':
        results = await Direction.find(query).sort({ createdAt: -1 });
        break;
      default:
        return res.status(400).json({ error: 'Invalid type specified.' });
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search items.' });
  }
});

// Global search across all types
router.get('/search', async (req, res) => {
  try {
    const { q, subject, gradeLevel, startDate, endDate } = req.query;
    
    let query: any = {};
    
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { gradeLevel: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filter by subject
    if (subject) {
      query.subject = subject;
    }
    
    // Filter by grade level
    if (gradeLevel) {
      query.gradeLevel = gradeLevel;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }
    
    const [lessonPlans, rubrics, ieps, exitTickets, reportComments, assignments, directions] = await Promise.all([
      LessonPlan.find(query).sort({ createdAt: -1 }).limit(5),
      Rubric.find(query).sort({ createdAt: -1 }).limit(5),
      IEP.find(query).sort({ createdAt: -1 }).limit(5),
      ExitTicket.find(query).sort({ createdAt: -1 }).limit(5),
      ReportComment.find(query).sort({ createdAt: -1 }).limit(5),
      Assignment.find(query).sort({ createdAt: -1 }).limit(5),
      Direction.find(query).sort({ createdAt: -1 }).limit(5)
    ]);
    
    const results = [
      ...lessonPlans.map(item => ({ ...item.toObject(), type: 'lesson-plan' })),
      ...rubrics.map(item => ({ ...item.toObject(), type: 'rubric' })),
      ...ieps.map(item => ({ ...item.toObject(), type: 'iep' })),
      ...exitTickets.map(item => ({ ...item.toObject(), type: 'exit-ticket' })),
      ...reportComments.map(item => ({ ...item.toObject(), type: 'report-comment' })),
      ...assignments.map(item => ({ ...item.toObject(), type: 'assignment' })),
      ...directions.map(item => ({ ...item.toObject(), type: 'direction' }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search items.' });
  }
});

// Export routes
router.get('/export/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let item;
    switch (type) {
      case 'lesson-plan':
        item = await LessonPlan.findById(id);
        break;
      case 'rubric':
        item = await Rubric.findById(id);
        break;
      case 'iep':
        item = await IEP.findById(id);
        break;
      case 'exit-ticket':
        item = await ExitTicket.findById(id);
        break;
      case 'report-comment':
        item = await ReportComment.findById(id);
        break;
      case 'assignment':
        item = await Assignment.findById(id);
        break;
      case 'direction':
        item = await Direction.findById(id);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type specified.' });
    }
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    
    // Format content as text
    let textContent = '';
    
    switch (type) {
      case 'lesson-plan':
        const lessonPlan = item as any;
        textContent = `${lessonPlan.title}\n\nSubject: ${lessonPlan.subject}\nGrade Level: ${lessonPlan.gradeLevel}\nDuration: ${lessonPlan.duration}\n\nObjectives:\n${lessonPlan.objectives}\n\nMaterials:\n${lessonPlan.materials}\n\nActivities:\n${lessonPlan.activities}\n\nAssessment:\n${lessonPlan.assessment}`;
        break;
      case 'rubric':
        const rubric = item as any;
        textContent = `${rubric.title}\n\nSubject: ${rubric.subject}\nGrade Level: ${rubric.gradeLevel}\n\nCriteria:\n${rubric.criteria}\n\nLevels:\n${rubric.levels}`;
        break;
      case 'iep':
        const iep = item as any;
        textContent = `IEP for ${iep.studentName}\n\nGrade Level: ${iep.gradeLevel}\nSubject: ${iep.subject}\n\nGoals:\n${iep.goals}\n\nAccommodations:\n${iep.accommodations}\n\nModifications:\n${iep.modifications}`;
        break;
      case 'exit-ticket':
        const exitTicket = item as any;
        textContent = `Exit Ticket: ${exitTicket.topic}\n\nSubject: ${exitTicket.subject}\nGrade Level: ${exitTicket.gradeLevel}\n\nQuestions:\n${exitTicket.questions}`;
        break;
      case 'report-comment':
        const reportComment = item as any;
        textContent = `Report Comment for ${reportComment.studentName}\n\nSubject: ${reportComment.subject}\nGrade Level: ${reportComment.gradeLevel}\nPerformance: ${reportComment.performance}\n\nComment:\n${reportComment.comment}`;
        break;
      case 'assignment':
        const assignment = item as any;
        textContent = `Assignment: ${assignment.topic}\n\nSubject: ${assignment.subject}\nGrade Level: ${assignment.gradeLevel}\nStudent Level: ${assignment.studentLevel}\n\nAssignments:\n${assignment.assignments}`;
        break;
      case 'direction':
        const direction = item as any;
        textContent = `Directions: ${direction.activity}\n\nSubject: ${direction.subject}\nGrade Level: ${direction.gradeLevel}\n\nDirections:\n${direction.directions}`;
        break;
    }
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-${id}.txt"`);
    res.send(textContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export item.' });
  }
});

// Bulk export route
router.post('/export/bulk', async (req, res) => {
  try {
    const { items } = req.body; // Array of { type, id }
    
    const exportedItems = [];
    
    for (const { type, id } of items) {
      let item;
      switch (type) {
        case 'lesson-plan':
          item = await LessonPlan.findById(id);
          break;
        case 'rubric':
          item = await Rubric.findById(id);
          break;
        case 'iep':
          item = await IEP.findById(id);
          break;
        case 'exit-ticket':
          item = await ExitTicket.findById(id);
          break;
        case 'report-comment':
          item = await ReportComment.findById(id);
          break;
        case 'assignment':
          item = await Assignment.findById(id);
          break;
        case 'direction':
          item = await Direction.findById(id);
          break;
      }
      
      if (item) {
        exportedItems.push({
          type,
          data: item,
          exportedAt: new Date().toISOString()
        });
      }
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="teaching-tools-export.json"');
    res.json(exportedItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export items.' });
  }
});

// Import route
router.post('/import', async (req, res) => {
  try {
    const { items } = req.body; // Array of { type, data }
    
    const importedItems = [];
    
    for (const { type, data } of items) {
      let newItem;
      switch (type) {
        case 'lesson-plan':
          newItem = new LessonPlan(data);
          break;
        case 'rubric':
          newItem = new Rubric(data);
          break;
        case 'iep':
          newItem = new IEP(data);
          break;
        case 'exit-ticket':
          newItem = new ExitTicket(data);
          break;
        case 'report-comment':
          newItem = new ReportComment(data);
          break;
        case 'assignment':
          newItem = new Assignment(data);
          break;
        case 'direction':
          newItem = new Direction(data);
          break;
      }
      
      if (newItem) {
        await newItem.save();
        importedItems.push({ type, id: newItem._id });
      }
    }
    
    res.json({ 
      message: `Successfully imported ${importedItems.length} items.`,
      importedItems 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import items.' });
  }
});

// Content management routes (CRUD operations)
router.put('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const updateData = req.body;
    
    let updatedItem;
    switch (type) {
      case 'lesson-plan':
        updatedItem = await LessonPlan.findByIdAndUpdate(id, updateData, { new: true });
        break;
      case 'rubric':
        updatedItem = await Rubric.findByIdAndUpdate(id, updateData, { new: true });
        break;
      case 'iep':
        updatedItem = await IEP.findByIdAndUpdate(id, updateData, { new: true });
        break;
      case 'exit-ticket':
        updatedItem = await ExitTicket.findByIdAndUpdate(id, updateData, { new: true });
        break;
      case 'report-comment':
        updatedItem = await ReportComment.findByIdAndUpdate(id, updateData, { new: true });
        break;
      case 'assignment':
        updatedItem = await Assignment.findByIdAndUpdate(id, updateData, { new: true });
        break;
      case 'direction':
        updatedItem = await Direction.findByIdAndUpdate(id, updateData, { new: true });
        break;
      default:
        return res.status(400).json({ error: 'Invalid type specified.' });
    }
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item.' });
  }
});

router.delete('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let deletedItem;
    switch (type) {
      case 'lesson-plan':
        deletedItem = await LessonPlan.findByIdAndDelete(id);
        break;
      case 'rubric':
        deletedItem = await Rubric.findByIdAndDelete(id);
        break;
      case 'iep':
        deletedItem = await IEP.findByIdAndDelete(id);
        break;
      case 'exit-ticket':
        deletedItem = await ExitTicket.findByIdAndDelete(id);
        break;
      case 'report-comment':
        deletedItem = await ReportComment.findByIdAndDelete(id);
        break;
      case 'assignment':
        deletedItem = await Assignment.findByIdAndDelete(id);
        break;
      case 'direction':
        deletedItem = await Direction.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type specified.' });
    }
    
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    
    res.json({ message: 'Item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

// Duplicate item route
router.post('/:type/:id/duplicate', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let originalItem;
    switch (type) {
      case 'lesson-plan':
        originalItem = await LessonPlan.findById(id);
        break;
      case 'rubric':
        originalItem = await Rubric.findById(id);
        break;
      case 'iep':
        originalItem = await IEP.findById(id);
        break;
      case 'exit-ticket':
        originalItem = await ExitTicket.findById(id);
        break;
      case 'report-comment':
        originalItem = await ReportComment.findById(id);
        break;
      case 'assignment':
        originalItem = await Assignment.findById(id);
        break;
      case 'direction':
        originalItem = await Direction.findById(id);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type specified.' });
    }
    
    if (!originalItem) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    
    // Create a copy without the _id and timestamps
    const itemData = originalItem.toObject();
    delete (itemData as any)._id;
    delete (itemData as any).createdAt;
    delete (itemData as any).updatedAt;
    
    // Add "(Copy)" to the title if it exists
    if ((itemData as any).title) {
      (itemData as any).title = `${(itemData as any).title} (Copy)`;
    }
    
    let newItem;
    switch (type) {
      case 'lesson-plan':
        newItem = new LessonPlan(itemData);
        break;
      case 'rubric':
        newItem = new Rubric(itemData);
        break;
      case 'iep':
        newItem = new IEP(itemData);
        break;
      case 'exit-ticket':
        newItem = new ExitTicket(itemData);
        break;
      case 'report-comment':
        newItem = new ReportComment(itemData);
        break;
      case 'assignment':
        newItem = new Assignment(itemData);
        break;
      case 'direction':
        newItem = new Direction(itemData);
        break;
    }
    
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate item.' });
  }
});

// PDF Export routes
router.get('/pdf/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let item;
    switch (type) {
      case 'lesson-plan':
        item = await LessonPlan.findById(id);
        break;
      case 'rubric':
        item = await Rubric.findById(id);
        break;
      case 'iep':
        item = await IEP.findById(id);
        break;
      case 'exit-ticket':
        item = await ExitTicket.findById(id);
        break;
      case 'report-comment':
        item = await ReportComment.findById(id);
        break;
      case 'assignment':
        item = await Assignment.findById(id);
        break;
      case 'direction':
        item = await Direction.findById(id);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type specified.' });
    }
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    
    const title = (item as any).title || `${type.replace('-', ' ')} ${id}`;
    const pdfBytes = await PDFService.generatePDF((item as any), type, title);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-${id}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate PDF.' });
  }
});

// Analytics routes
router.get('/analytics', async (req, res) => {
  try {
    const stats = await AnalyticsService.getUsageStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

// Student management routes
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

router.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student.' });
  }
});

router.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student.' });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student.' });
  }
});

// Template routes
router.get('/templates', async (req, res) => {
  try {
    const { type } = req.query;
    let query: any = {};
    if (type) {
      query.type = type;
    }
    const templates = await Template.find(query).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates.' });
  }
});

router.post('/templates', async (req, res) => {
  try {
    const template = new Template(req.body);
    await template.save();
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template.' });
  }
});

router.put('/templates/:id', async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!template) {
      return res.status(404).json({ error: 'Template not found.' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template.' });
  }
});

router.delete('/templates/:id', async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found.' });
    }
    res.json({ message: 'Template deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template.' });
  }
});

// Sharing routes
router.post('/share', async (req, res) => {
  try {
    const { itemId, itemType, sharedWith, permissions } = req.body;
    const share = new Share({
      itemId,
      itemType,
      sharedBy: 'current-user', // In a real app, this would be the authenticated user
      sharedWith,
      permissions: permissions || 'view'
    });
    await share.save();
    res.json(share);
  } catch (error) {
    res.status(500).json({ error: 'Failed to share item.' });
  }
});

router.get('/shared-with-me', async (req, res) => {
  try {
    const shares = await Share.find({ 
      sharedWith: 'current-user', // In a real app, this would be the authenticated user
      isActive: true 
    }).populate('itemId');
    res.json(shares);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shared items.' });
  }
});

router.get('/my-shares', async (req, res) => {
  try {
    const shares = await Share.find({ 
      sharedBy: 'current-user', // In a real app, this would be the authenticated user
      isActive: true 
    });
    res.json(shares);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch my shares.' });
  }
});

router.delete('/share/:id', async (req, res) => {
  try {
    const share = await Share.findByIdAndDelete(req.params.id);
    if (!share) {
      return res.status(404).json({ error: 'Share not found.' });
    }
    res.json({ message: 'Share removed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove share.' });
  }
});

// Google Classroom integration routes
router.get('/google-classroom/courses', async (req, res) => {
  try {
    const { accessToken } = req.query;
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }

    const classroomService = new GoogleClassroomService();
    await classroomService.initialize(accessToken as string);
    const courses = await classroomService.getCourses();
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Google Classroom courses' });
  }
});

router.get('/google-classroom/courses/:courseId/students', async (req, res) => {
  try {
    const { accessToken } = req.query;
    const { courseId } = req.params;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }

    const classroomService = new GoogleClassroomService();
    await classroomService.initialize(accessToken as string);
    const students = await classroomService.getCourseStudents(courseId);
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course students' });
  }
});

router.post('/google-classroom/sync', async (req, res) => {
  try {
    const { accessToken, courseId, content, contentType } = req.body;
    
    if (!accessToken || !courseId || !content || !contentType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const classroomService = new GoogleClassroomService();
    await classroomService.initialize(accessToken);
    const result = await classroomService.syncContentToClassroom(courseId, content, contentType);
    
    res.json({ 
      message: 'Content synced to Google Classroom successfully',
      result 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync content to Google Classroom' });
  }
});

router.post('/google-classroom/create-assignment', async (req, res) => {
  try {
    const { accessToken, courseId, assignmentData } = req.body;
    
    console.log('Create assignment request:', { courseId, assignmentData: assignmentData ? 'present' : 'missing' });
    
    if (!accessToken || !courseId || !assignmentData) {
      console.log('Missing parameters:', { accessToken: !!accessToken, courseId: !!courseId, assignmentData: !!assignmentData });
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const classroomService = new GoogleClassroomService();
    await classroomService.initialize(accessToken);
    const result = await classroomService.createAssignment(courseId, assignmentData);
    
    console.log('Assignment created successfully:', result);
    res.json({ 
      message: 'Assignment created in Google Classroom successfully',
      result 
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ 
      error: 'Failed to create Google Classroom assignment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/google-classroom/create-material', async (req, res) => {
  try {
    const { accessToken, courseId, materialData } = req.body;
    
    if (!accessToken || !courseId || !materialData) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const classroomService = new GoogleClassroomService();
    await classroomService.initialize(accessToken);
    const result = await classroomService.createMaterial(courseId, materialData);
    
    res.json({ 
      message: 'Material created in Google Classroom successfully',
      result 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Google Classroom material' });
  }
});

router.get('/google-classroom/courses/:courseId/assignments/:assignmentId/submissions', async (req, res) => {
  try {
    const { accessToken } = req.query;
    const { courseId, assignmentId } = req.params;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }

    const classroomService = new GoogleClassroomService();
    await classroomService.initialize(accessToken as string);
    const submissions = await classroomService.getSubmissions(courseId, assignmentId);
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

router.post('/google-classroom/grade-submission', async (req, res) => {
  try {
    const { accessToken, courseId, courseWorkId, submissionId, grade } = req.body;
    
    if (!accessToken || !courseId || !courseWorkId || !submissionId || grade === undefined) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const classroomService = new GoogleClassroomService();
    await classroomService.initialize(accessToken);
    const result = await classroomService.gradeSubmission(courseId, courseWorkId, submissionId, grade);
    
    res.json({ 
      message: 'Submission graded successfully',
      result 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});

// PDF Export endpoint
router.post('/export/pdf', async (req, res) => {
  try {
    const { content, toolName, formData, type } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const pdfBuffer = await PDFService.generatePDF(
      content,
      type || 'generic',
      toolName
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${toolName}-${new Date().toISOString().split('T')[0]}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

router.post('/documents', saveDocument);
router.get('/documents', getDocuments);

export default router;
