import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Reply, MessageSquare, Clock, User, X, Send } from 'lucide-react';
import { getMessages, deleteMessage, replyMessage } from '../api';
import Skeleton from '../components/Skeleton';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactEmail, setContactEmail] = useState('anasqureshi.dev@gmail.com');
  const [replyModal, setReplyModal] = useState({ isOpen: false, msg: null, subject: '', body: '', loading: false });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages();
      setMessages(data);
      
      const portfolio = await getPortfolioData();
      if (portfolio.data?.bio?.contactEmail) {
        setContactEmail(portfolio.data.bio.contactEmail);
      }
    } catch (err) {
      console.error('Failed to fetch messages');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id);
        fetchMessages();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleReply = (msg) => {
    const subject = `Re: ${msg.subject}`;
    const body = 
      `Hi ${msg.name},\n\n` +
      `\n\n` +
      `Best regards,\n` +
      `Anas Qureshi\n` +
      `${contactEmail}\n\n` +
      `--- Original Message ---\n` +
      `From: ${msg.name} (${msg.email})\n` +
      `Subject: ${msg.subject}\n\n` +
      `${msg.message}`;
    
    setReplyModal({ isOpen: true, msg, subject, body, loading: false });
  };

  const sendReply = async (e) => {
    e.preventDefault();
    setReplyModal(prev => ({ ...prev, loading: true }));
    try {
      await replyMessage({
        to: replyModal.msg.email,
        subject: replyModal.subject,
        body: replyModal.body,
        replyTo: contactEmail
      });
      alert('Reply sent successfully!');
      setReplyModal({ isOpen: false, msg: null, subject: '', body: '', loading: false });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      if(replyModal.isOpen) setReplyModal(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <Skeleton width="300px" height="40px" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#171721] p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex gap-4">
              <Skeleton width="48px" height="48px" borderRadius="rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton width="60%" height="20px" />
                <Skeleton width="40%" height="16px" />
              </div>
            </div>
            <Skeleton width="100%" height="60px" />
            <div className="flex gap-2">
              <Skeleton width="80px" height="32px" />
              <Skeleton width="80px" height="32px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="text-purple-500" />
          Messages ({messages.length})
        </h1>
        <p className="text-gray-400 mt-2">Manage inquiries submitted through your contact form.</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-[#171721] rounded-2xl border border-white/5 p-12 text-center">
          <Mail className="mx-auto text-gray-600 mb-4" size={48} />
          <h2 className="text-xl font-medium text-gray-300">No messages yet</h2>
          <p className="text-gray-500 mt-2">When someone contacts you, their message will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-[#171721] rounded-2xl border border-white/5 p-6 hover:border-purple-500/30 transition-all flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{msg.name}</h3>
                    <p className="text-sm text-gray-400">{msg.email}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(msg.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="bg-[#030014] p-4 rounded-xl border border-white/5 flex-1">
                <p className="text-sm font-semibold text-purple-400 mb-1">Subject: {msg.subject}</p>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => handleReply(msg)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Reply size={16} />
                  Reply
                </button>
                <button 
                  onClick={() => handleDelete(msg._id)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#171721] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0d0d14]">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Reply size={20} className="text-purple-500" />
                Reply to {replyModal.msg.name}
              </h2>
              <button 
                onClick={() => setReplyModal({ isOpen: false, msg: null, subject: '', body: '', loading: false })}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={replyModal.loading}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={sendReply} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">To:</label>
                <input 
                  type="text" 
                  value={replyModal.msg.email} 
                  disabled
                  className="w-full p-2 bg-[#030014] border border-white/5 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Subject:</label>
                <input 
                  type="text" 
                  value={replyModal.subject} 
                  onChange={(e) => setReplyModal(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Message:</label>
                <textarea 
                  value={replyModal.body} 
                  onChange={(e) => setReplyModal(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors min-h-[250px] font-mono text-sm leading-relaxed"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setReplyModal({ isOpen: false, msg: null, subject: '', body: '', loading: false })}
                  className="px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
                  disabled={replyModal.loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={replyModal.loading}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Send size={18} />
                  {replyModal.loading ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MessagesManagement;
