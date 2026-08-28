import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    await connectDB();
    const course = await Course.findById(id);

    if (!course) {
      return {
        title: "Course Not Found — EduPulse Academy",
        description: "The requested course could not be found in our catalog.",
      };
    }

    return {
      title: `${course.title} — EduPulse Academy`,
      description: course.description.slice(0, 160),
      openGraph: {
        title: course.title,
        description: course.description.slice(0, 160),
        images: course.thumbnailUrl ? [{ url: course.thumbnailUrl }] : [],
      },
    };
  } catch (err) {
    return {
      title: "Course Detail — EduPulse Academy",
      description: "Learn tech, coding, and engineering skills with EduPulse Academy.",
    };
  }
}

export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
