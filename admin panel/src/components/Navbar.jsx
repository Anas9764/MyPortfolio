import React from 'react';
import { LogOut, Menu } from 'lucide-react';

const Navbar = ({ setIsAuthenticated, toggleSidebar }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-[#171721]/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-300 hidden sm:block">Management Console</h2>
      </div>
      
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
};

export default Navbar;
