"use client";

import { useEffect, useState } from "react";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPortfolioData, updateBio } from "@/lib/api-client";
import Skeleton from "@/components/admin/Skeleton";
import type { PortfolioData } from "@/types/portfolio";

interface BioFormData {
  name: string;
  roles: string;
  description: string;
  github: string;
  resume: string;
  linkedin: string;
  twitter: string;
  insta: string;
  facebook: string;
  image: string;
  contactEmail: string;
}

const emptyForm: BioFormData = {
  name: "",
  roles: "",
  description: "",
  github: "",
  resume: "",
  linkedin: "",
  twitter: "",
  insta: "",
  facebook: "",
  image: "",
  contactEmail: "",
};

export default function BioManagementPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<BioFormData>(emptyForm);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { data, isLoading, isError } = useQuery<PortfolioData>({
    queryKey: ["portfolio-data"],
    queryFn: () => getPortfolioData() as Promise<PortfolioData>,
  });

  useEffect(() => {
    if (data?.bio) {
      setFormData({
        name: data.bio.name || "",
        roles: data.bio.roles?.join(", ") || "",
        description: data.bio.description || "",
        github: data.bio.github || "",
        resume: data.bio.resume || "",
        linkedin: data.bio.linkedin || "",
        twitter: data.bio.twitter || "",
        insta: data.bio.insta || "",
        facebook: data.bio.facebook || "",
        image: data.bio.image || "",
        contactEmail: data.bio.contactEmail || "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => updateBio(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-data"] });
      setMessage({ type: "success", text: "Bio updated successfully!" });
    },
    onError: () => {
      setMessage({ type: "error", text: "Failed to update bio." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    mutation.mutate({
      ...formData,
      roles: formData.roles
        .split(",")
        .map((role) => role.trim())
        .filter((role) => role !== ""),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton width="300px" height="40px" />
        <div className="bg-[#171721] p-8 rounded-2xl border border-white/5 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton width="100px" height="16px" />
              <Skeleton height="48px" />
            </div>
            <div className="space-y-2">
              <Skeleton width="100px" height="16px" />
              <Skeleton height="48px" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton width="100px" height="16px" />
            <Skeleton height="128px" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton width="100px" height="16px" />
                <Skeleton height="48px" />
              </div>
            ))}
          </div>
          <Skeleton width="150px" height="48px" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bio Management</h1>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-red-500/10 border-red-500/50 text-red-500">
          <AlertCircle size={20} />
          <p>Failed to load bio data.</p>
        </div>
      )}

      {message.text && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/50 text-green-500"
              : "bg-red-500/10 border-red-500/50 text-red-500"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p>{message.text}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#171721] p-8 rounded-2xl border border-white/5 space-y-6"
      >
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
            <label className="text-sm font-medium text-gray-400">
              Roles (Comma separated)
            </label>
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
          {(
            [
              ["github", "GitHub Link"],
              ["linkedin", "LinkedIn Link"],
              ["twitter", "Twitter Link"],
              ["insta", "Instagram Link"],
              ["facebook", "Facebook Link"],
              ["resume", "Resume Link"],
              ["image", "Profile Image URL"],
              ["contactEmail", "Contact Email (for Replies)"],
            ] as const
          ).map(([name, label]) => (
            <div key={name} className="space-y-2">
              <label className="text-sm font-medium text-gray-400">{label}</label>
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={
                  name === "image"
                    ? "https://example.com/image.jpg"
                    : name === "contactEmail"
                      ? "anasqureshi.dev@gmail.com"
                      : undefined
                }
                className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          ))}
        </div>

        {formData.image && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Image Preview</label>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500/50">
              <img
                src={formData.image}
                alt="Bio Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          <Save size={20} />
          {mutation.isPending ? "Saving Changes..." : "Save Bio"}
        </button>
      </form>
    </div>
  );
}
