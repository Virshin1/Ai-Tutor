import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolLayout from '../ToolLayout';
import { Sparkles, GraduationCap, FileText } from 'lucide-react';

const LessonPlanGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    gradeLevel: '',
    duration: '',
    objectives: '',
    materials: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        navigate('/output/lesson-plan', {
          state: {
            content: data.result,
            toolName: 'Lesson Plan Generator',
            formData: formData
          }
        });
      } else {
        navigate('/output/lesson-plan', {
          state: {
            content: 'Failed to generate lesson plan. Please try again.',
            toolName: 'Lesson Plan Generator',
            formData: formData
          }
        });
      }
    } catch (error) {
      navigate('/output/lesson-plan', {
        state: {
          content: 'Error connecting to AI service. Please try again.',
          toolName: 'Lesson Plan Generator',
          formData: formData
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary flex items-center justify-center py-8 relative overflow-hidden">
      {/* Blurred Accent SVG removed */}
      <div className="w-full max-w-3xl bg-gradient-to-br from-[#23262F] via-[#23262F] to-[#181A20] rounded-3xl shadow-2xl p-10 mx-auto animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-full bg-accentYellow p-4 flex items-center justify-center mb-2">
            <FileText className="h-10 w-10" stroke="white" fill="none" />
          </div>
          <h1 className="text-3xl font-extrabold mb-1 text-center">Lesson Plan Generator</h1>
          <p className="text-textSecondary text-center mb-4">Create structured lesson plans based on topic, grade level, and subject</p>
          <div className="w-full border-b border-[#353945] mb-4"></div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 mb-2">
            <h2 className="text-lg font-bold text-accentYellow mb-2">Lesson Details</h2>
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
              <option value="Math">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English Language Arts</option>
              <option value="History">History</option>
              <option value="Art">Art</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">Choose the main subject for your lesson.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Topic</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              placeholder="e.g., Fractions, Photosynthesis, Poetry"
              required
            />
            <p className="text-xs text-textSecondary mt-1">What is the specific topic for this lesson?</p>
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
            <p className="text-xs text-textSecondary mt-1">Select the grade level for your students.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Duration</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              required
            >
              <option value="">Select duration</option>
              <option value="30 minutes">30 minutes</option>
              <option value="45 minutes">45 minutes</option>
              <option value="60 minutes">60 minutes</option>
              <option value="90 minutes">90 minutes</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">How long will the lesson last?</p>
          </div>
          <div className="col-span-1 md:col-span-2 mb-2">
            <h2 className="text-lg font-bold text-accentYellow mb-2 mt-2">Objectives & Materials</h2>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Learning Objectives</label>
            <textarea
              value={formData.objectives}
              onChange={(e) => setFormData({...formData, objectives: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              rows={3}
              placeholder="What should students learn or be able to do?"
              required
            />
            <p className="text-xs text-textSecondary mt-1">Describe the main learning goals for this lesson.</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Materials Needed</label>
            <textarea
              value={formData.materials}
              onChange={(e) => setFormData({...formData, materials: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              rows={2}
              placeholder="List required materials and resources"
            />
            <p className="text-xs text-textSecondary mt-1">List all materials, handouts, or resources needed.</p>
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
                  <span>Generate Lesson Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonPlanGenerator;