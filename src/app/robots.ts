import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all major search engines
      {
        userAgent: ["Googlebot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider", "YandexBot", "Sogou", "Exabot"],
        allow: "/",
        disallow: ["/admin", "/dashboard", "/auth/verify-email", "/api/", "/_next/"],
      },
      // Allow AI crawlers (for AI search visibility)
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "YouBot", "cohere-ai", "Applebot", "anthropic-ai"],
        allow: ["/", "/companies", "/company/", "/offer/", "/blog/", "/about", "/advertise", "/categories", "/catalogs"],
        disallow: ["/admin", "/dashboard", "/auth/", "/api/"],
      },
      // Allow social media crawlers (WhatsApp, Facebook, Twitter, LinkedIn, Instagram)
      {
        userAgent: [
          "facebookexternalhit",
          "Twitterbot",
          "LinkedInBot",
          "WhatsApp",
          "Slackbot",
          "TelegramBot",
          "Discordbot",
          "Pinterest",
          "Pinterestbot",
          "Snapchat",
        ],
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api/"],
      },
      // Default: allow all
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/auth/verify-email", "/api/", "/forms"],
      },
    ],
    sitemap: "https://consnect.rw/sitemap.xml",
    host: "https://consnect.rw",
  };
}
