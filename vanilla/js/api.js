// API functions for communicating with the backend

const API_BASE_URL = '/api';

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} API response
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * AI Generation APIs
 */
const aiAPI = {
    generateLessonPlan: (formData) => 
        apiRequest('/ai/lesson-plan', {
            method: 'POST',
            body: JSON.stringify(formData)
        }),
    
    generateRubric: (formData) => 
        apiRequest('/ai/rubric', {
            method: 'POST',
            body: JSON.stringify(formData)
        }),
    
    generateIEP: (formData) => 
        apiRequest('/ai/iep', {
            method: 'POST',
            body: JSON.stringify(formData)
        }),
    
    generateExitTicket: (formData) => 
        apiRequest('/ai/exit-ticket', {
            method: 'POST',
            body: JSON.stringify(formData)
        }),
    
    generateReportComment: (formData) => 
        apiRequest('/ai/report-comment', {
            method: 'POST',
            body: JSON.stringify(formData)
        }),
    
    generateAssignments: (formData) => 
        apiRequest('/ai/assignments', {
            method: 'POST',
            body: JSON.stringify(formData)
        }),
    
    generateDirections: (formData) => 
        apiRequest('/ai/directions', {
            method: 'POST',
            body: JSON.stringify(formData)
        })
};

/**
 * Document APIs
 */
const documentAPI = {
    save: (documentData) => 
        apiRequest('/documents', {
            method: 'POST',
            body: JSON.stringify(documentData)
        }),
    
    getAll: () => 
        apiRequest('/documents'),
    
    delete: (id) => 
        apiRequest(`/documents/${id}`, {
            method: 'DELETE'
        }),
    
    exportPDF: (data) => 
        fetch(`${API_BASE_URL}/export/pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
};

/**
 * Dashboard APIs
 */
const dashboardAPI = {
    getSummary: () => 
        apiRequest('/dashboard/summary'),
    
    getLessonPlans: () => 
        apiRequest('/dashboard/lesson-plans'),
    
    getRubrics: () => 
        apiRequest('/dashboard/rubrics'),
    
    getIEPs: () => 
        apiRequest('/dashboard/ieps'),
    
    getExitTickets: () => 
        apiRequest('/dashboard/exit-tickets'),
    
    getReportComments: () => 
        apiRequest('/dashboard/report-comments'),
    
    getAssignments: () => 
        apiRequest('/dashboard/assignments'),
    
    getDirections: () => 
        apiRequest('/dashboard/directions')
};

/**
 * Analytics APIs
 */
const analyticsAPI = {
    getStats: () => 
        apiRequest('/analytics')
};

/**
 * Student Management APIs
 */
const studentAPI = {
    getAll: () => 
        apiRequest('/students'),
    
    create: (studentData) => 
        apiRequest('/students', {
            method: 'POST',
            body: JSON.stringify(studentData)
        }),
    
    update: (id, studentData) => 
        apiRequest(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(studentData)
        }),
    
    delete: (id) => 
        apiRequest(`/students/${id}`, {
            method: 'DELETE'
        })
};

/**
 * Google Classroom APIs
 */
const googleClassroomAPI = {
    getCourses: (accessToken) => 
        apiRequest(`/google-classroom/courses?accessToken=${accessToken}`),
    
    getStudents: (courseId, accessToken) => 
        apiRequest(`/google-classroom/courses/${courseId}/students?accessToken=${accessToken}`),
    
    sync: (data) => 
        apiRequest('/google-classroom/sync', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    createAssignment: (data) => 
        apiRequest('/google-classroom/create-assignment', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    createMaterial: (data) => 
        apiRequest('/google-classroom/create-material', {
            method: 'POST',
            body: JSON.stringify(data)
        })
};