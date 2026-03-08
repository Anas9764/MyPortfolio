import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Briefcase, X, Save } from 'lucide-react';
import { getPortfolioData, addItem, updateItem, deleteItem, reorderItems } from '../api';
import { Reorder } from 'framer-motion';

const ExperienceManagement = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    date: '',
    desc: '',
    skills: '',
    img: ''
  });

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const { data } = await getPortfolioData();
      setExperience(data.experiences || []);
    } catch (err) {
      console.error('Failed to fetch experience');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (exp = null) => {
    if (exp) {
      setEditingId(exp._id);
      setFormData({
        role: exp.role,
        company: exp.company,
        date: exp.date,
        desc: exp.desc,
        skills: exp.skills?.join(', ') || '',
        img: exp.img
      });
    } else {
      setEditingId(null);
      setFormData({ role: '', company: '', date: '', desc: '', skills: '', img: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
    };
    try {
      if (editingId) {
        await updateItem('experiences', editingId, processedData);
      } else {
        await addItem('experiences', processedData);
      }
      setIsModalOpen(false);
      fetchExperience();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleReorder = async (newOrder) => {
    setExperience(newOrder);
    try {
      const orders = newOrder.map((exp, index) => ({ _id: exp._id, priority: index }));
      await reorderItems('experiences', orders);
    } catch (err) {
      console.error('Failed to update order');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience entry?')) {
      try {
        await deleteItem('experiences', id);
        fetchExperience();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Experience Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all"
        >
          <Plus size={20} />
          Add Experience
        </button>
      </div>

      <Reorder.Group axis="y" values={experience} onReorder={handleReorder} className="space-y-4">
        {experience.map((exp) => (
          <Reorder.Item key={exp._id} value={exp}>
            <div className="bg-[#171721] p-6 rounded-2xl border border-white/5 flex gap-6 items-start hover:border-purple-500/30 transition-all group cursor-grab active:cursor-grabbing">
              <div className="w-16 h-16 bg-[#030014] rounded-xl flex items-center justify-center border border-white/10 shrink-0 overflow-hidden">
                {exp.img ? <img src={exp.img} alt={exp.company} className="w-10 h-10 object-contain" /> : <Briefcase className="text-gray-500" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{exp.role}</h3>
                    <p className="text-purple-400 font-medium">{exp.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(exp)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(exp._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{exp.date}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {exp.skills?.map((skill, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-3 leading-relaxed">{exp.desc}</p>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171721] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Experience' : 'Add New Experience'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Role / Position</label>
                  <input 
                    required
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Company</label>
                  <input 
                    required
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Date Range (e.g., May 2025 - Present)</label>
                  <input 
                    required
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Skills (comma separated)</label>
                  <input 
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="React, Node, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Icon URL / Base64</label>
                <input 
                  className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                  value={formData.img}
                  onChange={(e) => setFormData({...formData, img: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
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
                  {editingId ? 'Update Experience' : 'Add Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceManagement;
