import { ICourse, IUser, IOrder, INotification } from "@/types";

export const initialCourses: ICourse[] = [
  {
    id: "course-1",
    title: "Full-Stack Next.js 14 & TypeScript Mastery (2025 Edition)",
    slug: "nextjs-14-typescript-mastery",
    description: "Build industrial-level full-stack applications with Next.js 14 App Router, Server Actions, TypeScript, Tailwind CSS, Prisma, and Stripe payments from scratch.",
    category: "Web Development",
    level: "Intermediate",
    price: 89,
    estimatedPrice: 199,
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=1200&auto=format&fit=crop",
    tags: ["Next.js", "TypeScript", "React", "TailwindCSS", "Full Stack"],
    demoVideoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y",
    instructor: {
      name: "Alex Rivera",
      role: "Lead Full-Stack Architect & Ex-Google Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      bio: "10+ years building scalable web infrastructure and mentoring 50,000+ developers worldwide."
    },
    benefits: [
      "Master Next.js 14 App Router and Server Actions",
      "Full TypeScript typing from DB queries to UI state",
      "Stripe payment integration with webhooks and checkout",
      "Production deployment and caching optimization on Vercel"
    ],
    prerequisites: [
      "Basic understanding of JavaScript and React fundamentals",
      "Node.js installed on your computer"
    ],
    rating: 4.9,
    totalRatingsCount: 342,
    purchasedCount: 1420,
    isPublished: true,
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-02-15T10:00:00Z",
    sections: [
      {
        id: "sec-1",
        title: "Section 1: Architecture, Setup & Routing in Next.js 14",
        lessons: [
          {
            id: "les-1-1",
            title: "01. Introduction to Next.js 14 App Router Architecture",
            description: "Understand Server vs Client Components, rendering lifecycle, and directory layout.",
            videoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y?start=0",
            videoLengthMinutes: 24,
            isFreePreview: true,
            resources: [
              { title: "Architecture Cheat Sheet PDF", url: "https://nextjs.org/docs" }
            ],
            questions: [
              {
                id: "q-1",
                user: { name: "Sarah Jenkins", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
                question: "When should I choose Server Actions over Route Handlers?",
                createdAt: "2 days ago",
                questionReplies: [
                  {
                    id: "r-1",
                    user: { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop", role: "instructor" },
                    answer: "Use Server Actions for form submissions and mutations directly from UI components; use Route Handlers for external REST API consumers or webhooks.",
                    createdAt: "1 day ago"
                  }
                ]
              }
            ]
          },
          {
            id: "les-1-2",
            title: "02. Setting Up TypeScript, Tailwind & Strict Linters",
            description: "Scaffolding a bulletproof repository with custom aliases and design tokens.",
            videoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y?start=1600",
            videoLengthMinutes: 35,
            isFreePreview: false
          }
        ]
      },
      {
        id: "sec-2",
        title: "Section 2: Database Schema & Authentication with Redis Sessions",
        lessons: [
          {
            id: "les-2-1",
            title: "03. Designing Database Models & Mongoose Schemas",
            description: "User modeling, bcrypt password hashing, and indexes.",
            videoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y?start=6200",
            videoLengthMinutes: 48,
            isFreePreview: false
          },
          {
            id: "les-2-2",
            title: "04. JWT Authentication with Refresh Tokens and In-Memory Redis",
            description: "Implementing secure stateless sessions and silent token renewals.",
            videoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y?start=11500",
            videoLengthMinutes: 52,
            isFreePreview: false
          }
        ]
      },
      {
        id: "sec-3",
        title: "Section 3: Stripe Checkout & Admin Analytics",
        lessons: [
          {
            id: "les-3-1",
            title: "05. Stripe Payment Gateway & Dynamic Webhook Listeners",
            description: "End-to-end checkout with order fulfillment and receipt emails.",
            videoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y?start=22900",
            videoLengthMinutes: 40,
            isFreePreview: false
          }
        ]
      }
    ],
    reviews: [
      {
        id: "rev-1",
        user: { name: "David Miller", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
        rating: 5,
        comment: "The best full stack course I have taken. The explanation of Redis caching and App Router is top tier!",
        createdAt: "3 days ago"
      },
      {
        id: "rev-2",
        user: { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" },
        rating: 5,
        comment: "Crystal clear code structure and production ready concepts. Helped me build my company's portal.",
        createdAt: "1 week ago"
      }
    ]
  },
  {
    id: "course-2",
    title: "AI Engineer: Generative AI, LLMs & LangChain with Python",
    slug: "ai-engineer-generative-ai-langchain",
    description: "Master LLM orchestration, Retrieval Augmented Generation (RAG), Vector Databases (Pinecone/ChromaDB), and build autonomous AI agents.",
    category: "Artificial Intelligence",
    level: "All Levels",
    price: 99,
    estimatedPrice: 249,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop",
    tags: ["AI", "Python", "LangChain", "OpenAI", "RAG"],
    demoVideoUrl: "https://www.youtube.com/embed/bM7kZpC8rC4",
    instructor: {
      name: "Dr. Marcus Vance",
      role: "AI Research Scientist & Author",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
      bio: "Former OpenAI contributor focusing on enterprise agentic systems and neural architectures."
    },
    benefits: [
      "Build production RAG pipelines from scratch",
      "Deploy custom LLM agents with tool usage",
      "Vector embeddings and semantic search integration",
      "Fine-tuning open source models with HuggingFace"
    ],
    prerequisites: [
      "Basic Python programming experience",
      "Familiarity with REST APIs"
    ],
    rating: 4.95,
    totalRatingsCount: 512,
    purchasedCount: 2310,
    isPublished: true,
    createdAt: "2025-01-05T10:00:00Z",
    updatedAt: "2025-02-10T10:00:00Z",
    sections: [
      {
        id: "sec-2-1",
        title: "Section 1: Foundations of Transformers & Large Language Models",
        lessons: [
          {
            id: "les-2-1-1",
            title: "01. Attention Mechanism & Tokenization Explained Visually",
            description: "How transformers process tokens, embeddings, and context windows.",
            videoUrl: "https://www.youtube.com/embed/bM7kZpC8rC4",
            videoLengthMinutes: 38,
            isFreePreview: true
          }
        ]
      }
    ],
    reviews: [
      {
        id: "rev-2-1",
        user: { name: "Jason Lee", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop" },
        rating: 5,
        comment: "Mind-blowing depth into RAG and agent patterns. Absolutely recommended!",
        createdAt: "4 days ago"
      }
    ]
  },
  {
    id: "course-3",
    title: "UI/UX Design Masterclass: Figma to High-Fidelity Prototypes",
    slug: "ui-ux-design-figma-masterclass",
    description: "Learn modern interface design, typography hierarchy, micro-interactions, responsive auto-layout, and build design systems used by top tier tech products.",
    category: "UI/UX Design",
    level: "Beginner",
    price: 49,
    estimatedPrice: 129,
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
    tags: ["Figma", "UI Design", "UX Research", "Design Systems"],
    demoVideoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
    instructor: {
      name: "Sophia Martinez",
      role: "Principal Product Designer at Stripe",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
      bio: "Passionate about making beautiful, accessible, and delightful digital experiences."
    },
    benefits: [
      "Master Figma Auto-Layout 5.0 and Component Variants",
      "Build scalable Design Systems with tokenized variables",
      "Conduct user research and usability testing",
      "Create high-fidelity clickable prototypes with micro-animations"
    ],
    prerequisites: ["No previous design experience required!"],
    rating: 4.88,
    totalRatingsCount: 198,
    purchasedCount: 890,
    isPublished: true,
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-02-12T10:00:00Z",
    sections: [
      {
        id: "sec-3-1",
        title: "Section 1: Modern Visual Design Principles & Color Science",
        lessons: [
          {
            id: "les-3-1-1",
            title: "01. Contrast, Typography & Spatial Rhythm",
            description: "Understanding optical weights, whitespace, and visual gravity.",
            videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
            videoLengthMinutes: 30,
            isFreePreview: true
          }
        ]
      }
    ],
    reviews: []
  },
  {
    id: "course-4",
    title: "Docker, Kubernetes & Cloud DevOps on AWS (CI/CD Pipeline)",
    slug: "docker-kubernetes-devops-aws",
    description: "From containerizing microservices with Docker to multi-cluster orchestration with Kubernetes, Helm, Terraform, and automated GitHub Actions CI/CD pipelines.",
    category: "Cloud & DevOps",
    level: "Expert",
    price: 119,
    estimatedPrice: 299,
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1200&auto=format&fit=crop",
    tags: ["Docker", "Kubernetes", "AWS", "DevOps", "CI/CD"],
    demoVideoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo",
    instructor: {
      name: "Tariq Al-Mansoor",
      role: "Principal Cloud DevOps Architect",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
      bio: "Designed multi-region cloud infrastructures serving millions of concurrent requests."
    },
    benefits: [
      "Containerize complex multi-service applications",
      "Deploy and manage high-availability Kubernetes clusters (EKS)",
      "Automate infrastructure with Terraform & Helm",
      "Zero-downtime blue/green deployment workflows"
    ],
    prerequisites: ["Linux CLI basics and basic backend knowledge"],
    rating: 4.92,
    totalRatingsCount: 420,
    purchasedCount: 1850,
    isPublished: true,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-02-14T10:00:00Z",
    sections: [
      {
        id: "sec-4-1",
        title: "Section 1: Container Architecture with Docker",
        lessons: [
          {
            id: "les-4-1-1",
            title: "01. Docker Internals: Namespaces, Cgroups and Layers",
            description: "Understanding how containers isolate processes securely.",
            videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo",
            videoLengthMinutes: 45,
            isFreePreview: true
          }
        ]
      }
    ],
    reviews: []
  }
];

export const initialUser: IUser = {
  id: "user-1",
  name: "Maaz Ali",
  email: "maaz.ali@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
  role: "admin", // Toggleable between admin and user
  enrolledCourseIds: ["course-1"],
  completedLessonIds: ["les-1-1"],
  createdAt: "2025-01-01T12:00:00Z"
};

export const initialOrders: IOrder[] = [
  {
    id: "ord-9821",
    userId: "user-1",
    userName: "Maaz Ali",
    userEmail: "maaz.ali@example.com",
    courseId: "course-1",
    courseTitle: "Full-Stack Next.js 14 & TypeScript Mastery (2025 Edition)",
    amount: 89,
    paymentMethod: "Stripe",
    status: "Completed",
    createdAt: "2025-02-14T15:20:00Z"
  },
  {
    id: "ord-9822",
    userId: "user-2",
    userName: "Sarah Jenkins",
    userEmail: "sarah.j@example.com",
    courseId: "course-2",
    courseTitle: "AI Engineer: Generative AI, LLMs & LangChain with Python",
    amount: 99,
    paymentMethod: "Card",
    status: "Completed",
    createdAt: "2025-02-15T09:40:00Z"
  },
  {
    id: "ord-9823",
    userId: "user-3",
    userName: "Elena Rostova",
    userEmail: "elena.r@example.com",
    courseId: "course-1",
    courseTitle: "Full-Stack Next.js 14 & TypeScript Mastery (2025 Edition)",
    amount: 89,
    paymentMethod: "PayPal",
    status: "Completed",
    createdAt: "2025-02-16T18:12:00Z"
  }
];

export const initialNotifications: INotification[] = [
  {
    id: "notif-1",
    title: "New Course Purchase",
    message: "Elena Rostova purchased Full-Stack Next.js 14 Mastery for $89.",
    status: "unread",
    createdAt: "10 minutes ago"
  },
  {
    id: "notif-2",
    title: "New Question in Course",
    message: "Sarah Jenkins asked a question in Section 1: Server Actions vs Route Handlers.",
    status: "unread",
    createdAt: "2 hours ago"
  }
];
