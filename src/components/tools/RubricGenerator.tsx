import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ClipboardList } from 'lucide-react';

const RubricGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assignment: '',
    criteria: '',
    levels: '4',
    gradeLevel: '',
    subject: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/rubric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        navigate('/output/rubric', {
          state: {
            content: data.result,
            toolName: 'Rubric Generator',
            formData: formData
          }
        });
      } else {
        navigate('/output/rubric', {
          state: {
            content: 'Failed to generate rubric. Please try again.',
            toolName: 'Rubric Generator',
            formData: formData
          }
        });
      }
    } catch (error) {
      navigate('/output/rubric', {
        state: {
          content: 'Error connecting to AI service. Please try again.',
          toolName: 'Rubric Generator',
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
          <div className="rounded-full bg-accentBlue p-4 flex items-center justify-center mb-2">
            <ClipboardList className="h-10 w-10" stroke="white" fill="none" />
          </div>
          <h1 className="text-3xl font-extrabold mb-1 text-center">Rubric Generator</h1>
          <p className="text-textSecondary text-center mb-4">Generate custom grading rubrics with criteria and scoring scale</p>
          <div className="w-full border-b border-[#353945] mb-4"></div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 mb-2">
            <h2 className="text-lg font-bold text-accentBlue mb-2">Rubric Details</h2>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Assignment Type</label>
            <input
              type="text"
              value={formData.assignment}
              onChange={(e) => setFormData({...formData, assignment: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200"
              placeholder="e.g., Essay, Lab Report, Presentation"
              required
            />
            <p className="text-xs text-textSecondary mt-1">What type of assignment is this rubric for?</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200"
              required
            >
              <option value="">Select subject</option>
              <option value="Math">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English Language Arts</option>
              <option value="History">History</option>
              <option value="Art">Art</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">Choose the subject for this rubric.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Grade Level</label>
            <select
              value={formData.gradeLevel}
              onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200"
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
            <label className="block text-sm font-medium text-textSecondary mb-1">Performance Levels</label>
            <select
              value={formData.levels}
              onChange={(e) => setFormData({...formData, levels: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200"
              required
            >
              <option value="3">3 Levels</option>
              <option value="4">4 Levels</option>
              <option value="5">5 Levels</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">How many performance levels should the rubric have?</p>
          </div>
          <div className="col-span-1 md:col-span-2 mb-2">
            <h2 className="text-lg font-bold text-accentBlue mb-2 mt-2">Criteria</h2>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Evaluation Criteria</label>
            <textarea
              value={formData.criteria}
              onChange={(e) => setFormData({...formData, criteria: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200"
              rows={4}
              placeholder={"Enter each criterion on a new line:\nContent Knowledge\nOrganization\nGrammar and Mechanics\nCreativity"}
              required
            />
            <p className="text-xs text-textSecondary mt-1">List each criterion on a new line.</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-accentBlue text-background py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:bg-accentYellow hover:text-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-accentBlue/40"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Rubric</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RubricGenerator;