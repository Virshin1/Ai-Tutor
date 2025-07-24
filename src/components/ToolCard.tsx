import React from 'react';
import { Link } from 'react-router-dom';
import { Star, DivideIcon as LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: typeof LucideIcon;
  category: string;
  path: string;
}

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isFavorite, onToggleFavorite }) => {
  const IconComponent = tool.icon;

  return (
    <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors group relative flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <IconComponent className="h-6 w-6 text-blue-500" />
        </div>
        
        {/* Favorite button - shows on hover or when favorited */}
        <div className={`absolute top-4 right-4 transition-opacity duration-200 ${
          isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <button
            onClick={onToggleFavorite}
            className="transition-all duration-200"
          >
            <Star 
              className={`h-5 w-5 transition-colors duration-200 ${
                isFavorite 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-slate-300 hover:text-yellow-400'
              }`} 
            />
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
      <p className="text-slate-300 text-sm mb-4 leading-relaxed flex-1">{tool.description}</p>
      <div className="flex-1 flex items-end">
      <Link
        to={tool.path}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors w-full justify-center"
      >
        Open Tool
      </Link>
      </div>
    </div>
  );
};

export default ToolCard;