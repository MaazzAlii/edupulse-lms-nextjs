import mongoose, { Model } from "mongoose";
import { connectDB } from "@/lib/db";

export interface MonthlyMetric {
  month: string; // e.g. "Sep 2025"
  count: number;
  revenue: number;
}

/**
 * Aggregates monthly metric counts and revenue over the last 12 months
 * filling in zero-activity months automatically.
 */
export async function getLast12MonthsData(
  model: Model<any>,
  dateField: string,
  matchFilter: Record<string, any> = {}
): Promise<MonthlyMetric[]> {
  await connectDB();

  const now = new Date();
  // Start date = 11 months ago on the 1st of that month
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const aggregateResult = await model.aggregate([
    {
      $match: {
        [dateField]: { $gte: twelveMonthsAgo },
        ...matchFilter,
      },
    },
    {
      $group: {
        _id: {
          year: { $year: `$${dateField}` },
          month: { $month: `$${dateField}` },
        },
        count: { $sum: 1 },
        revenue: { $sum: "$amount" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  // Create lookup map keyed by "YYYY-M"
  const statsMap: Record<string, { count: number; revenue: number }> = {};
  aggregateResult.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    statsMap[key] = {
      count: item.count || 0,
      revenue: item.revenue || 0,
    };
  });

  const monthsData: MonthlyMetric[] = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Fill 12 monthly slots
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const year = d.getFullYear();
    const monthIdx = d.getMonth();
    const key = `${year}-${monthIdx + 1}`;
    const label = `${monthNames[monthIdx]} ${year.toString().slice(-2)}`;

    const found = statsMap[key] || { count: 0, revenue: 0 };
    monthsData.push({
      month: label,
      count: found.count,
      revenue: Math.round(found.revenue * 100) / 100,
    });
  }

  return monthsData;
}
