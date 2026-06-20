import { connectDB } from "@/lib/db/connect";
import {
  Bio,
  Skill,
  Experience,
  Education,
  Project,
} from "@/lib/models";
import type { PortfolioResourceType, ReorderItem } from "@/types/portfolio";
import type { Model } from "mongoose";
import { serialize } from "@/lib/utils/serialize";

const models: Record<PortfolioResourceType, Model<unknown>> = {
  skills: Skill,
  experiences: Experience,
  education: Education,
  projects: Project,
};

export async function getPortfolioData() {
  await connectDB();
  const [bio, skills, experiences, education, projects] = await Promise.all([
    Bio.findOne().lean(),
    Skill.find().lean(),
    Experience.find().sort({ priority: 1, createdAt: -1 }).lean(),
    Education.find().sort({ priority: 1, createdAt: -1 }).lean(),
    Project.find().sort({ priority: 1, id: 1 }).lean(),
  ]);

  return serialize({ bio, skills, experiences, education, projects });
}

export async function updateBio(data: Record<string, unknown>) {
  await connectDB();
  return Bio.findOneAndUpdate({}, data, { new: true, upsert: true }).lean();
}

export async function addPortfolioItem(
  type: PortfolioResourceType,
  data: Record<string, unknown>
) {
  await connectDB();
  const Model = models[type];
  const count = await Model.countDocuments();
  const newItem = new Model({ ...data, id: count + 1 });
  await newItem.save();
  return newItem;
}

export async function updatePortfolioItem(
  type: PortfolioResourceType,
  id: string,
  data: Record<string, unknown>
) {
  await connectDB();
  const Model = models[type];
  return Model.findOneAndUpdate({ _id: id }, data, { new: true });
}

export async function deletePortfolioItem(
  type: PortfolioResourceType,
  id: string
) {
  await connectDB();
  const Model = models[type];
  await Model.findOneAndDelete({ _id: id });
  return { message: "Item deleted successfully" };
}

export async function reorderPortfolioItems(
  type: "experiences" | "projects" | "education",
  orders: ReorderItem[]
) {
  await connectDB();
  const Model = models[type];
  const updatePromises = orders.map((order) =>
    Model.findOneAndUpdate({ _id: order._id }, { priority: order.priority })
  );
  await Promise.all(updatePromises);
  return { message: "Order updated successfully" };
}

export function isValidResourceType(type: string): type is PortfolioResourceType {
  return type in models;
}

export function isReorderableType(
  type: string
): type is "experiences" | "projects" | "education" {
  return type === "experiences" || type === "projects" || type === "education";
}
