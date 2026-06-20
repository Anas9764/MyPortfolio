import mongoose, { Schema, models, model } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    totalVisits: { type: Number, default: 0 },
    dailyVisits: [
      {
        date: { type: String, required: true },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Analytics =
  models.Analytics || model("Analytics", AnalyticsSchema);
