import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolLayout from '../ToolLayout';
import { Sparkles, BookOpen } from 'lucide-react';

const RecommendAssignments = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    gradeLevel: '',
    currentLevel: '',
    learningStyle: '',
    interests: '',
    timeAvailable: '',
    goals: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        navigate('/output/assignments', {
          state: {
            content: data.result,
            toolName: 'Recommend Assignments',
            formData: formData
          }
        });
      } else {
        navigate('/output/assignments', {
          state: {
            content: 'Failed to generate assignments. Please try again.',
            toolName: 'Recommend Assignments',
            formData: formData
          }
        });
      }
    } catch (error) {
      navigate('/output/assignments', {
        state: {
          content: 'Error connecting to AI service. Please try again.',
          toolName: 'Recommend Assignments',
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
          <div className="rounded-full bg-accentYellow p-4 flex items-center justify-center mb-2">
            <BookOpen className="h-10 w-10" stroke="white" fill="none" />
          </div>
          <h1 className="text-3xl font-extrabold mb-1 text-center">Recommend Assignments</h1>
          <p className="text-textSecondary text-center mb-4">Suggest learning materials or activities based on performance</p>
          <div className="w-full border-b border-[#353945] mb-4"></div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 mb-1">
            <h2 className="text-lg font-bold text-accentYellow mb-1">Student Profile</h2>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              required
            >
              <option value="">Select subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English Language Arts">English Language Arts</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Art">Art</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">Choose the subject for recommendations.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Grade Level</label>
            <select
              value={formData.gradeLevel}
              onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              required
            >
              <option value="">Select grade level</option>
              <option value="Elementary">Elementary (K-5)</option>
              <option value="Middle School">Middle School (6-8)</option>
              <option value="High School">High School (9-12)</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">Select the student's grade level.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Current Performance Level</label>
            <select
              value={formData.currentLevel}
              onChange={(e) => setFormData({...formData, currentLevel: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              required
            >
              <option value="">Select performance level</option>
              <option value="below-grade">Below Grade Level</option>
              <option value="at-grade">At Grade Level</option>
              <option value="above-grade">Above Grade Level</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">How is the student's current performance?</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Learning Style</label>
            <select
              value={formData.learningStyle}
              onChange={(e) => setFormData({...formData, learningStyle: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              required
            >
              <option value="">Select learning style</option>
              <option value="visual">Visual</option>
              <option value="auditory">Auditory</option>
              <option value="kinesthetic">Kinesthetic</option>
              <option value="mixed">Mixed</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">Select the student's learning style.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Time Available Per Day</label>
            <select
              value={formData.timeAvailable}
              onChange={(e) => setFormData({...formData, timeAvailable: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              required
            >
              <option value="">Select time available</option>
              <option value="20-minutes">20 minutes</option>
              <option value="30-minutes">30 minutes</option>
              <option value="60-minutes">60 minutes</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">How much time is available for learning each day?</p>
          </div>
          <div className="col-span-1 md:col-span-2 mb-1">
            <h2 className="text-lg font-bold text-accentYellow mb-1 mt-2">Interests & Goals</h2>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Student Interests</label>
            <textarea
              value={formData.interests}
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              rows={2}
              placeholder="What topics or activities interest the student?"
              required
            />
            <p className="text-xs text-textSecondary mt-1">What are the student's interests?</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Learning Goals</label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({...formData, goals: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              rows={3}
              placeholder="What specific skills or knowledge should the student develop?"
              required
            />
            <p className="text-xs text-textSecondary mt-1">What are the student's learning goals?</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-accentYellow text-background py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:bg-accentBlue hover:text-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-accentYellow/40"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Recommendations</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecommendAssignments;