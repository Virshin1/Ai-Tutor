import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolLayout from '../ToolLayout';
import { Sparkles, MessageSquare } from 'lucide-react';

const ReportCommentGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    subject: '',
    tone: '',
    performance: '',
    strengths: '',
    improvements: '',
    behavior: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/report-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        navigate('/output/report-comment', {
          state: {
            content: data.result,
            toolName: 'Report Comment Generator',
            formData: formData
          }
        });
      } else {
        navigate('/output/report-comment', {
          state: {
            content: 'Failed to generate report comment. Please try again.',
            toolName: 'Report Comment Generator',
            formData: formData
          }
        });
      }
    } catch (error) {
      navigate('/output/report-comment', {
        state: {
          content: 'Error connecting to AI service. Please try again.',
          toolName: 'Report Comment Generator',
          formData: formData
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary flex items-center justify-center py-8">
      <div className="w-full max-w-3xl bg-gradient-to-br from-[#23262F] via-[#23262F] to-[#181A20] rounded-3xl shadow-2xl p-10 mx-auto animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-full bg-accentPink p-4 flex items-center justify-center mb-2">
            <MessageSquare className="h-10 w-10" stroke="white" fill="none" />
          </div>
          <h1 className="text-3xl font-extrabold mb-1 text-center">Report Comment Generator</h1>
          <p className="text-textSecondary text-center mb-4">Create formal or casual progress report comments for students</p>
          <div className="w-full border-b border-[#353945] mb-4"></div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 mb-1">
            <h2 className="text-lg font-bold text-accentPink mb-1">Student Information</h2>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Student Name</label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPink focus:border-accentPink transition-all duration-200"
              placeholder="Student's name"
              required
            />
            <p className="text-xs text-textSecondary mt-1">Enter the student's name.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPink focus:border-accentPink transition-all duration-200"
              required
            >
              <option value="">Select subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English Language Arts">English Language Arts</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Art">Art</option>
              <option value="Physical Education">Physical Education</option>
              <option value="Music">Music</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">Choose the subject for this comment.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Comment Tone</label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({...formData, tone: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPink focus:border-accentPink transition-all duration-200"
              required
            >
              <option value="">Select tone</option>
              <option value="formal">Formal</option>
              <option value="friendly">Friendly</option>
              <option value="encouraging">Encouraging</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">Select the tone for the comment.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Overall Performance</label>
            <select
              value={formData.performance}
              onChange={(e) => setFormData({...formData, performance: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPink focus:border-accentPink transition-all duration-200"
              required
            >
              <option value="">Select performance level</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Satisfactory">Satisfactory</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">How is the student's overall performance?</p>
          </div>
          <div className="col-span-1 md:col-span-2 mb-1">
            <h2 className="text-lg font-bold text-accentPink mb-1 mt-2">Strengths & Improvements</h2>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Student Strengths</label>
            <textarea
              value={formData.strengths}
              onChange={(e) => setFormData({...formData, strengths: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPink focus:border-accentPink transition-all duration-200"
              rows={2}
              placeholder="What does the student do well?"
              required
            />
            <p className="text-xs text-textSecondary mt-1">What are the student's strengths?</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Areas for Improvement</label>
            <textarea
              value={formData.improvements}
              onChange={(e) => setFormData({...formData, improvements: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPink focus:border-accentPink transition-all duration-200"
              rows={2}
              placeholder="What areas need development?"
              required
            />
            <p className="text-xs text-textSecondary mt-1">What areas need development?</p>
          </div>
          <div className="col-span-1 md:col-span-2 mb-1">
            <h2 className="text-lg font-bold text-accentPink mb-1 mt-2">Behavior</h2>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Classroom Behavior</label>
            <select
              value={formData.behavior}
              onChange={(e) => setFormData({...formData, behavior: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPink focus:border-accentPink transition-all duration-200"
              required
            >
              <option value="">Select behavior</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="satisfactory">Satisfactory</option>
              <option value="needs improvement">Needs Improvement</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">How is the student's classroom behavior?</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-accentPink text-background py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:bg-accentBlue hover:text-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-accentPink/40"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Comments</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportCommentGenerator;