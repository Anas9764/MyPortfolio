import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Code, Briefcase, GraduationCap, FolderSearch, Mail, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { title: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { title: 'Bio', path: '/bio', icon: <User size={20} /> },
    { title: 'Skills', path: '/skills', icon: <Code size={20} /> },
    { title: 'Experience', path: '/experience', icon: <Briefcase size={20} /> },
    { title: 'Education', path: '/education', icon: <GraduationCap size={20} /> },
    { title: 'Projects', path: '/projects', icon: <FolderSearch size={20} /> },
    { title: 'Messages', path: '/messages', icon: <Mail size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-[#171721] border-r border-white/10 
        flex flex-col pt-8 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="px-6 mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Anas Portfolio
            </h1>
            <p className="text-xs text-gray-500">Admin Control Panel</p>
          </div>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-6">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              onClick={() => setIsOpen(false)}
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
    </>
  );
};

export default Sidebar;
