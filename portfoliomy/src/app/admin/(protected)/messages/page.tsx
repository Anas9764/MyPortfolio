"use client";

import { useState } from "react";
import {
  Mail,
  Trash2,
  Reply,
  MessageSquare,
  Clock,
  User,
  X,
  Send,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMessages,
  deleteMessage,
  replyMessage,
  getPortfolioData,
} from "@/lib/api-client";
import Skeleton from "@/components/admin/Skeleton";
import type { Message, PortfolioData } from "@/types/portfolio";

interface ReplyModalState {
  isOpen: boolean;
  msg: Message | null;
  subject: string;
  body: string;
}

export default function MessagesManagementPage() {
  const queryClient = useQueryClient();
  const [replyModal, setReplyModal] = useState<ReplyModalState>({
    isOpen: false,
    msg: null,
    subject: "",
    body: "",
  });

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: () => getMessages() as Promise<Message[]>,
  });

  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ["portfolio-data"],
    queryFn: () => getPortfolioData() as Promise<PortfolioData>,
  });

  const contactEmail =
    portfolio?.bio?.contactEmail || "anasqureshi.dev@gmail.com";

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["messages"] });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: invalidate,
    onError: () => alert("Delete failed"),
  });

  const replyMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => replyMessage(payload),
    onSuccess: () => {
      alert("Reply sent successfully!");
      setReplyModal({ isOpen: false, msg: null, subject: "", body: "" });
    },
    onError: (err: Error) => {
      alert(err.message || "Failed to send reply");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleReply = (msg: Message) => {
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

    setReplyModal({ isOpen: true, msg, subject, body });
  };

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModal.msg) return;

    replyMutation.mutate({
      to: replyModal.msg.email,
      subject: replyModal.subject,
      body: replyModal.body,
      replyTo: contactEmail,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <Skeleton width="300px" height="40px" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#171721] p-6 rounded-2xl border border-white/5 space-y-4"
            >
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
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="text-purple-500" />
          Messages ({messages.length})
        </h1>
        <p className="text-gray-400 mt-2">
          Manage inquiries submitted through your contact form.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-[#171721] rounded-2xl border border-white/5 p-12 text-center">
          <Mail className="mx-auto text-gray-600 mb-4" size={48} />
          <h2 className="text-xl font-medium text-gray-300">No messages yet</h2>
          <p className="text-gray-500 mt-2">
            When someone contacts you, their message will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-[#171721] rounded-2xl border border-white/5 p-6 hover:border-purple-500/30 transition-all flex flex-col gap-4"
            >
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
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleDateString()
                    : ""}
                </div>
              </div>

              <div className="bg-[#030014] p-4 rounded-xl border border-white/5 flex-1">
                <p className="text-sm font-semibold text-purple-400 mb-1">
                  Subject: {msg.subject}
                </p>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {msg.message}
                </p>
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
                  onClick={() => handleDelete(msg._id!)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {replyModal.isOpen && replyModal.msg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#171721] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0d0d14]">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Reply size={20} className="text-purple-500" />
                Reply to {replyModal.msg.name}
              </h2>
              <button
                onClick={() =>
                  setReplyModal({
                    isOpen: false,
                    msg: null,
                    subject: "",
                    body: "",
                  })
                }
                className="text-gray-400 hover:text-white transition-colors"
                disabled={replyMutation.isPending}
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
                <label className="text-sm font-medium text-gray-400">
                  Subject:
                </label>
                <input
                  type="text"
                  value={replyModal.subject}
                  onChange={(e) =>
                    setReplyModal((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Message:
                </label>
                <textarea
                  value={replyModal.body}
                  onChange={(e) =>
                    setReplyModal((prev) => ({ ...prev, body: e.target.value }))
                  }
                  className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors min-h-[250px] font-mono text-sm leading-relaxed"
                  required
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setReplyModal({
                      isOpen: false,
                      msg: null,
                      subject: "",
                      body: "",
                    })
                  }
                  className="w-full sm:w-auto px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
                  disabled={replyMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replyMutation.isPending}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Send size={18} />
                  {replyMutation.isPending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
