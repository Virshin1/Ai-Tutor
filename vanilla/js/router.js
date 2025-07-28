// Router for handling navigation in the vanilla implementation

// Application state
const appState = {
    currentPage: 'dashboard',
    favorites: storage.get('favorites') || [],
    activeFilter: 'all',
    documents: [],
    generatedContent: null,
    formData: null
};

/**
 * Navigate to a specific page
 * @param {string} page - Page to navigate to
 * @param {Object} data - Optional data to pass to the page
 */
function navigateTo(page, data = {}) {
    appState.currentPage = page;
    
    // Update navigation active state
    updateNavigation();
    
    // Load page content
    loadPage(page, data);
    
    // Update URL without page reload
    history.pushState({ page, data }, '', `#${page}`);
}

/**
 * Navigate to a specific tool
 * @param {string} toolId - Tool ID
 */
function navigateToTool(toolId) {
    navigateTo('tool', { toolId });
}

/**
 * Navigate to output viewer
 * @param {string} toolId - Tool ID
 * @param {Object} data - Generated content data
 */
function navigateToOutput(toolId, data) {
    navigateTo('output', { toolId, ...data });
}

/**
 * Update navigation active states
 */
function updateNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === appState.currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Load page content
 * @param {string} page - Page to load
 * @param {Object} data - Page data
 */
async function loadPage(page, data = {}) {
    const mainContent = document.getElementById('main-content');
    
    try {
        showLoading();
        
        switch (page) {
            case 'dashboard':
                await loadDashboard();
                break;
            case 'documents':
                await loadDocuments();
                break;
            case 'analytics':
                await loadAnalytics();
                break;
            case 'tool':
                await loadTool(data.toolId);
                break;
            case 'output':
                await loadOutput(data);
                break;
            default:
                mainContent.innerHTML = '<div class="p-8 text-center">Page not found</div>';
        }
        
        // Initialize Lucide icons after content load
        initLucideIcons();
        
    } catch (error) {
        console.error('Error loading page:', error);
        mainContent.innerHTML = '<div class="p-8 text-center text-red-400">Error loading page</div>';
    } finally {
        hideLoading();
    }
}

/**
 * Handle browser back/forward buttons
 */
window.addEventListener('popstate', (event) => {
    if (event.state) {
        appState.currentPage = event.state.page;
        loadPage(event.state.page, event.state.data);
        updateNavigation();
    }
});

/**
 * Initialize router on page load
 */
function initRouter() {
    // Get initial page from URL hash
    const hash = window.location.hash.slice(1);
    const initialPage = hash || 'dashboard';
    
    navigateTo(initialPage);
}

/**
 * Tool definitions
 */
const tools = [
    {
        id: 'lesson-plan',
        name: 'Lesson Plan Generator',
        description: 'Create structured lesson plans based on topic, grade level, and subject',
        icon: 'file-text',
        category: 'plan',
        path: '/tools/lesson-plan'
    },
    {
        id: 'rubric',
        name: 'Rubric Generator',
        description: 'Generate custom grading rubrics with criteria and scoring scale',
        icon: 'clipboard-list',
        category: 'create',
        path: '/tools/rubric'
    },
    {
        id: 'iep',
        name: 'IEP Assistant',
        description: 'Draft Individualized Education Plans for students with specific needs',
        icon: 'users',
        category: 'support',
        path: '/tools/iep'
    },
    {
        id: 'exit-ticket',
        name: 'Exit Ticket Generator',
        description: 'Make short end-of-lesson assessments to check understanding',
        icon: 'check-circle',
        category: 'create',
        path: '/tools/exit-ticket'
    },
    {
        id: 'report-comment',
        name: 'Report Comment Generator',
        description: 'Create formal or casual progress report comments for students',
        icon: 'message-square',
        category: 'support',
        path: '/tools/report-comment'
    },
    {
        id: 'assignments',
        name: 'Recommend Assignments',
        description: 'Suggest learning materials or activities based on performance',
        icon: 'book-open',
        category: 'support',
        path: '/tools/assignments'
    },
    {
        id: 'directions',
        name: 'Clear Directions Generator',
        description: 'Generate simple, step-by-step instructions for class activities',
        icon: 'list',
        category: 'create',
        path: '/tools/directions'
    }
];

/**
 * Get tool by ID
 * @param {string} toolId - Tool ID
 * @returns {Object|null} Tool object or null
 */
function getToolById(toolId) {
    return tools.find(tool => tool.id === toolId) || null;
}

/**
 * Filter tools by category
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered tools
 */
function filterTools(category) {
    if (category === 'all') {
        return tools;
    } else if (category === 'favorites') {
        return tools.filter(tool => appState.favorites.includes(tool.id));
    } else {
        return tools.filter(tool => tool.category === category);
    }
}

/**
 * Toggle favorite status of a tool
 * @param {string} toolId - Tool ID
 */
function toggleFavorite(toolId) {
    const index = appState.favorites.indexOf(toolId);
    if (index > -1) {
        appState.favorites.splice(index, 1);
    } else {
        appState.favorites.push(toolId);
    }
    
    // Save to localStorage
    storage.set('favorites', appState.favorites);
    
    // Update UI if on dashboard
    if (appState.currentPage === 'dashboard') {
        loadDashboard();
    }
}

/**
 * Set active filter
 * @param {string} filter - Filter to set as active
 */
function setActiveFilter(filter) {
    appState.activeFilter = filter;
    loadDashboard();
}