"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ICourse,
  IUser,
  IOrder,
  INotification,
  Category,
  IReview,
  IQuestion,
  IQuestionReply,
} from "@/types";
import {
  initialCourses,
  initialUser,
  initialOrders,
  initialNotifications,
} from "@/data/mockCourses";

interface LMSContextType {
  courses: ICourse[];
  user: IUser;
  orders: IOrder[];
  notifications: INotification[];
  cart: ICourse[];
  selectedCategory: Category | "All";
  searchQuery: string;
  isDarkMode: boolean;
  
  // Actions
  setSelectedCategory: (cat: Category | "All") => void;
  setSearchQuery: (query: string) => void;
  toggleDarkMode: () => void;
  toggleUserRole: () => void;
  
  // Course CRUD
  createCourse: (course: Omit<ICourse, "id" | "createdAt" | "updatedAt" | "rating" | "totalRatingsCount" | "purchasedCount">) => ICourse;
  updateCourse: (id: string, updatedFields: Partial<ICourse>) => void;
  deleteCourse: (id: string) => void;
  
  // Learning & Interaction
  enrollCourse: (courseId: string, paymentMethod?: "Stripe" | "Card" | "PayPal") => boolean;
  toggleLessonCompletion: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getCourseProgress: (courseId: string) => number;
  addReview: (courseId: string, rating: number, comment: string) => void;
  addQuestion: (courseId: string, sectionId: string, lessonId: string, questionText: string) => void;
  addQuestionReply: (courseId: string, sectionId: string, lessonId: string, questionId: string, answerText: string) => void;
  
  // Cart
  addToCart: (course: ICourse) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isCourseInCart: (courseId: string) => boolean;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<ICourse[]>(initialCourses);
  const [user, setUser] = useState<IUser>(initialUser);
  const [orders, setOrders] = useState<IOrder[]>(initialOrders);
  const [notifications, setNotifications] = useState<INotification[]>(initialNotifications);
  const [cart, setCart] = useState<ICourse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem("edupulse_courses");
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedUser = localStorage.getItem("edupulse_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedOrders = localStorage.getItem("edupulse_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedNotifs = localStorage.getItem("edupulse_notifications");
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    } catch (e) {
      console.warn("Could not load stored LMS state:", e);
    }
    setIsInitialized(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("edupulse_courses", JSON.stringify(courses));
      localStorage.setItem("edupulse_user", JSON.stringify(user));
      localStorage.setItem("edupulse_orders", JSON.stringify(orders));
      localStorage.setItem("edupulse_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.warn("Could not save LMS state:", e);
    }
  }, [courses, user, orders, notifications, isInitialized]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  const toggleUserRole = () => {
    setUser((prev) => ({
      ...prev,
      role: prev.role === "admin" ? "user" : "admin",
    }));
  };

  // Course CRUD
  const createCourse = (newCourseData: Omit<ICourse, "id" | "createdAt" | "updatedAt" | "rating" | "totalRatingsCount" | "purchasedCount">): ICourse => {
    const newCourse: ICourse = {
      ...newCourseData,
      id: `course-${Date.now()}`,
      rating: 5,
      totalRatingsCount: 1,
      purchasedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCourses((prev) => [newCourse, ...prev]);

    // Add admin notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Course Created",
        message: `Course "${newCourse.title}" was published by Admin.`,
        status: "unread",
        createdAt: "Just now",
      },
      ...prev,
    ]);

    return newCourse;
  };

  const updateCourse = (id: string, updatedFields: Partial<ICourse>) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id
          ? { ...course, ...updatedFields, updatedAt: new Date().toISOString() }
          : course
      )
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  // Enrollment & Payment
  const enrollCourse = (courseId: string, paymentMethod: "Stripe" | "Card" | "PayPal" = "Stripe"): boolean => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return false;

    if (user.enrolledCourseIds.includes(courseId)) {
      return true; // Already enrolled
    }

    // 1. Update user enrolled list
    setUser((prev) => ({
      ...prev,
      enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
    }));

    // 2. Increment course purchasedCount
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, purchasedCount: c.purchasedCount + 1 } : c
      )
    );

    // 3. Record order
    const newOrder: IOrder = {
      id: `ord-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      courseId: course.id,
      courseTitle: course.title,
      amount: course.price,
      paymentMethod,
      status: "Completed",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);

    // 4. Send admin notification
    const newNotif: INotification = {
      id: `notif-${Date.now()}`,
      title: "New Student Enrollment",
      message: `${user.name} enrolled in "${course.title}" for $${course.price}.`,
      status: "unread",
      createdAt: "Just now",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Remove from cart if present
    setCart((prev) => prev.filter((c) => c.id !== courseId));

    return true;
  };

  // Lesson Progress
  const toggleLessonCompletion = (lessonId: string) => {
    setUser((prev) => {
      const isCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = isCompleted
        ? prev.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      return { ...prev, completedLessonIds: newCompleted };
    });
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return user.completedLessonIds.includes(lessonId);
  };

  const getCourseProgress = (courseId: string): number => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;
    
    let totalLessons = 0;
    let completedInThisCourse = 0;

    course.sections.forEach((sec) => {
      sec.lessons.forEach((les) => {
        totalLessons++;
        if (user.completedLessonIds.includes(les.id)) {
          completedInThisCourse++;
        }
      });
    });

    if (totalLessons === 0) return 0;
    return Math.round((completedInThisCourse / totalLessons) * 100);
  };

  // Q&A and Reviews
  const addReview = (courseId: string, rating: number, comment: string) => {
    const newReview: IReview = {
      id: `rev-${Date.now()}`,
      user: {
        name: user.name,
        avatar: user.avatar,
      },
      rating,
      comment,
      createdAt: "Just now",
    };

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const updatedReviews = [newReview, ...c.reviews];
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));
        return {
          ...c,
          reviews: updatedReviews,
          rating: avgRating,
          totalRatingsCount: updatedReviews.length,
        };
      })
    );
  };

  const addQuestion = (
    courseId: string,
    sectionId: string,
    lessonId: string,
    questionText: string
  ) => {
    const newQuestion: IQuestion = {
      id: `q-${Date.now()}`,
      user: {
        name: user.name,
        avatar: user.avatar,
      },
      question: questionText,
      createdAt: "Just now",
      questionReplies: [],
    };

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          sections: c.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              lessons: s.lessons.map((l) => {
                if (l.id !== lessonId) return l;
                return {
                  ...l,
                  questions: [newQuestion, ...(l.questions || [])],
                };
              }),
            };
          }),
        };
      })
    );
  };

  const addQuestionReply = (
    courseId: string,
    sectionId: string,
    lessonId: string,
    questionId: string,
    answerText: string
  ) => {
    const newReply: IQuestionReply = {
      id: `rep-${Date.now()}`,
      user: {
        name: user.name,
        avatar: user.avatar,
        role: user.role === "admin" ? "instructor" : "student",
      },
      answer: answerText,
      createdAt: "Just now",
    };

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          sections: c.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              lessons: s.lessons.map((l) => {
                if (l.id !== lessonId) return l;
                return {
                  ...l,
                  questions: (l.questions || []).map((q) => {
                    if (q.id !== questionId) return q;
                    return {
                      ...q,
                      questionReplies: [...(q.questionReplies || []), newReply],
                    };
                  }),
                };
              }),
            };
          }),
        };
      })
    );
  };

  // Cart
  const addToCart = (course: ICourse) => {
    if (!cart.some((c) => c.id === course.id)) {
      setCart((prev) => [...prev, course]);
    }
  };

  const removeFromCart = (courseId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== courseId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isCourseInCart = (courseId: string) => {
    return cart.some((c) => c.id === courseId);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
  };

  return (
    <LMSContext.Provider
      value={{
        courses,
        user,
        orders,
        notifications,
        cart,
        selectedCategory,
        searchQuery,
        isDarkMode,
        setSelectedCategory,
        setSearchQuery,
        toggleDarkMode,
        toggleUserRole,
        createCourse,
        updateCourse,
        deleteCourse,
        enrollCourse,
        toggleLessonCompletion,
        isLessonCompleted,
        getCourseProgress,
        addReview,
        addQuestion,
        addQuestionReply,
        addToCart,
        removeFromCart,
        clearCart,
        isCourseInCart,
        markNotificationAsRead,
      }}
    >
      <div className={isDarkMode ? "dark" : ""}>{children}</div>
    </LMSContext.Provider>
  );
};

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error("useLMS must be used within an LMSProvider");
  }
  return context;
};
