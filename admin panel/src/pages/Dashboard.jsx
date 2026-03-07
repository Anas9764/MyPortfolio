import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Code, Briefcase, GraduationCap, FolderSearch, AlertCircle } from 'lucide-react';
import { getPortfolioData } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getPortfolioData();
        const totalSkills = data.skills.reduce((acc, cat) => acc + cat.skills.length, 0);
        const statsData = [
          { label: 'Skills', value: `${totalSkills}+`, icon: <Code className="text-blue-400" />, color: 'bg-blue-500/10' },
          { label: 'Experiences', value: data.experiences.length, icon: <Briefcase className="text-purple-400" />, color: 'bg-purple-500/10' },
          { label: 'Projects', value: data.projects.length, icon: <FolderSearch className="text-green-400" />, color: 'bg-green-500/10' },
          { label: 'Education', value: data.education.length, icon: <GraduationCap className="text-orange-400" />, color: 'bg-orange-500/10' },
        ];
        setStats(statsData);
      } catch (err) {
        setError('Failed to fetch dashboard metrics. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Anas</h1>
        <p className="text-gray-400 mt-2">Here's a live overview of your portfolio data.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-[#171721] rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl border border-purple-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold">Dynamic Control</h2>
          <p className="text-gray-300 mt-4 leading-relaxed">
            Your dashboard is now connected to MongoDB Atlas. Any changes you make in the management sections will reflect instantly on your live portfolio.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Dashboard;
