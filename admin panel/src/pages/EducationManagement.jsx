import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, GraduationCap, X, Save } from 'lucide-react';
import { getPortfolioData, addItem, updateItem, deleteItem, reorderItems } from '../api';
import { Reorder } from 'framer-motion';
import Skeleton from '../components/Skeleton';

const EducationManagement = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    date: '',
    grade: '',
    desc: '',
    img: ''
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data } = await getPortfolioData();
      setEducation(data.education || []);
    } catch (err) {
      console.error('Failed to fetch education');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleOpenModal = (edu = null) => {
    if (edu) {
      setEditingId(edu._id);
      setFormData({
        school: edu.school,
        degree: edu.degree,
        date: edu.date,
        grade: edu.grade,
        desc: edu.desc,
        img: edu.img
      });
    } else {
      setEditingId(null);
      setFormData({ school: '', degree: '', date: '', grade: '', desc: '', img: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateItem('education', editingId, formData);
      } else {
        await addItem('education', formData);
      }
      setIsModalOpen(false);
      fetchEducation();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleReorder = async (newOrder) => {
    setEducation(newOrder);
    try {
      const orders = newOrder.map((edu, index) => ({ _id: edu._id, priority: index }));
      await reorderItems('education', orders);
    } catch (err) {
      console.error('Failed to update order');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await deleteItem('education', id);
        fetchEducation();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  if (loading) return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <Skeleton width="250px" height="40px" />
        <Skeleton width="150px" height="40px" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#171721] p-6 rounded-2xl border border-white/5 flex gap-6">
            <Skeleton width="64px" height="64px" borderRadius="rounded-xl" />
            <div className="flex-1 space-y-3">
              <Skeleton width="40%" height="24px" />
              <Skeleton width="25%" height="20px" />
              <Skeleton width="100%" height="40px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Education Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all"
        >
          <Plus size={20} />
          Add Education
        </button>
      </div>

      <Reorder.Group axis="y" values={education} onReorder={handleReorder} className="space-y-4">
        {education.map((edu) => (
          <Reorder.Item key={edu._id} value={edu}>
            <div className="bg-[#171721] p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 md:gap-6 items-start hover:border-purple-500/30 transition-all group cursor-grab active:cursor-grabbing">
              <div className="w-full sm:w-16 h-32 sm:h-16 bg-[#030014] rounded-xl flex items-center justify-center border border-white/10 shrink-0 overflow-hidden">
                {edu.img ? <img src={edu.img} alt={edu.school} className="w-10 h-10 object-contain" /> : <GraduationCap className="text-gray-500" />}
              </div>
              <div className="flex-1 space-y-1 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                  <div>
                    <h3 className="text-xl font-bold">{edu.school}</h3>
                    <p className="text-purple-400 font-medium">{edu.degree}</p>
                  </div>
                  <div className="flex gap-2 self-start">
                    <button 
                      onClick={() => handleOpenModal(edu)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(edu._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{edu.date} • {edu.grade || 'N/A'}</p>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{edu.desc}</p>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171721] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Education' : 'Add New Education'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">School / University</label>
                  <input 
                    required
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Degree</label>
                  <input 
                    required
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Date Range (e.g., 2019-2023)</label>
                  <input 
                    required
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Grade / CGPA</label>
                  <input 
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
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
                  {editingId ? 'Update Education' : 'Add Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationManagement;
