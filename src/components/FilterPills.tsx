import React from 'react';

interface FilterPillsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Tools' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'plan', label: 'Plan' },
    { id: 'create', label: 'Create' },
    { id: 'support', label: 'Support' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterPills;