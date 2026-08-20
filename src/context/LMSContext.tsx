"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  ICourse,
  IUser,
  IOrder,
  INotification,
  Category,
  IReview,
  IQuestion,
  IQuestionReply,
  IRegisterData,
} from "@/types";
import {
  initialCourses,
  initialUser,
  initialOrders,
  initialNotifications,
} from "@/data/mockCourses";

// Preloaded demo users for instant seamless testing
export const defaultDemoUsers: IUser[] = [
  {
    id: "user-1",
    name: "Maaz Ali (Student)",
    email: "student@edupulse.io",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    role: "user",
    enrolledCourseIds: ["course-1"],
    completedLessonIds: ["les-1-1"],
    createdAt: "2025-01-01T12:00:00Z",
  },
  {
    id: "user-admin",
    name: "Alex Rivera (Admin)",
    email: "admin@edupulse.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    role: "admin",
    enrolledCourseIds: ["course-1", "course-2"],
    completedLessonIds: ["les-1-1", "les-1-2"],
    createdAt: "2024-12-01T08:00:00Z",
  },
  {
    id: "user-2",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    role: "user",
    enrolledCourseIds: ["course-2"],
    completedLessonIds: [],
    createdAt: "2025-01-14T10:00:00Z",
  },
];

interface LMSContextType {
  courses: ICourse[];
  user: IUser | null;
  isAuthenticated: boolean;
  usersList: IUser[];
  orders: IOrder[];
  notifications: INotification[];
  cart: ICourse[];
  selectedCategory: Category | "All";
  searchQuery: string;
  isDarkMode: boolean;

  // Auth Actions & Modal
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "signup";
  openAuthModal: (tab?: "signin" | "signup", callback?: () => void) => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => { success: boolean; message: string };
  quickLoginAs: (preset: "student" | "admin" | "sarah") => void;
  register: (data: IRegisterData) => { success: boolean; message: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  toggleUserRole: () => void;

  // Navigation & Category
  setSelectedCategory: (cat: Category | "All") => void;
  setSearchQuery: (query: string) => void;
  toggleDarkMode: () => void;

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
  const [usersList, setUsersList] = useState<IUser[]>(defaultDemoUsers);
  const [user, setUser] = useState<IUser | null>(defaultDemoUsers[0]);
  const [orders, setOrders] = useState<IOrder[]>(initialOrders);
  const [notifications, setNotifications] = useState<INotification[]>(initialNotifications);
  const [cart, setCart] = useState<ICourse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");
  const authCallbackRef = useRef<(() => void) | null>(null);

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem("edupulse_courses");
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedUsersList = localStorage.getItem("edupulse_users_list");
      if (savedUsersList) {
        setUsersList(JSON.parse(savedUsersList));
      } else {
        setUsersList(defaultDemoUsers);
      }

      const savedUser = localStorage.getItem("edupulse_user");
      if (savedUser !== null) {
        setUser(savedUser === "guest" ? null : JSON.parse(savedUser));
      } else {
        setUser(defaultDemoUsers[0]); // Default to initial student
      }

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
      localStorage.setItem("edupulse_users_list", JSON.stringify(usersList));
      if (user) {
        localStorage.setItem("edupulse_user", JSON.stringify(user));
      } else {
        localStorage.setItem("edupulse_user", "guest");
      }
      localStorage.setItem("edupulse_orders", JSON.stringify(orders));
      localStorage.setItem("edupulse_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.warn("Could not save LMS state:", e);
    }
  }, [courses, user, usersList, orders, notifications, isInitialized]);

  // Auth Methods
  const openAuthModal = (tab: "signin" | "signup" = "signin", callback?: () => void) => {
    setAuthModalTab(tab);
    if (callback) {
      authCallbackRef.current = callback;
    } else {
      authCallbackRef.current = null;
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    authCallbackRef.current = null;
  };

  const executeAuthCallback = () => {
    if (authCallbackRef.current) {
      const cb = authCallbackRef.current;
      authCallbackRef.current = null;
      setTimeout(() => cb(), 100);
    }
  };

  const login = (email: string, _password?: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setUser(existing);
      setIsAuthModalOpen(false);
      
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Welcome Back!",
          message: `Logged in successfully as ${existing.name}.`,
          status: "unread",
          createdAt: "Just now",
        },
        ...prev,
      ]);

      executeAuthCallback();
      return { success: true, message: `Welcome back, ${existing.name}!` };
    }

    // If email not found, create a fast dynamic user so login never blocks
    const newUser: IUser = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0] || "Learner",
      email: cleanEmail,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      role: cleanEmail.includes("admin") ? "admin" : "user",
      enrolledCourseIds: ["course-1"],
      completedLessonIds: [],
      createdAt: new Date().toISOString(),
    };

    setUsersList((prev) => [newUser, ...prev]);
    setUser(newUser);
    setIsAuthModalOpen(false);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Signed In",
        message: `Signed in successfully as ${newUser.name}.`,
        status: "unread",
        createdAt: "Just now",
      },
      ...prev,
    ]);

    executeAuthCallback();
    return { success: true, message: `Welcome, ${newUser.name}!` };
  };

  const quickLoginAs = (preset: "student" | "admin" | "sarah") => {
    let targetUser: IUser | undefined;
    if (preset === "admin") {
      targetUser = usersList.find((u) => u.role === "admin") || defaultDemoUsers[1];
    } else if (preset === "sarah") {
      targetUser = usersList.find((u) => u.email === "sarah.j@example.com") || defaultDemoUsers[2];
    } else {
      targetUser = usersList.find((u) => u.email === "student@edupulse.io") || defaultDemoUsers[0];
    }

    if (targetUser) {
      setUser(targetUser);
      setIsAuthModalOpen(false);
      
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Profile Switched",
          message: `Active account: ${targetUser?.name} (${targetUser?.role?.toUpperCase()}).`,
          status: "unread",
          createdAt: "Just now",
        },
        ...prev,
      ]);

      executeAuthCallback();
    }
  };

  const register = (data: IRegisterData): { success: boolean; message: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setUser(existing);
      setIsAuthModalOpen(false);
      executeAuthCallback();
      return { success: true, message: "Account already exists — logged in directly!" };
    }

    const newUser: IUser = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      avatar:
        data.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      role: data.role || "user",
      enrolledCourseIds: [],
      completedLessonIds: [],
      createdAt: new Date().toISOString(),
    };

    setUsersList((prev) => [newUser, ...prev]);
    setUser(newUser);
    setIsAuthModalOpen(false);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Account Created",
        message: `Welcome to EduPulse LMS, ${newUser.name}!`,
        status: "unread",
        createdAt: "Just now",
      },
      ...prev,
    ]);

    executeAuthCallback();
    return { success: true, message: `Account created successfully for ${newUser.name}!` };
  };

  const logout = () => {
    setUser(null);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Signed Out",
        message: "You have signed out of your EduPulse account.",
        status: "unread",
        createdAt: "Just now",
      },
      ...prev,
    ]);
  };

  const switchUser = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (target) {
      setUser(target);
    }
  };

  const toggleUserRole = () => {
    if (!user) {
      quickLoginAs("admin");
      return;
    }
    const newRole: "admin" | "user" = user.role === "admin" ? "user" : "admin";
    const updated = { ...user, role: newRole };
    setUser(updated);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updated : u)));

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Role Toggled",
        message: `User role is now set to ${newRole.toUpperCase()} mode.`,
        status: "unread",
        createdAt: "Just now",
      },
      ...prev,
    ]);
  };

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

    // If user is not logged in, trigger auth modal with callback
    if (!user) {
      openAuthModal("signin", () => {
        enrollCourse(courseId, paymentMethod);
      });
      return false;
    }

    if (user.enrolledCourseIds.includes(courseId)) {
      return true; // Already enrolled
    }

    // 1. Update user enrolled list
    const updatedUser: IUser = {
      ...user,
      enrolledCourseIds: [...user.enrolledCourseIds, courseId],
    };
    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

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
    if (!user) {
      openAuthModal("signin");
      return;
    }
    const isCompleted = user.completedLessonIds.includes(lessonId);
    const newCompleted = isCompleted
      ? user.completedLessonIds.filter((id) => id !== lessonId)
      : [...user.completedLessonIds, lessonId];
    
    const updatedUser: IUser = { ...user, completedLessonIds: newCompleted };
    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return user ? user.completedLessonIds.includes(lessonId) : false;
  };

  const getCourseProgress = (courseId: string): number => {
    if (!user) return 0;
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
    if (!user) {
      openAuthModal("signin");
      return;
    }
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
    if (!user) {
      openAuthModal("signin");
      return;
    }
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
    if (!user) {
      openAuthModal("signin");
      return;
    }
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
        isAuthenticated: !!user,
        usersList,
        orders,
        notifications,
        cart,
        selectedCategory,
        searchQuery,
        isDarkMode,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        quickLoginAs,
        register,
        logout,
        switchUser,
        toggleUserRole,
        setSelectedCategory,
        setSearchQuery,
        toggleDarkMode,
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
