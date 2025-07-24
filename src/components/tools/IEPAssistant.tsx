import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolLayout from '../ToolLayout';
import { Sparkles, Users } from 'lucide-react';

const IEPAssistant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    disability: '',
    currentPerformance: '',
    goals: '',
    accommodations: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/iep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        navigate('/output/iep', {
          state: {
            content: data.result,
            toolName: 'IEP Assistant',
            formData: formData
          }
        });
      } else {
        navigate('/output/iep', {
          state: {
            content: 'Failed to generate IEP. Please try again.',
            toolName: 'IEP Assistant',
            formData: formData
          }
        });
      }
    } catch (error) {
      navigate('/output/iep', {
        state: {
          content: 'Error connecting to AI service. Please try again.',
          toolName: 'IEP Assistant',
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
          <div className="rounded-full bg-accentPurple p-4 flex items-center justify-center mb-2">
            <Users className="h-10 w-10" stroke="white" fill="none" />
          </div>
          <h1 className="text-3xl font-extrabold mb-1 text-center">IEP Assistant</h1>
          <p className="text-textSecondary text-center mb-4">Draft Individualized Education Plans for students with specific needs</p>
          <div className="w-full border-b border-[#353945] mb-4"></div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 mb-2">
            <h2 className="text-lg font-bold text-accentPurple mb-2">Student Information</h2>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Student Name</label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPurple focus:border-accentPurple transition-all duration-200"
              placeholder="Student's full name"
              required
            />
            <p className="text-xs text-textSecondary mt-1">Enter the student's full name.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Grade Level</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPurple focus:border-accentPurple transition-all duration-200"
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
            <p className="text-xs text-textSecondary mt-1">Select the student's grade level.</p>
          </div>
          <div className="col-span-1 md:col-span-2 mb-2">
            <h2 className="text-lg font-bold text-accentPurple mb-2 mt-2">Disability & Performance</h2>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Disability Category</label>
            <select
              value={formData.disability}
              onChange={(e) => setFormData({...formData, disability: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPurple focus:border-accentPurple transition-all duration-200"
              required
            >
              <option value="">Select disability category</option>
              <option value="Specific Learning Disability">Specific Learning Disability</option>
              <option value="Autism Spectrum Disorder">Autism Spectrum Disorder</option>
              <option value="Intellectual Disability">Intellectual Disability</option>
              <option value="Speech or Language Impairment">Speech or Language Impairment</option>
              <option value="Other Health Impairment">Other Health Impairment</option>
              <option value="Multiple Disabilities">Multiple Disabilities</option>
            </select>
            <p className="text-xs text-textSecondary mt-1">Choose the disability category.</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-textSecondary mb-1">Current Academic Performance</label>
            <textarea
              value={formData.currentPerformance}
              onChange={(e) => setFormData({...formData, currentPerformance: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPurple focus:border-accentPurple transition-all duration-200"
              rows={3}
              placeholder="Describe student's current academic performance, strengths, and areas of need"
              required
            />
            <p className="text-xs text-textSecondary mt-1">Describe strengths and areas of need.</p>
          </div>
          <div className="col-span-1 md:col-span-2 mb-2">
            <h2 className="text-lg font-bold text-accentPurple mb-2 mt-2">Goals & Accommodations</h2>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Annual Goals</label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({...formData, goals: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPurple focus:border-accentPurple transition-all duration-200"
              rows={4}
              placeholder={"Enter each goal on a new line:\nImprove reading comprehension\nDevelop math problem-solving skills\nIncrease social interaction"}
              required
            />
            <p className="text-xs text-textSecondary mt-1">List each goal on a new line.</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-textSecondary mb-1">Accommodations and Modifications</label>
            <textarea
              value={formData.accommodations}
              onChange={(e) => setFormData({...formData, accommodations: e.target.value})}
              className="w-full bg-[#23262F] text-white border border-[#353945] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accentPurple focus:border-accentPurple transition-all duration-200"
              rows={3}
              placeholder="List specific accommodations and modifications needed"
              required
            />
            <p className="text-xs text-textSecondary mt-1">List all accommodations and modifications needed.</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-accentPurple text-background py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:bg-accentBlue hover:text-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-accentPurple/40"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate IEP Draft</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IEPAssistant;