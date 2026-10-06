import type {MetadataRoute} from "next";
export default function robots(): MetadataRoute.Robots {if (process.env.WADA_APP_MODE === "dashboard") return {rules: {userAgent: "*", disallow: "/"}}; return {rules: {userAgent: "*", allow: "/", disallow: ["/portal", "/portal-preview", "/login", "/auth", "/join/"]}, sitemap: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") + "/sitemap.xml"};}
