// Dashboard page implementation

/**
 * Load dashboard page
 */
async function loadDashboard() {
    const mainContent = document.getElementById('main-content');
    
    const filterOptions = [
        { label: 'All Tools', value: 'all' },
        { label: 'Favorites', value: 'favorites' },
        { label: 'Plan', value: 'plan' },
        { label: 'Create', value: 'create' },
        { label: 'Support', value: 'support' }
    ];
    
    const filteredTools = filterTools(appState.activeFilter);
    
    mainContent.innerHTML = `
        <div class="min-h-screen bg-background text-textPrimary">
            <div class="max-w-7xl mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold mb-2">Teacher Tools</h1>
                <p class="text-textSecondary mb-6">AI-powered tools to enhance your teaching experience</p>
                
                <div class="flex flex-wrap gap-2 mb-8">
                    ${createFilterPills(filterOptions, appState.activeFilter)}
                </div>
                
                <div class="tools-grid">
                    ${filteredTools.map(tool => 
                        createToolCard(tool, appState.favorites.includes(tool.id))
                    ).join('')}
                </div>
                
                ${filteredTools.length === 0 ? `
                    <div class="text-center py-12">
                        <i data-lucide="search" class="h-16 w-16 text-textSecondary mx-auto mb-4"></i>
                        <h3 class="text-xl font-semibold text-textPrimary mb-2">No tools found</h3>
                        <p class="text-textSecondary">Try adjusting your filter or add some tools to favorites.</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Add stagger animation to tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    staggerAnimation(toolCards, 100);
}