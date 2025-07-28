// Analytics page implementation

/**
 * Load analytics page
 */
async function loadAnalytics() {
    const mainContent = document.getElementById('main-content');
    
    try {
        // Fetch analytics data
        const analyticsData = await analyticsAPI.getStats();
        const summaryData = await dashboardAPI.getSummary();
        
        mainContent.innerHTML = `
            <div class="min-h-screen bg-background text-textPrimary py-8">
                <div class="max-w-7xl mx-auto px-4">
                    <!-- Header -->
                    <div class="flex flex-col items-center mb-8">
                        <div class="rounded-full bg-accentYellow p-4 flex items-center justify-center mb-2">
                            <i data-lucide="bar-chart-3" class="h-10 w-10 text-background"></i>
                        </div>
                        <h1 class="text-3xl font-extrabold mb-1 text-center">Class Snapshot</h1>
                        <p class="text-textSecondary text-center mb-4">Enhanced dashboard view with analytics and insights</p>
                        <div class="w-full border-b border-[#353945] mb-4"></div>
                    </div>
                    
                    <!-- Summary Cards -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-8">
                        <div class="bg-accentYellow/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                            <i data-lucide="file-text" class="h-7 w-7 text-background mb-1"></i>
                            <span class="font-bold text-lg text-background">${summaryData.lessonPlans}</span>
                            <span class="text-xs text-background/80">Lesson Plans</span>
                        </div>
                        <div class="bg-accentBlue/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                            <i data-lucide="clipboard-list" class="h-7 w-7 text-background mb-1"></i>
                            <span class="font-bold text-lg text-background">${summaryData.rubrics}</span>
                            <span class="text-xs text-background/80">Rubrics</span>
                        </div>
                        <div class="bg-accentPurple/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                            <i data-lucide="users" class="h-7 w-7 text-background mb-1"></i>
                            <span class="font-bold text-lg text-background">${summaryData.ieps}</span>
                            <span class="text-xs text-background/80">IEPs</span>
                        </div>
                        <div class="bg-accentGreen/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                            <i data-lucide="check-circle" class="h-7 w-7 text-background mb-1"></i>
                            <span class="font-bold text-lg text-background">${summaryData.exitTickets}</span>
                            <span class="text-xs text-background/80">Exit Tickets</span>
                        </div>
                        <div class="bg-accentPink/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                            <i data-lucide="message-square" class="h-7 w-7 text-background mb-1"></i>
                            <span class="font-bold text-lg text-background">${summaryData.reportComments}</span>
                            <span class="text-xs text-background/80">Comments</span>
                        </div>
                        <div class="bg-accentYellow/70 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                            <i data-lucide="book-open" class="h-7 w-7 text-background mb-1"></i>
                            <span class="font-bold text-lg text-background">${summaryData.assignments}</span>
                            <span class="text-xs text-background/80">Assignments</span>
                        </div>
                        <div class="bg-accentBlue/70 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                            <i data-lucide="list" class="h-7 w-7 text-background mb-1"></i>
                            <span class="font-bold text-lg text-background">${summaryData.directions}</span>
                            <span class="text-xs text-background/80">Directions</span>
                        </div>
                    </div>
                    
                    <!-- Recent Activity Section -->
                    <div class="mb-8">
                        <h2 class="text-xl font-bold text-accentYellow mb-3">Recent Activity</h2>
                        <div id="recent-activity" class="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                            <!-- Recent activity will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Insights Section -->
                    <div class="bg-card rounded-2xl shadow-lg p-6">
                        <h3 class="text-lg font-semibold text-textPrimary mb-4">Productivity Insights</h3>
                        <div class="space-y-3">
                            ${analyticsData.insights.map(insight => `
                                <div class="flex items-start">
                                    <div class="flex-shrink-0">
                                        <i data-lucide="info" class="w-5 h-5 text-accentBlue mt-0.5"></i>
                                    </div>
                                    <p class="ml-3 text-textSecondary">${insight}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load recent activity
        await loadRecentActivity();
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        mainContent.innerHTML = `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <div class="text-red-400 text-xl mb-4">Error loading analytics</div>
                    <button onclick="loadAnalytics()" class="btn-primary">Retry</button>
                </div>
            </div>
        `;
    }
}

/**
 * Load recent activity data
 */
async function loadRecentActivity() {
    try {
        const [lessonPlans, rubrics, ieps, exitTickets, reportComments, assignments, directions] = await Promise.all([
            dashboardAPI.getLessonPlans(),
            dashboardAPI.getRubrics(),
            dashboardAPI.getIEPs(),
            dashboardAPI.getExitTickets(),
            dashboardAPI.getReportComments(),
            dashboardAPI.getAssignments(),
            dashboardAPI.getDirections()
        ]);
        
        // Combine and sort all items
        const allItems = [
            ...lessonPlans.map(item => ({ ...item, type: 'lesson-plan' })),
            ...rubrics.map(item => ({ ...item, type: 'rubric' })),
            ...ieps.map(item => ({ ...item, type: 'iep' })),
            ...exitTickets.map(item => ({ ...item, type: 'exit-ticket' })),
            ...reportComments.map(item => ({ ...item, type: 'report-comment' })),
            ...assignments.map(item => ({ ...item, type: 'assignment' })),
            ...directions.map(item => ({ ...item, type: 'direction' }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
         .slice(0, 5); // Get top 5 most recent
        
        const recentActivityContainer = document.getElementById('recent-activity');
        
        if (allItems.length === 0) {
            recentActivityContainer.innerHTML = `
                <div class="text-textSecondary flex items-center justify-center h-20 px-4">
                    No recent activity.
                </div>
            `;
        } else {
            recentActivityContainer.innerHTML = allItems.map((item, index) => 
                createRecentActivityCard(item, index)
            ).join('');
        }
        
        initLucideIcons();
        
    } catch (error) {
        console.error('Error loading recent activity:', error);
        document.getElementById('recent-activity').innerHTML = `
            <div class="text-red-400 flex items-center justify-center h-20 px-4">
                Error loading recent activity.
            </div>
        `;
    }
}