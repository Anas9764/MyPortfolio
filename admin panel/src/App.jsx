import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import BioManagement from './pages/BioManagement';
import SkillsManagement from './pages/SkillsManagement';
import EducationManagement from './pages/EducationManagement';
import ExperienceManagement from './pages/ExperienceManagement';
import ProjectsManagement from './pages/ProjectsManagement';
import MessagesManagement from './pages/MessagesManagement';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-[#030014] text-white">
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
        
        <div className="flex-1 flex flex-col min-w-0">
          {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
          
          <main className="p-4 md:p-6 overflow-x-hidden">
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/bio" element={isAuthenticated ? <BioManagement /> : <Navigate to="/login" />} />
              <Route path="/skills" element={isAuthenticated ? <SkillsManagement /> : <Navigate to="/login" />} />
              <Route path="/projects" element={isAuthenticated ? <ProjectsManagement /> : <Navigate to="/login" />} />
              <Route path="/education" element={isAuthenticated ? <EducationManagement /> : <Navigate to="/login" />} />
              <Route path="/experience" element={isAuthenticated ? <ExperienceManagement /> : <Navigate to="/login" />} />
              <Route path="/messages" element={isAuthenticated ? <MessagesManagement /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
