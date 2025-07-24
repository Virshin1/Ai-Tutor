import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Save, Download, FileText, Share2, ClipboardList, Users, CheckCircle, MessageSquare, BookOpen, BarChart3, List } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GoogleClassroomIntegration from './GoogleClassroomIntegration';
import { ErrorBoundary } from './ErrorBoundary';
import GoogleClassroomButton from './GoogleClassroomButton';

const OutputViewer = () => {
  const { toolId } = useParams();
  const location = useLocation();
  const { content, toolName, formData } = location.state || {};
  const [showGoogleClassroom, setShowGoogleClassroom] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [gcError, setGcError] = useState<string | null>(null);
  const [gcLoading, setGcLoading] = useState(false);
  const gcTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('showGoogleClassroom state changed to:', showGoogleClassroom);
    
    // Prevent body scrolling when modal is open
    if (showGoogleClassroom) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showGoogleClassroom]);

  // When opening the modal, reset error/loading and start timeout
  const openGoogleClassroom = () => {
    setGcError(null);
    setGcLoading(true);
    setShowGoogleClassroom(true);
    if (gcTimeoutRef.current) clearTimeout(gcTimeoutRef.current);
    gcTimeoutRef.current = setTimeout(() => {
      setGcLoading(false);
      setGcError('Google Classroom integration timed out. Please try again.');
    }, 10000); // 10 seconds
  };

  // When closing the modal, clear timeout
  const closeGoogleClassroom = () => {
    setShowGoogleClassroom(false);
    setGcError(null);
    setGcLoading(false);
    if (gcTimeoutRef.current) clearTimeout(gcTimeoutRef.current);
  };

  // ESC key closes modal
  useEffect(() => {
    if (!showGoogleClassroom) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGoogleClassroom();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showGoogleClassroom]);

  useEffect(() => {
    if (toast) {
      setToastVisible(true);
      const hideTimer = setTimeout(() => setToastVisible(false), 1600); // Start fade out after 1.6s
      const removeTimer = setTimeout(() => setToast(null), 2000); // Remove after 2s
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setToast('Copied to clipboard!');
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: toolName,
          content,
          type: toolId,
          formData
        })
      });

      if (response.ok) {
        setToast('Saved to documents!');
      } else {
        setToast('Failed to save. Try again.');
      }
    } catch (error) {
      setToast('Error saving document.');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          toolName,
          formData,
          type: toolId
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${toolName}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setToast('Exported as PDF!');
      } else {
        setToast('Failed to export PDF.');
      }
    } catch (error) {
      setToast('Error exporting PDF.');
    }
  };

  const getToolPath = (toolId: string) => {
    const toolPaths: { [key: string]: string } = {
      'lesson-plan': '/tools/lesson-plan',
      'rubric': '/tools/rubric',
      'iep': '/tools/iep',
      'exit-ticket': '/tools/exit-ticket',
      'report-comment': '/tools/report-comment',
      'assignments': '/tools/assignments',
      'directions': '/tools/directions'
    };
    return toolPaths[toolId] || '/';
  };

  // Icon and accent color mapping
  const toolIcons: { [key: string]: { icon: any, color: string } } = {
    'lesson-plan': { icon: FileText, color: 'bg-accentYellow' },
    'rubric': { icon: ClipboardList, color: 'bg-accentBlue' },
    'iep': { icon: Users, color: 'bg-accentPurple' },
    'exit-ticket': { icon: CheckCircle, color: 'bg-accentGreen' },
    'report-comment': { icon: MessageSquare, color: 'bg-accentPink' },
    'assignments': { icon: BookOpen, color: 'bg-accentYellow' },
    'snapshot': { icon: BarChart3, color: 'bg-accentBlue' },
    'directions': { icon: List, color: 'bg-accentBlue' },
  };
  const { icon: ToolIcon, color: accentColor } = toolIcons[toolId!] || { icon: FileText, color: 'bg-accentYellow' };

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">No Content Found</h1>
            <p className="text-slate-300 mb-6">The generated content could not be found.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary flex items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 bg-accentBlue text-background px-6 py-3 rounded-xl shadow-lg z-50 transition-opacity duration-400 ${toastVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ pointerEvents: 'none' }}
          >
            {toast}
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className={`rounded-full ${accentColor} p-4 flex items-center justify-center mb-2`}>
            <ToolIcon className="h-9 w-9" stroke="white" fill="none" />
          </div>
          <h1 className="text-2xl font-extrabold mb-1 text-center">{toolName || 'Generated Content'}</h1>
          <p className="text-textSecondary text-center mb-4">Your AI-generated content is ready!</p>
          <div className="w-full border-b border-[#353945] mb-4"></div>
        </div>
        {/* Action Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-card text-textSecondary hover:bg-[#181A20] hover:text-accentBlue font-semibold shadow transition-all duration-200"
            title="Copy to clipboard"
          >
            <Copy className="h-5 w-5" />
            Copy
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-accentBlue text-background hover:bg-[#181A20] hover:text-accentBlue font-semibold shadow transition-all duration-200"
            title="Save to documents"
          >
            <Save className="h-5 w-5" />
            Save
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-accentGreen text-background hover:bg-[#181A20] hover:text-white font-semibold shadow transition-all duration-200"
            title="Export to PDF"
          >
            <Download className="h-5 w-5" />
            Export PDF
          </button>
        </div>
        {/* Generated Content Card */}
        <div className="bg-card rounded-2xl p-10 shadow-xl border border-[#353945] mb-8">
          <div className="prose prose-invert prose-lg text-textPrimary max-w-none space-y-6" style={{ lineHeight: 1.7 }}>
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        </div>
        {/* Form Data Summary (if available) */}
        {formData && (
          <div className="bg-card rounded-xl p-6 mb-8 shadow border border-[#353945]">
            <h2 className="text-lg font-bold text-accentBlue mb-4">Generation Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="bg-background rounded-lg p-3">
                  <div className="text-xs text-textSecondary capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-white text-sm">
                    {typeof value === 'string' && value.length > 50 
                      ? `${value.substring(0, 50)}...` 
                      : String(value)
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Google Classroom Integration Modal */}
        {showGoogleClassroom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">🎓 Google Classroom Integration</h3>
                <button
                  onClick={closeGoogleClassroom}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 min-h-[200px] flex flex-col items-center justify-center">
                <ErrorBoundary onError={err => { setGcError('Google Classroom failed to load.'); setGcLoading(false); }}>
                  <GoogleClassroomIntegration
                    content={{
                      title: toolName,
                      description: content,
                      ...formData
                    }}
                    contentType="assignment"
                    onSync={(result) => {
                      setToast('Synced to Google Classroom!');
                      closeGoogleClassroom();
                    }}
                    onLoad={() => { setGcLoading(false); if (gcTimeoutRef.current) clearTimeout(gcTimeoutRef.current); }}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        )}
        {/* Action Bar at Bottom */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to={getToolPath(toolId!)}
            className="px-6 py-3 bg-card text-textPrimary rounded-xl hover:bg-[#181A20] hover:text-accentBlue font-semibold shadow transition-all duration-200"
          >
            Generate Another
          </Link>
          <Link
            to="/documents"
            className="px-6 py-3 bg-accentBlue text-background rounded-xl hover:bg-accentYellow hover:text-background font-semibold shadow transition-all duration-200"
          >
            View My Documents
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OutputViewer;