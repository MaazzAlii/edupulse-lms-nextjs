import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const checkoutSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID format"),
});

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(1, "Comment is required").max(2000, "Comment is too long"),
});

export const questionSchema = z.object({
  question: z.string().min(1, "Question text is required").max(3000, "Question is too long"),
});
