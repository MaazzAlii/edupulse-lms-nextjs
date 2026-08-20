export type CourseLevel = "Beginner" | "Intermediate" | "Expert" | "All Levels";

export type Category = 
  | "Web Development"
  | "Artificial Intelligence"
  | "Data Science"
  | "Cloud & DevOps"
  | "UI/UX Design"
  | "Cybersecurity"
  | "Mobile App Dev";

export interface IQuestionReply {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: "student" | "instructor" | "admin";
  };
  answer: string;
  createdAt: string;
}

export interface IQuestion {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  question: string;
  questionReplies?: IQuestionReply[];
  createdAt: string;
}

export interface IReview {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ILesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoLengthMinutes: number;
  isFreePreview?: boolean;
  resources?: { title: string; url: string }[];
  questions?: IQuestion[];
}

export interface ISection {
  id: string;
  title: string;
  lessons: ILesson[];
}

export interface ICourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  level: CourseLevel;
  price: number;
  estimatedPrice: number;
  thumbnail: string;
  tags: string[];
  demoVideoUrl: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  benefits: string[];
  prerequisites: string[];
  sections: ISection[];
  reviews: IReview[];
  rating: number;
  totalRatingsCount: number;
  purchasedCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  createdAt: string;
}

export interface IOrder {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  paymentMethod: "Stripe" | "Card" | "PayPal";
  status: "Completed" | "Pending" | "Refunded";
  createdAt: string;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password?: string;
  role?: "user" | "admin";
  avatar?: string;
}
