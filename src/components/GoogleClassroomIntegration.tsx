import React, { useState, useEffect } from 'react';

interface GoogleCourse {
  id: string;
  name: string;
  section: string;
  descriptionHeading: string;
  state: string;
}

interface GoogleStudent {
  userId: string;
  profile: {
    id: string;
    name: {
      fullName: string;
      givenName: string;
      familyName: string;
    };
    emailAddress: string;
  };
}

interface GoogleClassroomIntegrationProps {
  content?: any;
  contentType?: 'assignment' | 'material' | 'announcement';
  onSync?: (result: any) => void;
}

const GoogleClassroomIntegration: React.FC<GoogleClassroomIntegrationProps> = ({
  content,
  contentType = 'assignment',
  onSync
}) => {
  console.log('GoogleClassroomIntegration component rendered');
  console.log('Content:', content);
  console.log('Content type:', contentType);
  const [accessToken, setAccessToken] = useState<string>('');
  const [courses, setCourses] = useState<GoogleCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [students, setStudents] = useState<GoogleStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '465351158411-gsa7p18m8o51is1eka79mbghsc855tpp.apps.googleusercontent.com';
  const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback';

  const handleGoogleAuth = () => {
    console.log('Google Auth button clicked');
    console.log('Client ID:', GOOGLE_CLIENT_ID);
    console.log('Redirect URI:', GOOGLE_REDIRECT_URI);
    
    // Save current page for redirect after auth
    localStorage.setItem('google_auth_previous_page', window.location.pathname);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent('https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/drive')}`;

    console.log('Auth URL:', authUrl);
    window.location.href = authUrl;
  };

  // Check for existing token on component mount and load courses
  useEffect(() => {
    const storedToken = localStorage.getItem('google_access_token');
    if (storedToken) {
      setAccessToken(storedToken);
      // Automatically load courses when we have a token
      const loadCourses = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`/api/google-classroom/courses?accessToken=${storedToken}`);
          if (!response.ok) {
            throw new Error('Failed to fetch courses');
          }
          
          const coursesData = await response.json();
          setCourses(coursesData);
          console.log('Courses loaded:', coursesData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch courses');
          console.error('Error loading courses:', err);
        } finally {
          setLoading(false);
        }
      };
      
      loadCourses();
    }
  }, []);

  const fetchCoursesWithToken = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/google-classroom/courses?accessToken=${token}`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const coursesData = await response.json();
      setCourses(coursesData);
      console.log('Courses loaded:', coursesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    if (!accessToken) return;
    await fetchCoursesWithToken(accessToken);
  };

  const fetchStudents = async (courseId: string) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/google-classroom/courses/${courseId}/students?accessToken=${accessToken}`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const studentsData = await response.json();
      setStudents(studentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    fetchStudents(courseId);
  };

  const handleSyncToClassroom = async () => {
    if (!accessToken || !selectedCourse || !content) {
      setError('Please select a course and ensure content is available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/google-classroom/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          courseId: selectedCourse,
          content,
          contentType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to sync to Google Classroom');
      }

      const result = await response.json();
      setSuccess('Content synced to Google Classroom successfully!');
      onSync?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync to Google Classroom');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!accessToken || !selectedCourse || !content) {
      setError('Please select a course and ensure content is available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Content object:', content);
      console.log('Content type:', contentType);
      
      const assignmentData = {
        title: content.title || content.name || 'Generated Assignment',
        description: content.description || content.comment || content.content || 'Generated content from AI Tutor Tools',
        dueDate: content.dueDate,
        dueTime: content.dueTime
      };
      
      console.log('Assignment data being sent:', assignmentData);
      
      const response = await fetch('/api/google-classroom/create-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          courseId: selectedCourse,
          assignmentData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create assignment');
      }

      const result = await response.json();
      setSuccess('Assignment created in Google Classroom successfully!');
      onSync?.(result);
    } catch (err) {
      console.error('Assignment creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async () => {
    if (!accessToken || !selectedCourse || !content) {
      setError('Please select a course and ensure content is available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/google-classroom/create-material', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          courseId: selectedCourse,
          materialData: {
            title: content.title || 'Generated Material',
            description: content.description || content.comment || 'Generated content from AI Tutor Tools',
            materials: []
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create material');
      }

      const result = await response.json();
      setSuccess('Material created in Google Classroom successfully!');
      onSync?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-gray-600 mb-4">Sync your generated content directly to Google Classroom</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {!accessToken ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Connect to Google Classroom</h4>
          <p className="text-gray-600 mb-4">
            Authorize access to your Google Classroom to sync content and manage assignments.
          </p>
          <button
            onClick={handleGoogleAuth}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Connect with Google
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} {course.section && `(${course.section})`}
                </option>
              ))}
            </select>
            {courses.length === 0 && !loading && (
              <button
                onClick={fetchCourses}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Load Courses
              </button>
            )}
            {loading && (
              <div className="mt-2 text-sm text-gray-500">
                Loading courses...
              </div>
            )}
            {courses.length > 0 && (
              <div className="mt-2 text-sm text-green-600">
                {courses.length} course{courses.length !== 1 ? 's' : ''} loaded
              </div>
            )}
          </div>

          {/* Students List */}
          {selectedCourse && students.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Students in Course ({students.length})
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                {students.map((student) => (
                  <div key={student.userId} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-900">
                      {student.profile.name.fullName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {student.profile.emailAddress}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedCourse && content && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Sync Options</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={handleSyncToClassroom}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Syncing...' : 'Sync Content'}
                </button>
                
                <button
                  onClick={handleCreateAssignment}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Assignment'}
                </button>
                
                <button
                  onClick={handleCreateMaterial}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Material'}
                </button>
              </div>
            </div>
          )}

          {/* Disconnect Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setAccessToken('');
                localStorage.removeItem('google_access_token');
                localStorage.removeItem('google_token_expires');
                localStorage.removeItem('google_token_scope');
                alert('Disconnected from Google Classroom');
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Disconnect Google Classroom
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleClassroomIntegration; 