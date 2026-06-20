import mongoose, { Schema, models, model } from "mongoose";

const ExperienceSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    img: { type: String },
    role: { type: String, required: true },
    company: { type: String, required: true },
    date: { type: String, required: true },
    desc: { type: String, required: true },
    skills: [{ type: String }],
    priority: { type: Number, default: 0 },
    doc: { type: String },
  },
  { timestamps: true }
);

export const Experience =
  models.Experience || model("Experience", ExperienceSchema);
