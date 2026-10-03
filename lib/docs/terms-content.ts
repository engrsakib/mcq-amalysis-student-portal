import type { ProseSection } from "@/lib/docs/founder-content";

export const TERMS_SECTIONS: ProseSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of terms",
    paragraphs: [
      "By accessing MCQ Analysis (web portal, Android app, or related services), you agree to these Terms & Conditions. If you do not agree, do not use the platform.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility & accounts",
    paragraphs: [
      "You must provide accurate registration information and keep your login credentials confidential. You are responsible for activity under your account.",
    ],
    bullets: [
      "One student account per verified phone number unless we approve otherwise",
      "Notify us promptly if you suspect unauthorized access",
      "We may suspend accounts that violate these terms or abuse the service",
    ],
  },
  {
    id: "use",
    title: "3. Acceptable use",
    paragraphs: [
      "MCQ Analysis is for personal exam preparation. You may not scrape content, share exam items publicly, circumvent timers or proctoring, or use automated tools to manipulate leaderboards.",
    ],
  },
  {
    id: "content",
    title: "4. Content & intellectual property",
    paragraphs: [
      "Questions, explanations, branding, and software are owned by MCQ Analysis or licensors. You receive a limited, non-transferable license to use materials for your own study.",
    ],
  },
  {
    id: "disclaimer",
    title: "5. Disclaimers",
    paragraphs: [
      "We strive for accuracy but do not guarantee that content matches every future official exam. Results and analytics are learning aids, not guarantees of selection in any recruitment process.",
    ],
  },
  {
    id: "changes",
    title: "6. Changes",
    paragraphs: [
      "We may update these terms. Continued use after changes are posted constitutes acceptance. Material changes will be reflected on this page with an updated effective date.",
    ],
  },
  {
    id: "contact",
    title: "7. Contact",
    paragraphs: [
      "For questions about these terms, contact MCQ Analysis through the official support channels listed in the student portal Important Links section.",
    ],
  },
];

export const TERMS_EFFECTIVE = "October 2026";
