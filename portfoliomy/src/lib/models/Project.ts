import mongoose, { Schema, models, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String },
    description: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, required: true },
    github: { type: String },
    webapp: { type: String },
    member: [
      {
        name: { type: String },
        img: { type: String },
        linkedin: { type: String },
        github: { type: String },
      },
    ],
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = models.Project || model("Project", ProjectSchema);
