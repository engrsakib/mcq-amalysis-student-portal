import type { ProseSection } from "@/lib/docs/founder-content";

export const PRIVACY_SECTIONS: ProseSection[] = [
  {
    id: "intro",
    title: "1. Introduction",
    paragraphs: [
      "This Privacy Policy explains how MCQ Analysis collects, uses, and protects information when you use our student web portal and Android application.",
    ],
  },
  {
    id: "collect",
    title: "2. Information we collect",
    paragraphs: ["We may collect the following categories of data:"],
    bullets: [
      "Account data: name, phone number, email (optional), profile photo",
      "Exam data: attempts, answers, scores, timing, and activity logs",
      "Device data: app version, push tokens (FCM) where enabled",
      "Technical data: IP address, browser type, and cookies for session security",
    ],
  },
  {
    id: "use",
    title: "3. How we use information",
    paragraphs: [
      "We use your data to authenticate you, deliver exams, show results and leaderboards, personalize mistake analysis, and improve platform reliability.",
    ],
  },
  {
    id: "share",
    title: "4. Sharing",
    paragraphs: [
      "We do not sell your personal information. We may share data with infrastructure providers (hosting, analytics, image CDN) under contracts that require appropriate safeguards, or when required by law.",
    ],
  },
  {
    id: "security",
    title: "5. Security",
    paragraphs: [
      "We use industry-standard measures including encrypted transport (HTTPS), secure cookies for sessions, and access controls on backend systems. No method is 100% secure; please use a strong password.",
    ],
  },
  {
    id: "rights",
    title: "6. Your choices",
    paragraphs: [
      "You can update profile fields in Settings, change your password, and request account-related support through official channels. You may uninstall the Android app and clear browser cookies to limit local data.",
    ],
  },
  {
    id: "children",
    title: "7. Children",
    paragraphs: [
      "The service is intended for exam-preparation students. If you believe a minor registered without appropriate consent, contact us to review the account.",
    ],
  },
  {
    id: "updates",
    title: "8. Policy updates",
    paragraphs: [
      "We may revise this policy. The effective date below reflects the latest version. Significant changes will be posted on this page.",
    ],
  },
];

export const PRIVACY_EFFECTIVE = "October 2026";
