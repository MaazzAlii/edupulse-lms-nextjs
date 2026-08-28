import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edupulse.vercel.app";

  try {
    await connectDB();
    const courses = await Course.find({ isPublished: true }).select("_id updatedAt");

    const courseEntries: MetadataRoute.Sitemap = courses.map((course) => ({
      url: `${baseUrl}/courses/${course._id}`,
      lastModified: course.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      ...courseEntries,
    ];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}
