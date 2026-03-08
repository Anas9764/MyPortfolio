import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ExternalLink, Code, X, Save } from 'lucide-react';
import { getPortfolioData, addItem, updateItem, deleteItem, reorderItems } from '../api';
import { Reorder } from 'framer-motion';
import Skeleton from '../components/Skeleton';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    category: 'web app',
    github: '',
    webapp: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await getPortfolioData();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingId(project._id);
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        tags: project.tags?.join(', ') || '',
        category: project.category,
        github: project.github || '',
        webapp: project.webapp || ''
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', image: '', tags: '', category: 'web app', github: '', webapp: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    };
    try {
      if (editingId) {
        await updateItem('projects', editingId, processedData);
      } else {
        await addItem('projects', processedData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleReorder = async (newOrder) => {
    setProjects(newOrder);
    try {
      const orders = newOrder.map((proj, index) => ({ _id: proj._id, priority: index }));
      await reorderItems('projects', orders);
    } catch (err) {
      console.error('Failed to update order');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteItem('projects', id);
        fetchProjects();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  if (loading) return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton width="300px" height="40px" />
          <Skeleton width="250px" height="20px" className="mt-2" />
        </div>
        <Skeleton width="160px" height="48px" borderRadius="rounded-xl" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#171721] p-6 rounded-2xl border border-white/5 flex gap-6">
            <Skeleton width="128px" height="80px" borderRadius="rounded-xl" />
            <div className="flex-1 space-y-3">
              <Skeleton width="30%" height="24px" />
              <Skeleton width="100%" height="40px" />
              <div className="flex gap-2">
                <Skeleton width="60px" height="20px" borderRadius="rounded-full" />
                <Skeleton width="60px" height="20px" borderRadius="rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-gray-400 mt-1">Manage cases, apps, and side projects.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="space-y-4">
        {projects.map((project) => (
          <Reorder.Item key={project._id} value={project}>
            <div className="bg-[#171721] p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 md:gap-6 items-start hover:border-purple-500/30 transition-all group cursor-grab active:cursor-grabbing">
              <div className="w-full sm:w-32 h-32 sm:h-20 bg-[#030014] rounded-xl flex items-center justify-center border border-white/10 shrink-0 overflow-hidden">
                {project.image ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" /> : <Code className="text-gray-500" />}
              </div>
              <div className="flex-1 space-y-1 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">{project.category}</span>
                      <h3 className="text-xl font-bold">{project.title}</h3>
                    </div>
                    <div className="flex gap-3 mt-1">
                      {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}><Code size={16} /></a>}
                      {project.webapp && <a href={project.webapp} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}><ExternalLink size={16} /></a>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(project); }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(project._id); }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags?.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-3 leading-relaxed line-clamp-2">{project.description}</p>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171721] border border-white/10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Project Title</label>
                  <input 
                    required
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Category</label>
                  <select 
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="web app">Web App</option>
                    <option value="android app">Android App</option>
                    <option value="machine learning">Machine Learning</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Github URL</label>
                  <input 
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.github}
                    onChange={(e) => setFormData({...formData, github: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Live Web App URL</label>
                  <input 
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.webapp}
                    onChange={(e) => setFormData({...formData, webapp: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Image URL</label>
                <input 
                  required
                  className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Tags (comma separated)</label>
                <input 
                  required
                  className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="React, Tailwind, Node.js"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingId ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;
