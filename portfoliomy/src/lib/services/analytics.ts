import { connectDB } from "@/lib/db/connect";
import { Analytics } from "@/lib/models";

export async function trackVisit() {
  await connectDB();
  const today = new Date().toISOString().split("T")[0];
  let stats = await Analytics.findOne();

  if (!stats) {
    stats = new Analytics({
      totalVisits: 1,
      dailyVisits: [{ date: today, count: 1 }],
    });
  } else {
    stats.totalVisits += 1;
    const dayIndex = stats.dailyVisits.findIndex(
      (d: { date: string }) => d.date === today
    );
    if (dayIndex !== -1) {
      stats.dailyVisits[dayIndex].count += 1;
    } else {
      stats.dailyVisits.push({ date: today, count: 1 });
    }
  }

  await stats.save();
  return stats;
}

export async function getAnalyticsStats() {
  await connectDB();
  const stats = await Analytics.findOne();
  const { Message } = await import("@/lib/models");
  const messageCount = await Message.countDocuments();
  return {
    ...(stats?.toObject() ?? { totalVisits: 0, dailyVisits: [] }),
    messageCount,
  };
}
