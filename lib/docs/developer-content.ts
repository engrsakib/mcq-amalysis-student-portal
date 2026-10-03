import type { ProseSection } from "@/lib/docs/founder-content";

export const DEVELOPER_SECTIONS: ProseSection[] = [
  {
    id: "team",
    title: "Engineering approach",
    paragraphs: [
      "The MCQ Analysis student portal is built as a modern web application with a mobile-first layout, fast navigation, and secure authenticated APIs for exams and profile data.",
      "We focus on predictable performance during timed exams, accessible forms, and SEO-friendly public documentation so new students can discover the platform before they register.",
    ],
  },
  {
    id: "stack",
    title: "Tech stack",
    paragraphs: ["Core technologies powering this student web app:"],
    bullets: [
      "Next.js 16 (App Router) with React 19",
      "TypeScript for end-to-end type safety",
      "Tailwind CSS 4 with brand design tokens",
      "REST APIs with JWT session cookies and refresh flow",
      "KaTeX for math-rich question rendering",
      "Cloudinary for profile image uploads",
    ],
  },
  {
    id: "quality",
    title: "Quality & security",
    paragraphs: [
      "Auth middleware protects dashboard routes while public docs and login remain reachable to guests and search engines.",
      "Password changes, token refresh, and exam submissions go through validated API contracts with clear error messages for students.",
    ],
    bullets: [
      "HTTPS-only production deployment",
      "HttpOnly cookies for session tokens where applicable",
      "Client-side validation plus server-side enforcement",
    ],
  },
  {
    id: "roadmap",
    title: "What we are improving",
    paragraphs: [
      "We iterate on scroll performance, exam UX, analytics dashboards, and public documentation. Android and web share the same preparation philosophy with platform-specific optimizations.",
    ],
  },
];
