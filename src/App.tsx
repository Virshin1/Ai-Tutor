import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LessonPlanGenerator from './components/tools/LessonPlanGenerator';
import RubricGenerator from './components/tools/RubricGenerator';
import IEPAssistant from './components/tools/IEPAssistant';
import ExitTicketGenerator from './components/tools/ExitTicketGenerator';
import ReportCommentGenerator from './components/tools/ReportCommentGenerator';
import RecommendAssignments from './components/tools/RecommendAssignments';
import ClassSnapshot from './components/tools/ClassSnapshot';
import ClearDirectionsGenerator from './components/tools/ClearDirectionsGenerator';
import MyDocuments from './components/MyDocuments';
import OutputViewer from './components/OutputViewer';
import Header from './components/Header';
import Analytics from './components/Analytics';
import StudentManagement from './components/StudentManagement';
import GoogleAuthCallback from './components/GoogleAuthCallback';
import EnhancedDashboard from './components/EnhancedDashboard';

function App() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [apiMessage, setApiMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/sample')
      .then(res => res.json())
      .then(data => setApiMessage(data.message))
      .catch(() => setApiMessage('Could not connect to backend.'));
  }, []);

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        {apiMessage && (
          <div className="bg-green-900 text-green-200 px-4 py-2 text-center">
            Backend: {apiMessage}
          </div>
        )}
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
              />
            } 
          />
          <Route path="/documents" element={<MyDocuments />} />
          <Route path="/tools/lesson-plan" element={<LessonPlanGenerator />} />
          <Route path="/tools/rubric" element={<RubricGenerator />} />
          <Route path="/tools/iep" element={<IEPAssistant />} />
          <Route path="/tools/exit-ticket" element={<ExitTicketGenerator />} />
          <Route path="/tools/report-comment" element={<ReportCommentGenerator />} />
          <Route path="/tools/assignments" element={<RecommendAssignments />} />
          <Route path="/tools/directions" element={<ClearDirectionsGenerator />} />
          <Route path="/output/:toolId" element={<OutputViewer />} />
          <Route path="/analytics" element={<EnhancedDashboard />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;