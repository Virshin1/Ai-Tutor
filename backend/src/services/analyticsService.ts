import LessonPlan from '../models/LessonPlan';
import Rubric from '../models/Rubric';
import IEP from '../models/IEP';
import ExitTicket from '../models/ExitTicket';
import ReportComment from '../models/ReportComment';
import Assignment from '../models/Assignment';
import Direction from '../models/Direction';

export class AnalyticsService {
  static async getUsageStats() {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get counts for each tool type
    const lessonPlanCount = await LessonPlan.countDocuments();
    const rubricCount = await Rubric.countDocuments();
    const iepCount = await IEP.countDocuments();
    const exitTicketCount = await ExitTicket.countDocuments();
    const reportCommentCount = await ReportComment.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    const directionCount = await Direction.countDocuments();
    
    // Get recent activity (last week)
    const recentLessonPlans = await LessonPlan.countDocuments({ createdAt: { $gte: lastWeek } });
    const recentRubrics = await Rubric.countDocuments({ createdAt: { $gte: lastWeek } });
    const recentIEPs = await IEP.countDocuments({ createdAt: { $gte: lastWeek } });
    const recentExitTickets = await ExitTicket.countDocuments({ createdAt: { $gte: lastWeek } });
    const recentReportComments = await ReportComment.countDocuments({ createdAt: { $gte: lastWeek } });
    const recentAssignments = await Assignment.countDocuments({ createdAt: { $gte: lastWeek } });
    const recentDirections = await Direction.countDocuments({ createdAt: { $gte: lastWeek } });
    
    // Get monthly activity
    const monthlyLessonPlans = await LessonPlan.countDocuments({ createdAt: { $gte: lastMonth } });
    const monthlyRubrics = await Rubric.countDocuments({ createdAt: { $gte: lastMonth } });
    const monthlyIEPs = await IEP.countDocuments({ createdAt: { $gte: lastMonth } });
    const monthlyExitTickets = await ExitTicket.countDocuments({ createdAt: { $gte: lastMonth } });
    const monthlyReportComments = await ReportComment.countDocuments({ createdAt: { $gte: lastMonth } });
    const monthlyAssignments = await Assignment.countDocuments({ createdAt: { $gte: lastMonth } });
    const monthlyDirections = await Direction.countDocuments({ createdAt: { $gte: lastMonth } });
    
    // Get activity by day of week
    const dayOfWeekStats = await this.getActivityByDayOfWeek();
    
    // Get most active hours
    const hourlyStats = await this.getActivityByHour();
    
    return {
      totalCounts: {
        lessonPlans: lessonPlanCount,
        rubrics: rubricCount,
        ieps: iepCount,
        exitTickets: exitTicketCount,
        reportComments: reportCommentCount,
        assignments: assignmentCount,
        directions: directionCount
      },
      recentActivity: {
        lessonPlans: recentLessonPlans,
        rubrics: recentRubrics,
        ieps: recentIEPs,
        exitTickets: recentExitTickets,
        reportComments: recentReportComments,
        assignments: recentAssignments,
        directions: recentDirections
      },
      monthlyActivity: {
        lessonPlans: monthlyLessonPlans,
        rubrics: monthlyRubrics,
        ieps: monthlyIEPs,
        exitTickets: monthlyExitTickets,
        reportComments: monthlyReportComments,
        assignments: monthlyAssignments,
        directions: monthlyDirections
      },
      dayOfWeekStats,
      hourlyStats,
      insights: this.generateInsights({
        lessonPlanCount,
        rubricCount,
        iepCount,
        exitTicketCount,
        reportCommentCount,
        assignmentCount,
        directionCount,
        recentLessonPlans,
        recentRubrics,
        recentIEPs,
        recentExitTickets,
        recentReportComments,
        recentAssignments,
        recentDirections
      })
    };
  }
  
  private static async getActivityByDayOfWeek() {
    const pipeline = [
      {
        $facet: {
          lessonPlans: [
            { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
          ],
          rubrics: [
            { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
          ],
          ieps: [
            { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
          ],
          exitTickets: [
            { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
          ],
          reportComments: [
            { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
          ],
          assignments: [
            { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
          ],
          directions: [
            { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
          ]
        }
      }
    ];
    
    const [lessonPlans] = await LessonPlan.aggregate(pipeline);
    const [rubrics] = await Rubric.aggregate(pipeline);
    const [ieps] = await IEP.aggregate(pipeline);
    const [exitTickets] = await ExitTicket.aggregate(pipeline);
    const [reportComments] = await ReportComment.aggregate(pipeline);
    const [assignments] = await Assignment.aggregate(pipeline);
    const [directions] = await Direction.aggregate(pipeline);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return {
      lessonPlans: this.formatDayStats(lessonPlans.lessonPlans, dayNames),
      rubrics: this.formatDayStats(rubrics.rubrics, dayNames),
      ieps: this.formatDayStats(ieps.ieps, dayNames),
      exitTickets: this.formatDayStats(exitTickets.exitTickets, dayNames),
      reportComments: this.formatDayStats(reportComments.reportComments, dayNames),
      assignments: this.formatDayStats(assignments.assignments, dayNames),
      directions: this.formatDayStats(directions.directions, dayNames)
    };
  }
  
  private static async getActivityByHour() {
    const pipeline = [
      {
        $facet: {
          lessonPlans: [
            { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
          ],
          rubrics: [
            { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
          ],
          ieps: [
            { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
          ],
          exitTickets: [
            { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
          ],
          reportComments: [
            { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
          ],
          assignments: [
            { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
          ],
          directions: [
            { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
          ]
        }
      }
    ];
    
    const [lessonPlans] = await LessonPlan.aggregate(pipeline);
    const [rubrics] = await Rubric.aggregate(pipeline);
    const [ieps] = await IEP.aggregate(pipeline);
    const [exitTickets] = await ExitTicket.aggregate(pipeline);
    const [reportComments] = await ReportComment.aggregate(pipeline);
    const [assignments] = await Assignment.aggregate(pipeline);
    const [directions] = await Direction.aggregate(pipeline);
    
    return {
      lessonPlans: this.formatHourStats(lessonPlans.lessonPlans),
      rubrics: this.formatHourStats(rubrics.rubrics),
      ieps: this.formatHourStats(ieps.ieps),
      exitTickets: this.formatHourStats(exitTickets.exitTickets),
      reportComments: this.formatHourStats(reportComments.reportComments),
      assignments: this.formatHourStats(assignments.assignments),
      directions: this.formatHourStats(directions.directions)
    };
  }
  
  private static formatDayStats(stats: any[], dayNames: string[]) {
    const formatted = dayNames.map((day, index) => ({
      day,
      count: 0
    }));
    
    stats.forEach(stat => {
      const dayIndex = stat._id - 1; // MongoDB dayOfWeek is 1-7, we want 0-6
      if (formatted[dayIndex]) {
        formatted[dayIndex].count = stat.count;
      }
    });
    
    return formatted;
  }
  
  private static formatHourStats(stats: any[]) {
    const formatted = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      count: 0
    }));
    
    stats.forEach(stat => {
      if (formatted[stat._id]) {
        formatted[stat._id].count = stat.count;
      }
    });
    
    return formatted;
  }
  
  private static generateInsights(stats: any) {
    const insights = [];
    
    // Most used tool
    const toolCounts = [
      { name: 'Lesson Plans', count: stats.lessonPlanCount },
      { name: 'Rubrics', count: stats.rubricCount },
      { name: 'IEPs', count: stats.iepCount },
      { name: 'Exit Tickets', count: stats.exitTicketCount },
      { name: 'Report Comments', count: stats.reportCommentCount },
      { name: 'Assignments', count: stats.assignmentCount },
      { name: 'Directions', count: stats.directionCount }
    ];
    
    const mostUsed = toolCounts.reduce((max, tool) => tool.count > max.count ? tool : max);
    insights.push(`Your most used tool is ${mostUsed.name} with ${mostUsed.count} items created.`);
    
    // Recent activity
    const recentTotal = stats.recentLessonPlans + stats.recentRubrics + stats.recentIEPs + 
                       stats.recentExitTickets + stats.recentReportComments + stats.recentAssignments + stats.recentDirections;
    
    if (recentTotal > 0) {
      insights.push(`You've been very active this week, creating ${recentTotal} new items!`);
    } else {
      insights.push("You haven't created any new items this week. Ready to get started?");
    }
    
    // Productivity tip
    if (stats.recentLessonPlans > 0 && stats.recentAssignments > 0) {
      insights.push("Great job balancing lesson planning with assignment creation!");
    }
    
    return insights;
  }
} 