import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolLayout from '../ToolLayout';
import { Sparkles, List } from 'lucide-react';

const ClearDirectionsGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    activityType: '',
    gradeLevel: '',
    timeLimit: '',
    materials: '',
    objective: '',
    complexity: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        navigate('/output/directions', {
          state: {
            content: data.result,
            toolName: 'Clear Directions Generator',
            formData: formData
          }
        });
      } else {
        navigate('/output/directions', {
          state: {
            content: 'Failed to generate directions. Please try again.',
            toolName: 'Clear Directions Generator',
            formData: formData
          }
        });
      }
    } catch (error) {
      navigate('/output/directions', {
        state: {
          content: 'Error connecting to AI service. Please try again.',
          toolName: 'Clear Directions Generator',
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
            <List className="h-10 w-10" stroke="white" fill="none" />
          </div>
          <h1 className="text-3xl font-extrabold mb-1 text-center">Clear Directions Generator</h1>
          <p className="text-textSecondary text-center mb-4">Generate simple, step-by-step instructions for class activities</p>
          <div className="w-full border-b border-[#353945] mb-4"></div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 mb-1">
            <h2 className="text-lg font-bold text-accentYellow mb-1">Activity Details</h2>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Activity Type</label>
            <input
              type="text"
              value={formData.activityType}
              onChange={(e) => setFormData({...formData, activityType: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              placeholder="e.g., Science Experiment, Group Discussion, Art Project"
              required
            />
            <p className="text-xs text-textSecondary mt-1">What type of activity is this?</p>
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
            <p className="text-xs text-textSecondary mt-1">Select the grade level for your students.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Time Limit</label>
            <select
              value={formData.timeLimit}
              onChange={(e) => setFormData({...formData, timeLimit: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              required
            >
              <option value="">Select time limit</option>
              <option value="20 minutes">20 minutes</option>
              <option value="30 minutes">30 minutes</option>
              <option value="45 minutes">45 minutes</option>
              <option value="60 minutes">60 minutes</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">How much time is available for the activity?</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Complexity Level</label>
            <select
              value={formData.complexity}
              onChange={(e) => setFormData({...formData, complexity: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              required
            >
              <option value="">Select complexity</option>
              <option value="simple">Simple (3-4 steps)</option>
              <option value="moderate">Moderate (5-6 steps)</option>
              <option value="complex">Complex (7+ steps)</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">How complex should the directions be?</p>
          </div>
          <div className="col-span-1 md:col-span-2 mb-1">
            <h2 className="text-lg font-bold text-accentYellow mb-1 mt-2">Materials & Objective</h2>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Materials Needed</label>
            <textarea
              value={formData.materials}
              onChange={(e) => setFormData({...formData, materials: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              rows={3}
              placeholder="List all materials students will need"
              required
            />
            <p className="text-xs text-textSecondary mt-1">List all materials required for the activity.</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Learning Objective</label>
            <textarea
              value={formData.objective}
              onChange={(e) => setFormData({...formData, objective: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              rows={2}
              placeholder="What should students accomplish or learn?"
              required
            />
            <p className="text-xs text-textSecondary mt-1">What should students accomplish or learn?</p>
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
                  <span>Generate Directions</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClearDirectionsGenerator;