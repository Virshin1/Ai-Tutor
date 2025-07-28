// Documents page implementation

/**
 * Load documents page
 */
async function loadDocuments() {
    const mainContent = document.getElementById('main-content');
    
    try {
        // Fetch documents from API
        appState.documents = await documentAPI.getAll();
        
        mainContent.innerHTML = `
            <div class="min-h-screen w-full bg-background">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-extrabold text-textPrimary mb-2">My Documents</h1>
                        <p class="text-textSecondary">Manage your saved teaching materials</p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div class="relative w-full md:w-80">
                            <input type="text" id="search-input" placeholder="Search by title or type..."
                                   class="w-full bg-card text-textPrimary border border-[#353945] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200 placeholder:text-textSecondary shadow">
                        </div>
                    </div>
                    
                    <div class="bg-card rounded-2xl overflow-hidden shadow-2xl border border-[#23262F]">
                        <div class="px-6 py-4 bg-[#23262F] border-b border-[#353945]">
                            <h2 class="text-lg font-semibold text-textPrimary">Saved Documents</h2>
                        </div>
                        
                        <div id="documents-list">
                            ${appState.documents.length === 0 ? `
                                <div class="flex flex-col items-center justify-center p-12 text-textSecondary">
                                    <i data-lucide="file-text" class="h-16 w-16 mb-4 text-[#353945]"></i>
                                    <div class="text-xl font-semibold mb-2">No documents found</div>
                                    <div class="text-textSecondary">Try generating or saving a new document!</div>
                                </div>
                            ` : `
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#23262F]">
                                    ${appState.documents.map((doc, idx) => createDocumentCard(doc)).join('')}
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Document Preview Modal -->
            <div id="document-modal" class="modal-overlay hidden">
                <div class="bg-card rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in border border-[#23262F]">
                    <button onclick="closeModal('document-modal')" 
                            class="absolute top-4 right-4 text-textSecondary hover:text-accentBlue">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                    <div id="document-modal-content">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            </div>
            
            <!-- Delete Confirmation Modal -->
            <div id="delete-modal" class="modal-overlay hidden">
                <div class="bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in border border-[#23262F]">
                    <button onclick="closeModal('delete-modal')" 
                            class="absolute top-4 right-4 text-textSecondary hover:text-accentBlue">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                    <div class="flex flex-col items-center gap-4">
                        <i data-lucide="trash-2" class="h-12 w-12 text-red-400 mb-2"></i>
                        <div class="text-xl font-bold text-textPrimary mb-2 text-center">Delete this document?</div>
                        <div class="text-textSecondary mb-4 text-center">This action cannot be undone.</div>
                        <div class="flex gap-4">
                            <button onclick="closeModal('delete-modal')"
                                    class="px-5 py-2 rounded-xl bg-background text-textPrimary hover:bg-[#23262F] transition border border-[#353945]">
                                Cancel
                            </button>
                            <button onclick="confirmDelete()"
                                    class="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-bold shadow">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', debounce(filterDocuments, 300));
        
    } catch (error) {
        console.error('Error loading documents:', error);
        mainContent.innerHTML = `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <div class="text-red-400 text-xl mb-4">Error loading documents</div>
                    <button onclick="loadDocuments()" class="btn-primary">Retry</button>
                </div>
            </div>
        `;
    }
}

/**
 * Filter documents based on search input
 */
function filterDocuments() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredDocs = appState.documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm) ||
        (doc.type || '').toLowerCase().includes(searchTerm)
    );
    
    const documentsList = document.getElementById('documents-list');
    if (filteredDocs.length === 0) {
        documentsList.innerHTML = `
            <div class="flex flex-col items-center justify-center p-12 text-textSecondary">
                <i data-lucide="search" class="h-16 w-16 mb-4 text-[#353945]"></i>
                <div class="text-xl font-semibold mb-2">No documents found</div>
                <div class="text-textSecondary">Try adjusting your search terms.</div>
            </div>
        `;
    } else {
        documentsList.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#23262F]">
                ${filteredDocs.map(doc => createDocumentCard(doc)).join('')}
            </div>
        `;
    }
    
    initLucideIcons();
}

/**
 * View document in modal
 * @param {string} docId - Document ID
 */
function viewDocument(docId) {
    const doc = appState.documents.find(d => d._id === docId);
    if (!doc) return;
    
    const typeMeta = {
        'Lesson Plan': { icon: 'file-text', color: 'bg-accentYellow', label: 'Lesson Plan' },
        'Rubric': { icon: 'clipboard-list', color: 'bg-accentBlue', label: 'Rubric' },
        'IEP': { icon: 'users', color: 'bg-accentPurple', label: 'IEP' },
        'Exit Ticket': { icon: 'check-circle', color: 'bg-accentGreen', label: 'Exit Ticket' },
        'Report Comment': { icon: 'message-square', color: 'bg-accentPink', label: 'Report Comment' },
        'Assignment': { icon: 'book-open', color: 'bg-accentOrange', label: 'Assignment' },
        'Directions': { icon: 'list', color: 'bg-accentBlue', label: 'Directions' },
        'Document': { icon: 'file-text', color: 'bg-accentYellow', label: 'Document' }
    };
    
    const meta = typeMeta[doc.type || 'Document'] || typeMeta['Document'];
    
    const modalContent = document.getElementById('document-modal-content');
    modalContent.innerHTML = `
        <div class="flex items-center gap-3 mb-4">
            <div class="rounded-xl ${meta.color} p-2 shadow-lg">
                <i data-lucide="${meta.icon}" class="h-6 w-6 text-background"></i>
            </div>
            <div>
                <h2 class="text-xl font-bold text-textPrimary mb-1">${doc.title}</h2>
                <div class="flex items-center space-x-4 text-sm text-textSecondary">
                    <span>${meta.label}</span>
                    <span class="flex items-center">
                        <i data-lucide="calendar" class="h-3 w-3 mr-1"></i>
                        ${formatDate(doc.createdAt)}
                    </span>
                    <span>${(doc.content.length / 1024).toFixed(1)} KB</span>
                </div>
            </div>
        </div>
        <div class="max-h-[50vh] overflow-y-auto bg-background rounded-xl p-4 text-textPrimary whitespace-pre-wrap border border-[#353945]">
            ${doc.content}
        </div>
    `;
    
    openModal('document-modal');
    initLucideIcons();
}

/**
 * Download document as PDF
 * @param {string} docId - Document ID
 */
async function downloadDocument(docId) {
    const doc = appState.documents.find(d => d._id === docId);
    if (!doc) return;
    
    try {
        showLoading();
        
        const response = await documentAPI.exportPDF({
            content: doc.content,
            toolName: doc.title,
            formData: doc.formData,
            type: doc.type || 'document'
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showToast('Downloaded PDF!');
        } else {
            throw new Error('Failed to download PDF');
        }
    } catch (error) {
        console.error('Error downloading document:', error);
        showToast('Failed to download PDF.');
    } finally {
        hideLoading();
    }
}

/**
 * Delete document
 * @param {string} docId - Document ID
 */
function deleteDocument(docId) {
    appState.documentToDelete = docId;
    openModal('delete-modal');
}

/**
 * Confirm document deletion
 */
async function confirmDelete() {
    if (!appState.documentToDelete) return;
    
    try {
        await documentAPI.delete(appState.documentToDelete);
        
        // Remove from local state
        appState.documents = appState.documents.filter(doc => doc._id !== appState.documentToDelete);
        
        // Refresh the documents list
        filterDocuments();
        
        closeModal('delete-modal');
        showToast('Document deleted!');
        
    } catch (error) {
        console.error('Error deleting document:', error);
        showToast('Failed to delete document.');
    }
    
    appState.documentToDelete = null;
}