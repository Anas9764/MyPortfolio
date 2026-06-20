"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPortfolioData, addItem, updateItem, deleteItem } from "@/lib/api-client";
import Skeleton from "@/components/admin/Skeleton";
import type { PortfolioData, SkillCategory, SkillItem } from "@/types/portfolio";

interface SkillFormData {
  title: string;
  skills: SkillItem[];
}

export default function SkillsManagementPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    title: "",
    skills: [],
  });

  const { data, isLoading } = useQuery<PortfolioData>({
    queryKey: ["portfolio-data"],
    queryFn: () => getPortfolioData() as Promise<PortfolioData>,
  });

  const categories = data?.skills || [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["portfolio-data"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        await updateItem("skills", editingId, formData);
      } else {
        await addItem("skills", formData);
      }
    },
    onSuccess: () => {
      setIsModalOpen(false);
      invalidate();
    },
    onError: () => alert("Operation failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem("skills", id),
    onSuccess: invalidate,
    onError: () => alert("Delete failed"),
  });

  const updateSkillMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => updateItem("skills", id, payload),
    onSuccess: invalidate,
    onError: () => alert("Delete failed"),
  });

  const handleOpenModal = (cat?: SkillCategory, addNewSkill = false) => {
    if (cat) {
      setEditingId(cat._id || null);
      const updatedSkills = cat.skills || [];
      setFormData({
        title: cat.title,
        skills: addNewSkill
          ? [...updatedSkills, { name: "", image: "" }]
          : updatedSkills,
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", skills: [] });
    }
    setIsModalOpen(true);
  };

  const handleAddSkillField = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: "", image: "" }],
    });
  };

  const handleRemoveSkillField = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleSkillChange = (
    index: number,
    field: keyof SkillItem,
    value: string
  ) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this skills category?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeleteSkillDirect = (category: SkillCategory, skillIndex: number) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${category.skills[skillIndex].name}"?`
      )
    ) {
      const updatedSkills = category.skills.filter((_, i) => i !== skillIndex);
      updateSkillMutation.mutate({
        id: category._id!,
        payload: { ...category, skills: updatedSkills },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <Skeleton width="250px" height="40px" />
          <Skeleton width="150px" height="40px" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#171721] p-6 rounded-2xl border border-white/5 space-y-6"
            >
              <Skeleton width="40%" height="28px" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} height="48px" borderRadius="rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Skills Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-[#171721] p-6 rounded-2xl border border-white/5 space-y-4 hover:border-purple-500/30 transition-all group"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-purple-400">
                {category.title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(category._id!)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {category.skills?.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-[#030014] rounded-xl border border-white/5 group/skill relative"
                >
                  {skill.image ? (
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <ImageIcon size={20} className="text-gray-500" />
                  )}
                  <span className="text-sm font-medium">{skill.name}</span>
                  <button
                    onClick={() => handleDeleteSkillDirect(category, idx)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/skill:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleOpenModal(category, true)}
                className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-purple-500/50 transition-all group/add"
              >
                <Plus
                  size={18}
                  className="group-hover/add:scale-110 transition-transform"
                />
                <span className="text-sm">Add Skill</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171721] border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    Category Title (e.g. Frontend, Backend)
                  </label>
                  <input
                    required
                    className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-400">
                      Skills in this Category
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSkillField}
                      className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300"
                    >
                      <Plus size={14} /> Add Skill
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-[#030014] rounded-2xl border border-white/5 space-y-3 relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillField(idx)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-500">
                            Skill Name
                          </label>
                          <input
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
                            value={skill.name}
                            onChange={(e) =>
                              handleSkillChange(idx, "name", e.target.value)
                            }
                            placeholder="e.g. React"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-500">
                            Icon URL / SVG
                          </label>
                          <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
                            value={skill.image}
                            onChange={(e) =>
                              handleSkillChange(idx, "image", e.target.value)
                            }
                            placeholder="URL or data:image/..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {formData.skills.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl text-gray-500">
                      No skills added yet. Click &quot;Add Skill&quot; to start.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-4 bg-[#171721]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {editingId ? "Update Category" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
