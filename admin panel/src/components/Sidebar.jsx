import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Code, Briefcase, GraduationCap, FolderSearch } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { title: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { title: 'Bio', path: '/bio', icon: <User size={20} /> },
    { title: 'Skills', path: '/skills', icon: <Code size={20} /> },
    { title: 'Experience', path: '/experience', icon: <Briefcase size={20} /> },
    { title: 'Education', path: '/education', icon: <GraduationCap size={20} /> },
    { title: 'Projects', path: '/projects', icon: <FolderSearch size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#171721] border-r border-white/10 flex flex-col pt-8">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Anas Portfolio
        </h1>
        <p className="text-xs text-gray-500">Admin Control Panel</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
