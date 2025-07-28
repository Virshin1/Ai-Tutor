// Tool pages implementation

/**
 * Load tool page
 * @param {string} toolId - Tool ID
 */
async function loadTool(toolId) {
    const tool = getToolById(toolId);
    if (!tool) {
        document.getElementById('main-content').innerHTML = '<div class="p-8 text-center">Tool not found</div>';
        return;
    }
    
    const mainContent = document.getElementById('main-content');
    
    switch (toolId) {
        case 'lesson-plan':
            loadLessonPlanTool();
            break;
        case 'rubric':
            loadRubricTool();
            break;
        case 'iep':
            loadIEPTool();
            break;
        case 'exit-ticket':
            loadExitTicketTool();
            break;
        case 'report-comment':
            loadReportCommentTool();
            break;
        case 'assignments':
            loadAssignmentsTool();
            break;
        case 'directions':
            loadDirectionsTool();
            break;
        default:
            mainContent.innerHTML = '<div class="p-8 text-center">Tool not implemented</div>';
    }
}

/**
 * Load lesson plan tool
 */
function loadLessonPlanTool() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="min-h-screen bg-background text-textPrimary flex items-center justify-center py-8">
            <div class="w-full max-w-3xl bg-gradient-to-br from-[#23262F] via-[#23262F] to-[#181A20] rounded-3xl shadow-2xl p-10 mx-auto animate-fade-in">
                <div class="flex flex-col items-center mb-6">
                    <div class="rounded-full bg-accentYellow p-4 flex items-center justify-center mb-2">
                        <i data-lucide="file-text" class="h-10 w-10 text-background"></i>
                    </div>
                    <h1 class="text-3xl font-extrabold mb-1 text-center">Lesson Plan Generator</h1>
                    <p class="text-textSecondary text-center mb-4">Create structured lesson plans based on topic, grade level, and subject</p>
                    <div class="w-full border-b border-[#353945] mb-4"></div>
                </div>
                
                <form id="lesson-plan-form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="col-span-1 md:col-span-2 mb-2">
                        <h2 class="text-lg font-bold text-accentYellow mb-2">Lesson Details</h2>
                    </div>
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Subject</label>
                        <select name="subject" class="form-input w-full focus:ring-accentYellow focus:border-accentYellow" required>
                            <option value="">Select subject</option>
                            <option value="Math">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English Language Arts</option>
                            <option value="History">History</option>
                            <option value="Art">Art</option>
                        </select>
                        <p class="text-xs text-textSecondary mt-1">Choose the main subject for your lesson.</p>
                    </div>
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Topic</label>
                        <input type="text" name="topic" class="form-input w-full focus:ring-accentYellow focus:border-accentYellow" 
                               placeholder="e.g., Fractions, Photosynthesis, Poetry" required>
                        <p class="text-xs text-textSecondary mt-1">What is the specific topic for this lesson?</p>
                    </div>
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Grade Level</label>
                        <select name="gradeLevel" class="form-input w-full focus:ring-accentYellow focus:border-accentYellow" required>
                            <option value="">Select grade level</option>
                            <option value="K">Kindergarten</option>
                            <option value="1">Grade 1</option>
                            <option value="2">Grade 2</option>
                            <option value="3">Grade 3</option>
                            <option value="4">Grade 4</option>
                            <option value="5">Grade 5</option>
                            <option value="6">Grade 6</option>
                            <option value="7">Grade 7</option>
                            <option value="8">Grade 8</option>
                            <option value="9">Grade 9</option>
                            <option value="10">Grade 10</option>
                            <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                        </select>
                        <p class="text-xs text-textSecondary mt-1">Select the grade level for your students.</p>
                    </div>
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Duration</label>
                        <select name="duration" class="form-input w-full focus:ring-accentYellow focus:border-accentYellow" required>
                            <option value="">Select duration</option>
                            <option value="30 minutes">30 minutes</option>
                            <option value="45 minutes">45 minutes</option>
                            <option value="60 minutes">60 minutes</option>
                            <option value="90 minutes">90 minutes</option>
                        </select>
                        <p class="text-xs text-textSecondary mt-1">How long will the lesson last?</p>
                    </div>
                    
                    <div class="col-span-1 md:col-span-2 mb-2">
                        <h2 class="text-lg font-bold text-accentYellow mb-2 mt-2">Objectives & Materials</h2>
                    </div>
                    
                    <div class="col-span-1 md:col-span-2">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Learning Objectives</label>
                        <textarea name="objectives" class="form-input w-full focus:ring-accentYellow focus:border-accentYellow" 
                                  rows="3" placeholder="What should students learn or be able to do?" required></textarea>
                        <p class="text-xs text-textSecondary mt-1">Describe the main learning goals for this lesson.</p>
                    </div>
                    
                    <div class="col-span-1 md:col-span-2">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Materials Needed</label>
                        <textarea name="materials" class="form-input w-full focus:ring-accentYellow focus:border-accentYellow" 
                                  rows="2" placeholder="List required materials and resources"></textarea>
                        <p class="text-xs text-textSecondary mt-1">List all materials, handouts, or resources needed.</p>
                    </div>
                    
                    <div class="col-span-1 md:col-span-2">
                        <button type="submit" class="w-full bg-accentYellow text-background py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:bg-accentBlue hover:text-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-accentYellow/40">
                            <i data-lucide="sparkles" class="h-5 w-5"></i>
                            <span>Generate Lesson Plan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add form submission handler
    document.getElementById('lesson-plan-form').addEventListener('submit', handleLessonPlanSubmit);
}

/**
 * Handle lesson plan form submission
 * @param {Event} e - Form submit event
 */
async function handleLessonPlanSubmit(e) {
    e.preventDefault();
    
    const formData = getFormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    try {
        // Update button to loading state
        submitButton.innerHTML = `
            <i data-lucide="sparkles" class="h-5 w-5 animate-spin"></i>
            <span>Generating...</span>
        `;
        submitButton.disabled = true;
        
        const response = await aiAPI.generateLessonPlan(formData);
        
        if (response.result) {
            navigateToOutput('lesson-plan', {
                content: response.result,
                toolName: 'Lesson Plan Generator',
                formData: formData
            });
        } else {
            throw new Error('No result received');
        }
        
    } catch (error) {
        console.error('Error generating lesson plan:', error);
        navigateToOutput('lesson-plan', {
            content: 'Failed to generate lesson plan. Please try again.',
            toolName: 'Lesson Plan Generator',
            formData: formData
        });
    } finally {
        // Reset button
        submitButton.innerHTML = `
            <i data-lucide="sparkles" class="h-5 w-5"></i>
            <span>Generate Lesson Plan</span>
        `;
        submitButton.disabled = false;
        initLucideIcons();
    }
}

// Similar implementations for other tools would follow the same pattern
// For brevity, I'll include one more example - the rubric tool

/**
 * Load rubric tool
 */
function loadRubricTool() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="min-h-screen bg-background text-textPrimary flex items-center justify-center py-8">
            <div class="w-full max-w-3xl bg-gradient-to-br from-[#23262F] via-[#23262F] to-[#181A20] rounded-3xl shadow-2xl p-10 mx-auto animate-fade-in">
                <div class="flex flex-col items-center mb-6">
                    <div class="rounded-full bg-accentBlue p-4 flex items-center justify-center mb-2">
                        <i data-lucide="clipboard-list" class="h-10 w-10 text-background"></i>
                    </div>
                    <h1 class="text-3xl font-extrabold mb-1 text-center">Rubric Generator</h1>
                    <p class="text-textSecondary text-center mb-4">Generate custom grading rubrics with criteria and scoring scale</p>
                    <div class="w-full border-b border-[#353945] mb-4"></div>
                </div>
                
                <form id="rubric-form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="col-span-1 md:col-span-2 mb-2">
                        <h2 class="text-lg font-bold text-accentBlue mb-2">Rubric Details</h2>
                    </div>
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Assignment Type</label>
                        <input type="text" name="assignment" class="form-input w-full focus:ring-accentBlue focus:border-accentBlue" 
                               placeholder="e.g., Essay, Lab Report, Presentation" required>
                        <p class="text-xs text-textSecondary mt-1">What type of assignment is this rubric for?</p>
                    </div>
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Subject</label>
                        <select name="subject" class="form-input w-full focus:ring-accentBlue focus:border-accentBlue" required>
                            <option value="">Select subject</option>
                            <option value="Math">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English Language Arts</option>
                            <option value="History">History</option>
                            <option value="Art">Art</option>
                        </select>
                        <p class="text-xs text-textSecondary mt-1">Choose the subject for this rubric.</p>
                    </div>
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Grade Level</label>
                        <select name="gradeLevel" class="form-input w-full focus:ring-accentBlue focus:border-accentBlue" required>
                            <option value="">Select grade level</option>
                            <option value="Elementary">Elementary (K-5)</option>
                            <option value="Middle School">Middle School (6-8)</option>
                            <option value="High School">High School (9-12)</option>
                        </select>
                        <p class="text-xs text-textSecondary mt-1">Select the grade level for your students.</p>
                    </div>
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Performance Levels</label>
                        <select name="levels" class="form-input w-full focus:ring-accentBlue focus:border-accentBlue" required>
                            <option value="3">3 Levels</option>
                            <option value="4" selected>4 Levels</option>
                            <option value="5">5 Levels</option>
                        </select>
                        <p class="text-xs text-textSecondary mt-1">How many performance levels should the rubric have?</p>
                    </div>
                    
                    <div class="col-span-1 md:col-span-2 mb-2">
                        <h2 class="text-lg font-bold text-accentBlue mb-2 mt-2">Criteria</h2>
                    </div>
                    
                    <div class="col-span-1 md:col-span-2">
                        <label class="block text-sm font-medium text-textSecondary mb-1">Evaluation Criteria</label>
                        <textarea name="criteria" class="form-input w-full focus:ring-accentBlue focus:border-accentBlue" 
                                  rows="4" placeholder="Enter each criterion on a new line:&#10;Content Knowledge&#10;Organization&#10;Grammar and Mechanics&#10;Creativity" required></textarea>
                        <p class="text-xs text-textSecondary mt-1">List each criterion on a new line.</p>
                    </div>
                    
                    <div class="col-span-1 md:col-span-2">
                        <button type="submit" class="w-full bg-accentBlue text-background py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:bg-accentYellow hover:text-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-accentBlue/40">
                            <i data-lucide="sparkles" class="h-5 w-5"></i>
                            <span>Generate Rubric</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add form submission handler
    document.getElementById('rubric-form').addEventListener('submit', handleRubricSubmit);
}

/**
 * Handle rubric form submission
 * @param {Event} e - Form submit event
 */
async function handleRubricSubmit(e) {
    e.preventDefault();
    
    const formData = getFormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    try {
        // Update button to loading state
        submitButton.innerHTML = `
            <i data-lucide="sparkles" class="h-5 w-5 animate-spin"></i>
            <span>Generating...</span>
        `;
        submitButton.disabled = true;
        
        const response = await aiAPI.generateRubric(formData);
        
        if (response.result) {
            navigateToOutput('rubric', {
                content: response.result,
                toolName: 'Rubric Generator',
                formData: formData
            });
        } else {
            throw new Error('No result received');
        }
        
    } catch (error) {
        console.error('Error generating rubric:', error);
        navigateToOutput('rubric', {
            content: 'Failed to generate rubric. Please try again.',
            toolName: 'Rubric Generator',
            formData: formData
        });
    } finally {
        // Reset button
        submitButton.innerHTML = `
            <i data-lucide="sparkles" class="h-5 w-5"></i>
            <span>Generate Rubric</span>
        `;
        submitButton.disabled = false;
        initLucideIcons();
    }
}

// Additional tool implementations would follow similar patterns
// Each tool would have its own load function and form handler