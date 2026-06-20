import mongoose, { Schema, models, model } from "mongoose";

const EducationSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    img: { type: String },
    school: { type: String, required: true },
    date: { type: String, required: true },
    grade: { type: String },
    desc: { type: String, required: true },
    degree: { type: String, required: true },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Education =
  models.Education || model("Education", EducationSchema);
