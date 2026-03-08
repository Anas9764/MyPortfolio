import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Code, Briefcase, GraduationCap, FolderSearch, AlertCircle } from 'lucide-react';
import { getPortfolioData, getAnalytics } from '../api';
import Skeleton from '../components/Skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, analyticsRes] = await Promise.all([
          getPortfolioData(),
          getAnalytics()
        ]);
        
        const data = portfolioRes.data;
        const analytics = analyticsRes.data;
        
        const totalSkills = data.skills.reduce((acc, cat) => acc + cat.skills.length, 0);
        const statsData = [
          { label: 'Total Visits', value: `${analytics.totalVisits || 0}`, icon: <LayoutDashboard className="text-white" />, color: 'bg-indigo-500/10' },
          { label: 'Messages', value: analytics.messageCount || 0, icon: <AlertCircle className="text-pink-400" />, color: 'bg-pink-500/10' },
          { label: 'Projects', value: data.projects.length, icon: <FolderSearch className="text-green-400" />, color: 'bg-green-500/10' },
          { label: 'Skills', value: `${totalSkills}`, icon: <Code className="text-blue-400" />, color: 'bg-blue-500/10' },
        ];
        setStats(statsData);

        const formattedChartData = analytics.dailyVisits?.map(d => ({
          name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          visits: d.count
        })) || [];
        setChartData(formattedChartData);

      } catch (err) {
        setError('Failed to fetch dashboard metrics. Is the backend running?');
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton width="300px" height="40px" />
        <Skeleton width="400px" height="20px" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} height="120px" borderRadius="rounded-2xl" />
        ))}
      </div>
      <Skeleton height="300px" borderRadius="rounded-3xl" />
    </div>
  );

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

      <div className="bg-[#171721] p-6 rounded-3xl border border-white/5">
        <h2 className="text-xl font-bold mb-6">Visitor Analytics</h2>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} border="none" axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3a" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Not enough data to display chart
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
