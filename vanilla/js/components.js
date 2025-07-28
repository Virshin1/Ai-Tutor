// Component functions for rendering UI elements

/**
 * Tool card component
 * @param {Object} tool - Tool data
 * @param {boolean} isFavorite - Is tool favorited
 * @returns {string} HTML string
 */
function createToolCard(tool, isFavorite = false) {
    const accentColors = [
        "bg-accentYellow",
        "bg-accentBlue", 
        "bg-accentPurple",
        "bg-accentGreen",
        "bg-accentPink",
        "bg-accentOrange"
    ];
    
    const colorIndex = Math.abs(tool.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % accentColors.length;
    const accentColor = accentColors[colorIndex];
    
    return `
        <div class="tool-card bg-card rounded-2xl shadow-lg p-6 flex flex-col items-start gap-4 hover:shadow-2xl transition-shadow border border-slate-800 cursor-pointer relative group"
             onclick="navigateToTool('${tool.id}')" data-tool-id="${tool.id}">
            <button onclick="event.stopPropagation(); toggleFavorite('${tool.id}')" 
                    class="favorite-star absolute top-4 right-4 transition-opacity duration-200 z-10 ${isFavorite ? 'opacity-100 active' : 'opacity-0 group-hover:opacity-100'}"
                    aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                <i data-lucide="star" class="h-6 w-6 ${isFavorite ? 'text-accentYellow fill-current' : 'text-textSecondary'}"></i>
            </button>
            <div class="rounded-full p-3 text-2xl mb-2 ${accentColor}">
                <i data-lucide="${tool.icon}" class="h-8 w-8 text-background"></i>
            </div>
            <h2 class="text-xl font-bold mb-1">${tool.name}</h2>
            <p class="text-textSecondary mb-4">${tool.description}</p>
        </div>
    `;
}

/**
 * Filter pills component
 * @param {Array} filters - Filter options
 * @param {string} activeFilter - Currently active filter
 * @returns {string} HTML string
 */
function createFilterPills(filters, activeFilter) {
    return filters.map(filter => `
        <button onclick="setActiveFilter('${filter.value}')"
                class="px-4 py-2 rounded-full font-semibold transition-colors focus:outline-none ${
                    activeFilter === filter.value 
                        ? 'bg-accentBlue text-background' 
                        : 'text-white bg-card hover:bg-[#181A20] hover:text-accentBlue'
                }">
            ${filter.label}
        </button>
    `).join('');
}

/**
 * Document card component
 * @param {Object} doc - Document data
 * @returns {string} HTML string
 */
function createDocumentCard(doc) {
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
    
    return `
        <div class="group flex items-center gap-4 px-6 py-5 cursor-pointer transition-all hover:bg-[#23262F] relative rounded-none"
             onclick="viewDocument('${doc._id}')">
            <div class="rounded-xl ${meta.color} p-2 flex items-center justify-center shadow-lg">
                <i data-lucide="${meta.icon}" class="h-6 w-6 text-background"></i>
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-textPrimary font-semibold truncate">${doc.title}</h3>
                <div class="flex items-center space-x-4 text-sm text-textSecondary mt-1">
                    <span>${meta.label}</span>
                    <span class="flex items-center">
                        <i data-lucide="calendar" class="h-3 w-3 mr-1"></i>
                        ${formatDate(doc.createdAt)}
                    </span>
                    <span>${(doc.content.length / 1024).toFixed(1)} KB</span>
                </div>
            </div>
            <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="p-2 text-textSecondary hover:text-accentBlue transition-colors"
                        onclick="event.stopPropagation(); downloadDocument('${doc._id}')"
                        title="Download">
                    <i data-lucide="download" class="h-4 w-4"></i>
                </button>
                <button class="p-2 text-textSecondary hover:text-red-400 transition-colors"
                        onclick="event.stopPropagation(); deleteDocument('${doc._id}')"
                        title="Delete">
                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Form input component
 * @param {Object} config - Input configuration
 * @returns {string} HTML string
 */
function createFormInput(config) {
    const { type = 'text', name, label, placeholder, required = false, options = [], rows = 3 } = config;
    
    let input = '';
    
    if (type === 'select') {
        input = `
            <select name="${name}" class="form-input w-full" ${required ? 'required' : ''}>
                <option value="">Select ${label.toLowerCase()}</option>
                ${options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
        `;
    } else if (type === 'textarea') {
        input = `
            <textarea name="${name}" class="form-input w-full" rows="${rows}" 
                      placeholder="${placeholder || ''}" ${required ? 'required' : ''}></textarea>
        `;
    } else {
        input = `
            <input type="${type}" name="${name}" class="form-input w-full" 
                   placeholder="${placeholder || ''}" ${required ? 'required' : ''}>
        `;
    }
    
    return `
        <div class="col-span-1">
            <label class="block text-sm font-medium text-textSecondary mb-1">${label}</label>
            ${input}
        </div>
    `;
}

/**
 * Modal component
 * @param {string} id - Modal ID
 * @param {string} title - Modal title
 * @param {string} content - Modal content
 * @returns {string} HTML string
 */
function createModal(id, title, content) {
    return `
        <div id="${id}" class="modal-overlay hidden">
            <div class="modal-content">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-textPrimary">${title}</h3>
                    <button onclick="closeModal('${id}')" class="text-textSecondary hover:text-accentBlue">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
}

/**
 * Loading button component
 * @param {string} text - Button text
 * @param {string} loadingText - Loading text
 * @param {boolean} isLoading - Loading state
 * @returns {string} HTML string
 */
function createLoadingButton(text, loadingText, isLoading = false) {
    return `
        <button type="submit" class="btn-primary w-full flex items-center justify-center gap-2" 
                ${isLoading ? 'disabled' : ''}>
            ${isLoading ? `
                <i data-lucide="sparkles" class="h-5 w-5 animate-spin"></i>
                <span>${loadingText}</span>
            ` : `
                <i data-lucide="sparkles" class="h-5 w-5"></i>
                <span>${text}</span>
            `}
        </button>
    `;
}

/**
 * Recent activity card component
 * @param {Object} item - Activity item
 * @param {number} index - Item index for animation delay
 * @returns {string} HTML string
 */
function createRecentActivityCard(item, index) {
    const typeColors = {
        'lesson-plan': 'bg-accentYellow',
        'rubric': 'bg-accentBlue',
        'iep': 'bg-accentPurple',
        'exit-ticket': 'bg-accentGreen',
        'report-comment': 'bg-accentPink',
        'assignment': 'bg-accentYellow',
        'direction': 'bg-accentBlue'
    };
    
    const typeIcons = {
        'lesson-plan': 'file-text',
        'rubric': 'clipboard-list',
        'iep': 'users',
        'exit-ticket': 'check-circle',
        'report-comment': 'message-square',
        'assignment': 'book-open',
        'direction': 'list'
    };
    
    const color = typeColors[item.type] || 'bg-accentYellow';
    const icon = typeIcons[item.type] || 'file-text';
    const title = item.title || item.topic || item.activity || item.studentName || 'Untitled';
    
    return `
        <div class="min-w-[260px] bg-card rounded-2xl border border-[#353945] shadow p-4 flex flex-col gap-2 animate-fade-in"
             style="animation-delay: ${index * 60}ms">
            <div class="flex items-center gap-2 mb-1">
                <div class="w-2 h-8 rounded-xl mr-2 ${color}"></div>
                <i data-lucide="${icon}" class="h-5 w-5 text-textSecondary"></i>
                <span class="font-semibold text-textPrimary ml-1">${title}</span>
            </div>
            <div class="text-xs text-textSecondary mb-1">
                ${item.subject ? `${item.subject} • ` : ''}
                ${item.gradeLevel ? `${item.gradeLevel} • ` : ''}
                ${formatDate(item.createdAt)}
            </div>
            <span class="text-xs font-bold px-2 py-1 rounded-full capitalize bg-background border border-[#353945] text-accentYellow w-fit">
                ${item.type.replace('-', ' ')}
            </span>
        </div>
    `;
}