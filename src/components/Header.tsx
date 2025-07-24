import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, FileText, Home, BarChart3, Users } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Tools', path: '/', icon: GraduationCap },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Dashboard', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <header className="bg-[#23262F] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-accentBlue" />
              <span className="text-2xl font-extrabold text-white tracking-tight">AI Tutor Tools</span>
            </Link>
          </div>
          <nav className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors focus:outline-none text-base ${isActive ? 'bg-accentBlue text-background shadow' : 'text-white hover:bg-[#181A20] hover:text-accentBlue'}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;