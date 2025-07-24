import React, { useState } from 'react';
import { 
  FileText, 
  ClipboardList, 
  Users, 
  CheckCircle, 
  MessageSquare, 
  BookOpen,
  BarChart3,
  List,
  Star
} from 'lucide-react';
import ToolCard from './ToolCard';
import FilterPills from './FilterPills';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
}

const accentColors = [
  "bg-accentYellow",
  "bg-accentBlue",
  "bg-accentPurple",
  "bg-accentGreen",
  "bg-accentPink",
  "bg-accentOrange"
];

const Dashboard: React.FC<DashboardProps> = ({ favorites, onToggleFavorite }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const navigate = useNavigate();

  const tools = [
    {
      id: 'lesson-plan',
      name: 'Lesson Plan Generator',
      description: 'Create structured lesson plans based on topic, grade level, and subject',
      icon: FileText,
      category: 'plan',
      path: '/tools/lesson-plan'
    },
    {
      id: 'rubric',
      name: 'Rubric Generator',
      description: 'Generate custom grading rubrics with criteria and scoring scale',
      icon: ClipboardList,
      category: 'create',
      path: '/tools/rubric'
    },
    {
      id: 'iep',
      name: 'IEP Assistant',
      description: 'Draft Individualized Education Plans for students with specific needs',
      icon: Users,
      category: 'support',
      path: '/tools/iep'
    },
    {
      id: 'exit-ticket',
      name: 'Exit Ticket Generator',
      description: 'Make short end-of-lesson assessments to check understanding',
      icon: CheckCircle,
      category: 'create',
      path: '/tools/exit-ticket'
    },
    {
      id: 'report-comment',
      name: 'Report Comment Generator',
      description: 'Create formal or casual progress report comments for students',
      icon: MessageSquare,
      category: 'support',
      path: '/tools/report-comment'
    },
    {
      id: 'assignments',
      name: 'Recommend Assignments',
      description: 'Suggest learning materials or activities based on performance',
      icon: BookOpen,
      category: 'support',
      path: '/tools/assignments'
    },
    {
      id: 'directions',
      name: 'Clear Directions Generator',
      description: 'Generate simple, step-by-step instructions for class activities',
      icon: List,
      category: 'create',
      path: '/tools/directions'
    }
  ];

  const filteredTools = () => {
    if (activeFilter === 'all') {
      return tools;
    } else if (activeFilter === 'favorites') {
      return tools.filter(tool => favorites.includes(tool.id));
    } else {
      return tools.filter(tool => tool.category === activeFilter);
    }
  };

  const filterOptions = [
    { label: 'All Tools', value: 'all' },
    { label: 'Favorites', value: 'favorites' },
    { label: 'Plan', value: 'plan' },
    { label: 'Create', value: 'create' },
    { label: 'Support', value: 'support' }
  ];

  const toolCards = filteredTools().map((tool, idx) => {
    const Icon = tool.icon;
    const isFavorite = favorites.includes(tool.id);
    return (
      <div
        key={tool.title}
        className="bg-card rounded-2xl shadow-lg p-6 flex flex-col items-start gap-4 hover:shadow-2xl transition-shadow border border-slate-800 cursor-pointer relative group"
        onClick={() => navigate(tool.path)}
      >
        {/* Favorite Star */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(tool.id); }}
          className={`absolute top-4 right-4 transition-opacity duration-200 z-10 ${isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          tabIndex={0}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={`h-6 w-6 ${isFavorite ? 'text-accentYellow fill-accentYellow' : 'text-textSecondary'} transition-colors`}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
        <div className={`rounded-full p-3 text-2xl mb-2 ${accentColors[idx % accentColors.length]}`}><Icon /></div>
        <h2 className="text-xl font-bold mb-1">{tool.name}</h2>
        <p className="text-textSecondary mb-4">{tool.description}</p>
      </div>
    );
  });

  // Center the last card if it's alone in the last row (3-column grid)
  const rows = Math.ceil(toolCards.length / 3);
  const lastRowCount = toolCards.length % 3;
  if (lastRowCount === 1) {
    toolCards.splice(toolCards.length - 1, 0, <div key="placeholder-left" className="invisible" />);
    toolCards.push(<div key="placeholder-right" className="invisible" />);
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Teacher Tools</h1>
        <p className="text-textSecondary mb-6">AI-powered tools to enhance your teaching experience</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map((pill, idx) => (
            <button
              key={pill.value}
              onClick={() => setActiveFilter(pill.value)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors focus:outline-none ${activeFilter === pill.value ? 'bg-accentBlue text-background' : 'text-white bg-card hover:bg-[#181A20] hover:text-accentBlue'}`}
            >
              {pill.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {toolCards}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;