import React from 'react';
import { LogOut } from 'lucide-react';

const Navbar = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <header className="h-16 px-6 bg-[#171721]/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-lg font-semibold text-gray-300">Management Console</h2>
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
};

export default Navbar;
