import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface AnalyticsData {
  totalCounts: {
    lessonPlans: number;
    rubrics: number;
    ieps: number;
    exitTickets: number;
    reportComments: number;
    assignments: number;
    directions: number;
  };
  recentActivity: {
    lessonPlans: number;
    rubrics: number;
    ieps: number;
    exitTickets: number;
    reportComments: number;
    assignments: number;
    directions: number;
  };
  monthlyActivity: {
    lessonPlans: number;
    rubrics: number;
    ieps: number;
    exitTickets: number;
    reportComments: number;
    assignments: number;
    directions: number;
  };
  dayOfWeekStats: {
    lessonPlans: Array<{ day: string; count: number }>;
    rubrics: Array<{ day: string; count: number }>;
    ieps: Array<{ day: string; count: number }>;
    exitTickets: Array<{ day: string; count: number }>;
    reportComments: Array<{ day: string; count: number }>;
    assignments: Array<{ day: string; count: number }>;
    directions: Array<{ day: string; count: number }>;
  };
  hourlyStats: {
    lessonPlans: Array<{ hour: string; count: number }>;
    rubrics: Array<{ hour: string; count: number }>;
    ieps: Array<{ hour: string; count: number }>;
    exitTickets: Array<{ hour: string; count: number }>;
    reportComments: Array<{ hour: string; count: number }>;
    assignments: Array<{ hour: string; count: number }>;
    directions: Array<{ hour: string; count: number }>;
  };
  insights: string[];
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading analytics</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const totalCountsData = {
    labels: ['Lesson Plans', 'Rubrics', 'IEPs', 'Exit Tickets', 'Report Comments', 'Assignments', 'Directions'],
    datasets: [
      {
        label: 'Total Items',
        data: [
          analyticsData.totalCounts.lessonPlans,
          analyticsData.totalCounts.rubrics,
          analyticsData.totalCounts.ieps,
          analyticsData.totalCounts.exitTickets,
          analyticsData.totalCounts.reportComments,
          analyticsData.totalCounts.assignments,
          analyticsData.totalCounts.directions,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const recentActivityData = {
    labels: ['Lesson Plans', 'Rubrics', 'IEPs', 'Exit Tickets', 'Report Comments', 'Assignments', 'Directions'],
    datasets: [
      {
        label: 'This Week',
        data: [
          analyticsData.recentActivity.lessonPlans,
          analyticsData.recentActivity.rubrics,
          analyticsData.recentActivity.ieps,
          analyticsData.recentActivity.exitTickets,
          analyticsData.recentActivity.reportComments,
          analyticsData.recentActivity.assignments,
          analyticsData.recentActivity.directions,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'This Month',
        data: [
          analyticsData.monthlyActivity.lessonPlans,
          analyticsData.monthlyActivity.rubrics,
          analyticsData.monthlyActivity.ieps,
          analyticsData.monthlyActivity.exitTickets,
          analyticsData.monthlyActivity.reportComments,
          analyticsData.monthlyActivity.assignments,
          analyticsData.monthlyActivity.directions,
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const dayOfWeekData = {
    labels: analyticsData.dayOfWeekStats.lessonPlans.map(stat => stat.day),
    datasets: [
      {
        label: 'Lesson Plans',
        data: analyticsData.dayOfWeekStats.lessonPlans.map(stat => stat.count),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Assignments',
        data: analyticsData.dayOfWeekStats.assignments.map(stat => stat.count),
        borderColor: 'rgba(236, 72, 153, 1)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const totalItems = Object.values(analyticsData.totalCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your teaching tool usage and productivity insights</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Object.values(analyticsData.recentActivity).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Object.values(analyticsData.monthlyActivity).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Most Active</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(() => {
                    const toolCounts = [
                      { name: 'Lesson Plans', count: analyticsData.totalCounts.lessonPlans },
                      { name: 'Rubrics', count: analyticsData.totalCounts.rubrics },
                      { name: 'IEPs', count: analyticsData.totalCounts.ieps },
                      { name: 'Exit Tickets', count: analyticsData.totalCounts.exitTickets },
                      { name: 'Report Comments', count: analyticsData.totalCounts.reportComments },
                      { name: 'Assignments', count: analyticsData.totalCounts.assignments },
                      { name: 'Directions', count: analyticsData.totalCounts.directions },
                    ];
                    const mostUsed = toolCounts.reduce((max, tool) => tool.count > max.count ? tool : max);
                    return mostUsed.name;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Total Counts Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Items by Type</h3>
            <div className="h-80">
              <Bar
                data={totalCountsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Recent Activity Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="h-80">
              <Bar
                data={recentActivityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Day of Week Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity by Day of Week</h3>
          <div className="h-80">
            <Line
              data={dayOfWeekData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Insights</h3>
          <div className="space-y-3">
            {analyticsData.insights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 