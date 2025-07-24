import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({ title, description, children }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Link>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-slate-300">{description}</p>
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default ToolLayout;