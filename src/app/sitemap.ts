import type {MetadataRoute} from "next";
import {publicPages} from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {if (process.env.WADA_APP_MODE === "dashboard") return []; const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; return ["", ...publicPages.filter(page => !["login", "privacy", "terms", "credits", "cookies"].includes(page))].map(page => ({url: base + "/" + page, alternates: {languages: {en: base + "/" + page, so: base + "/so" + (page ? "/" + page : "")}}}));}
