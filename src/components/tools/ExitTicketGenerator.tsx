import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolLayout from '../ToolLayout';
import { Sparkles, CheckCircle } from 'lucide-react';

const ExitTicketGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    gradeLevel: '',
    questionType: '',
    objectives: '',
    numQuestions: '3'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/exit-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        navigate('/output/exit-ticket', {
          state: {
            content: data.result,
            toolName: 'Exit Ticket Generator',
            formData: formData
          }
        });
      } else {
        navigate('/output/exit-ticket', {
          state: {
            content: 'Failed to generate exit ticket. Please try again.',
            toolName: 'Exit Ticket Generator',
            formData: formData
          }
        });
      }
    } catch (error) {
      navigate('/output/exit-ticket', {
        state: {
          content: 'Error connecting to AI service. Please try again.',
          toolName: 'Exit Ticket Generator',
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
          <div className="rounded-full bg-accentGreen p-4 flex items-center justify-center mb-2">
            <CheckCircle className="h-10 w-10" stroke="white" fill="none" />
          </div>
          <h1 className="text-3xl font-extrabold mb-1 text-center">Exit Ticket Generator</h1>
          <p className="text-textSecondary text-center mb-4">Make short end-of-lesson assessments to check understanding</p>
          <div className="w-full border-b border-[#353945] mb-4"></div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 mb-2">
            <h2 className="text-lg font-bold text-accentGreen mb-2">Exit Ticket Details</h2>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Lesson Topic</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentGreen focus:border-accentGreen transition-all duration-200"
              placeholder="e.g., Fractions, Photosynthesis, American Revolution"
              required
            />
            <p className="text-xs text-textSecondary mt-1">What is the topic of the lesson?</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Grade Level</label>
            <select
              value={formData.gradeLevel}
              onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentGreen focus:border-accentGreen transition-all duration-200"
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
            <label className="block text-sm font-medium text-textSecondary mb-1">Question Type</label>
            <select
              value={formData.questionType}
              onChange={(e) => setFormData({...formData, questionType: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentGreen focus:border-accentGreen transition-all duration-200"
              required
            >
              <option value="">Select question type</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="short-answer">Short Answer</option>
              <option value="problem-solving">Problem Solving</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">Choose the type of questions.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Number of Questions</label>
            <select
              value={formData.numQuestions}
              onChange={(e) => setFormData({...formData, numQuestions: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentGreen focus:border-accentGreen transition-all duration-200"
              required
            >
              <option value="3">3 Questions</option>
              <option value="4">4 Questions</option>
              <option value="5">5 Questions</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">How many questions should be generated?</p>
          </div>
          <div className="col-span-1 md:col-span-2 mb-2">
            <h2 className="text-lg font-bold text-accentGreen mb-2 mt-2">Objectives</h2>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Learning Objectives</label>
            <textarea
              value={formData.objectives}
              onChange={(e) => setFormData({...formData, objectives: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentGreen focus:border-accentGreen transition-all duration-200"
              rows={3}
              placeholder="What specific concepts or skills are you assessing?"
              required
            />
            <p className="text-xs text-textSecondary mt-1">Describe the learning objectives being assessed.</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-accentGreen text-background py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:bg-accentBlue hover:text-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-accentGreen/40"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Exit Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExitTicketGenerator;