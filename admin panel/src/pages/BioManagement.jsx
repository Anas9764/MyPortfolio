import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import { getPortfolioData, updateBio } from '../api';

const BioManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    roles: '',
    description: '',
    github: '',
    resume: '',
    linkedin: '',
    twitter: '',
    insta: '',
    facebook: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const { data } = await getPortfolioData();
        if (data.bio) {
          setFormData({
            ...data.bio,
            roles: data.bio.roles.join(', '),
          });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load bio data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchBio();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const updatedData = {
        ...formData,
        roles: formData.roles.split(',').map(role => role.trim()).filter(role => role !== ''),
      };
      await updateBio(updatedData);
      setMessage({ type: 'success', text: 'Bio updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update bio.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bio Management</h1>
      </div>

      {message.text && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#171721] p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Full Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Roles (Comma separated)</label>
            <input 
              name="roles" 
              value={formData.roles} 
              onChange={handleChange}
              className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Full Stack Developer, Designer..."
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors h-32"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">GitHub Link</label>
            <input 
              name="github" 
              value={formData.github} 
              onChange={handleChange}
              className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Resume Link</label>
            <input 
              name="resume" 
              value={formData.resume} 
              onChange={handleChange}
              className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">LinkedIn Link</label>
            <input 
              name="linkedin" 
              value={formData.linkedin} 
              onChange={handleChange}
              className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Profile Image URL</label>
            <input 
              name="image" 
              value={formData.image || ''} 
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {formData.image && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Image Preview</label>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500/50">
              <img src={formData.image} alt="Bio Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving Changes...' : 'Save Bio'}
        </button>
      </form>
    </div>
  );
};

export default BioManagement;
