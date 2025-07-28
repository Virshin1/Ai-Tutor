// Main application initialization

/**
 * Initialize the application
 */
function initApp() {
    console.log('Initializing AI Tutor Tools vanilla app...');
    
    // Initialize Lucide icons
    initLucideIcons();
    
    // Initialize router
    initRouter();
    
    // Load favorites from localStorage
    appState.favorites = storage.get('favorites') || [];
    
    // Add global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        showToast('An error occurred. Please try again.');
    });
    
    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        showToast('An error occurred. Please try again.');
    });
    
    console.log('App initialized successfully');
}

/**
 * Check if backend is available
 */
async function checkBackendConnection() {
    try {
        const response = await fetch('/api/sample');
        const data = await response.json();
        
        if (data.message) {
            console.log('Backend connected:', data.message);
            
            // Show backend status in header if available
            const header = document.querySelector('header');
            if (header && data.message !== 'Sample API route working!') {
                const statusDiv = document.createElement('div');
                statusDiv.className = 'bg-green-900 text-green-200 px-4 py-2 text-center text-sm';
                statusDiv.textContent = `Backend: ${data.message}`;
                header.insertBefore(statusDiv, header.firstChild);
            }
        }
    } catch (error) {
        console.warn('Backend not available:', error);
        
        // Show offline status
        const header = document.querySelector('header');
        if (header) {
            const statusDiv = document.createElement('div');
            statusDiv.className = 'bg-yellow-900 text-yellow-200 px-4 py-2 text-center text-sm';
            statusDiv.textContent = 'Working in offline mode - some features may be limited';
            header.insertBefore(statusDiv, header.firstChild);
        }
    }
}

/**
 * Handle service worker registration for offline support
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    checkBackendConnection();
    // registerServiceWorker(); // Uncomment if you want offline support
});

// Re-initialize icons when content changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if any added nodes contain lucide icons
            const hasLucideIcons = Array.from(mutation.addedNodes).some(node => {
                return node.nodeType === 1 && (
                    node.querySelector && node.querySelector('[data-lucide]') ||
                    node.hasAttribute && node.hasAttribute('data-lucide')
                );
            });
            
            if (hasLucideIcons) {
                // Debounce icon initialization
                clearTimeout(window.lucideTimeout);
                window.lucideTimeout = setTimeout(initLucideIcons, 100);
            }
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Export global functions for use in HTML
window.navigateTo = navigateTo;
window.navigateToTool = navigateToTool;
window.toggleFavorite = toggleFavorite;
window.setActiveFilter = setActiveFilter;
window.viewDocument = viewDocument;
window.downloadDocument = downloadDocument;
window.deleteDocument = deleteDocument;
window.confirmDelete = confirmDelete;
window.copyContent = copyContent;
window.saveContent = saveContent;
window.exportPDF = exportPDF;
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.loadDashboard = loadDashboard;
window.loadDocuments = loadDocuments;
window.loadAnalytics = loadAnalytics;