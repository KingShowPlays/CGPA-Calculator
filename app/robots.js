export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/maintenance"],
      },
    ],
    sitemap: "https://cgpa-calculator-steel.vercel.app/sitemap.xml",
    host: "https://cgpa-calculator-steel.vercel.app",
  };
}
