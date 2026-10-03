import type { LucideIcon } from "lucide-react";
import {
  Code2,
  FileText,
  HelpCircle,
  ScrollText,
  Shield,
  UserCircle,
} from "lucide-react";

export type DocsNavLink = {
  href: string;
  label: string;
};

export const DOCS_HOME = "/docs";

export const DOCS_NAV_LINKS: DocsNavLink[] = [
  { href: DOCS_HOME, label: "Overview" },
  { href: "/docs/founder", label: "Founder" },
  { href: "/docs/developer", label: "Developer" },
  { href: "/docs/faq", label: "FAQ" },
  { href: "/docs/terms-condition", label: "Terms" },
  { href: "/docs/privacy-policy", label: "Privacy" },
];

export type DocsCardLink = DocsNavLink & {
  id: string;
  description: string;
  icon: LucideIcon;
};

export const DOCS_CARD_LINKS: DocsCardLink[] = [
  {
    id: "founder",
    href: "/docs/founder",
    label: "Founder & vision",
    description: "Mission, values, and why MCQ Analysis exists for students.",
    icon: UserCircle,
  },
  {
    id: "developer",
    href: "/docs/developer",
    label: "Developer & tech",
    description: "Engineering approach, stack, and how the platform is built.",
    icon: Code2,
  },
  {
    id: "faq",
    href: "/docs/faq",
    label: "FAQ",
    description: "Answers about exams, accounts, apps, and preparation tips.",
    icon: HelpCircle,
  },
  {
    id: "terms",
    href: "/docs/terms-condition",
    label: "Terms & conditions",
    description: "Rules for using the student portal and mobile app.",
    icon: ScrollText,
  },
  {
    id: "privacy",
    href: "/docs/privacy-policy",
    label: "Privacy policy",
    description: "How we handle your data and keep your account secure.",
    icon: Shield,
  },
  {
    id: "overview",
    href: DOCS_HOME,
    label: "Documentation hub",
    description: "Platform overview, stats, and feature highlights.",
    icon: FileText,
  },
];
