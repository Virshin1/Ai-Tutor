// Output viewer page implementation

/**
 * Load output viewer page
 * @param {Object} data - Output data
 */
async function loadOutput(data) {
    const { toolId, content, toolName, formData } = data;
    const mainContent = document.getElementById('main-content');
    
    // Tool icon and color mapping
    const toolIcons = {
        'lesson-plan': { icon: 'file-text', color: 'bg-accentYellow' },
        'rubric': { icon: 'clipboard-list', color: 'bg-accentBlue' },
        'iep': { icon: 'users', color: 'bg-accentPurple' },
        'exit-ticket': { icon: 'check-circle', color: 'bg-accentGreen' },
        'report-comment': { icon: 'message-square', color: 'bg-accentPink' },
        'assignments': { icon: 'book-open', color: 'bg-accentYellow' },
        'directions': { icon: 'list', color: 'bg-accentBlue' }
    };
    
    const { icon, color } = toolIcons[toolId] || { icon: 'file-text', color: 'bg-accentYellow' };
    
    mainContent.innerHTML = `
        <div class="min-h-screen bg-background text-textPrimary flex items-center justify-center py-8">
            <div class="w-full max-w-4xl mx-auto animate-fade-in">
                <!-- Header -->
                <div class="flex flex-col items-center mb-8">
                    <div class="rounded-full ${color} p-4 flex items-center justify-center mb-2">
                        <i data-lucide="${icon}" class="h-9 w-9 text-background"></i>
                    </div>
                    <h1 class="text-2xl font-extrabold mb-1 text-center">${toolName || 'Generated Content'}</h1>
                    <p class="text-textSecondary text-center mb-4">Your AI-generated content is ready!</p>
                    <div class="w-full border-b border-[#353945] mb-4"></div>
                </div>
                
                <!-- Action Bar -->
                <div class="flex flex-wrap justify-center gap-4 mb-8">
                    <button onclick="copyContent()" 
                            class="flex items-center gap-2 px-5 py-2 rounded-full bg-card text-textSecondary hover:bg-[#181A20] hover:text-accentBlue font-semibold shadow transition-all duration-200"
                            title="Copy to clipboard">
                        <i data-lucide="copy" class="h-5 w-5"></i>
                        Copy
                    </button>
                    <button onclick="saveContent()" 
                            class="flex items-center gap-2 px-5 py-2 rounded-full bg-accentBlue text-background hover:bg-[#181A20] hover:text-accentBlue font-semibold shadow transition-all duration-200"
                            title="Save to documents">
                        <i data-lucide="save" class="h-5 w-5"></i>
                        Save
                    </button>
                    <button onclick="exportPDF()" 
                            class="flex items-center gap-2 px-5 py-2 rounded-full bg-accentGreen text-background hover:bg-[#181A20] hover:text-white font-semibold shadow transition-all duration-200"
                            title="Export to PDF">
                        <i data-lucide="download" class="h-5 w-5"></i>
                        Export PDF
                    </button>
                </div>
                
                <!-- Generated Content Card -->
                <div class="bg-card rounded-2xl p-10 shadow-xl border border-[#353945] mb-8">
                    <div class="prose prose-invert prose-lg text-textPrimary max-w-none space-y-6" style="line-height: 1.7">
                        <div id="generated-content">${formatContent(content)}</div>
                    </div>
                </div>
                
                <!-- Form Data Summary -->
                ${formData ? `
                    <div class="bg-card rounded-xl p-6 mb-8 shadow border border-[#353945]">
                        <h2 class="text-lg font-bold text-accentBlue mb-4">Generation Parameters</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${Object.entries(formData).map(([key, value]) => `
                                <div class="bg-background rounded-lg p-3">
                                    <div class="text-xs text-textSecondary capitalize mb-1">
                                        ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </div>
                                    <div class="text-white text-sm">
                                        ${typeof value === 'string' && value.length > 50 
                                            ? `${value.substring(0, 50)}...` 
                                            : String(value)
                                        }
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Action Bar at Bottom -->
                <div class="mt-8 flex justify-center space-x-4">
                    <button onclick="navigateToTool('${toolId}')" 
                            class="px-6 py-3 bg-card text-textPrimary rounded-xl hover:bg-[#181A20] hover:text-accentBlue font-semibold shadow transition-all duration-200">
                        Generate Another
                    </button>
                    <button onclick="navigateTo('documents')" 
                            class="px-6 py-3 bg-accentBlue text-background rounded-xl hover:bg-accentYellow hover:text-background font-semibold shadow transition-all duration-200">
                        View My Documents
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Store current content for actions
    appState.generatedContent = content;
    appState.currentToolName = toolName;
    appState.currentFormData = formData;
    appState.currentToolId = toolId;
}

/**
 * Format content for display (basic markdown-like formatting)
 * @param {string} content - Content to format
 * @returns {string} Formatted HTML
 */
function formatContent(content) {
    if (!content) return '';
    
    // Basic markdown-like formatting
    let formatted = content
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-accentBlue mb-3 mt-6">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-accentYellow mb-4 mt-8">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-textPrimary mb-6 mt-10">$1</h1>')
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-accentBlue">$1</strong>')
        // Lists
        .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-2">• $1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-2 list-decimal">$1</li>')
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    formatted = '<p class="mb-4">' + formatted + '</p>';
    
    // Clean up empty paragraphs
    formatted = formatted.replace(/<p class="mb-4"><\/p>/g, '');
    
    return formatted;
}

/**
 * Copy content to clipboard
 */
async function copyContent() {
    if (appState.generatedContent) {
        await copyToClipboard(appState.generatedContent);
    }
}

/**
 * Save content to documents
 */
async function saveContent() {
    if (!appState.generatedContent || !appState.currentToolName) return;
    
    try {
        showLoading();
        
        await documentAPI.save({
            title: appState.currentToolName,
            content: appState.generatedContent,
            type: appState.currentToolId,
            formData: appState.currentFormData
        });
        
        showToast('Saved to documents!');
        
    } catch (error) {
        console.error('Error saving document:', error);
        showToast('Failed to save. Try again.');
    } finally {
        hideLoading();
    }
}

/**
 * Export content as PDF
 */
async function exportPDF() {
    if (!appState.generatedContent || !appState.currentToolName) return;
    
    try {
        showLoading();
        
        const response = await documentAPI.exportPDF({
            content: appState.generatedContent,
            toolName: appState.currentToolName,
            formData: appState.currentFormData,
            type: appState.currentToolId
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${appState.currentToolName}-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showToast('Exported as PDF!');
        } else {
            throw new Error('Failed to export PDF');
        }
        
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showToast('Failed to export PDF.');
    } finally {
        hideLoading();
    }
}