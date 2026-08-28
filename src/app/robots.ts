import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edupulse.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/courses/"],
      disallow: [
        "/admin/",
        "/dashboard",
        "/my-courses",
        "/wishlist",
        "/api/",
        "/certificate/",
        "/checkout/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
