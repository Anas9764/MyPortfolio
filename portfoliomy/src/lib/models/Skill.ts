import mongoose, { Schema, models, model } from "mongoose";

const SkillSchema = new Schema(
  {
    id: { type: Number },
    title: { type: String, required: true },
    skills: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Skill = models.Skill || model("Skill", SkillSchema);
