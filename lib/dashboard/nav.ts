import {
  Activity,
  Award,
  BarChart3,
  Book,
  BookOpen,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  Link2,
  User,
} from "lucide-react";
import type { NavGroup } from "@/lib/dashboard/types";

export const dashboardNavGroups: NavGroup[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        activeExact: true,
      },
      {
        id: "exams",
        label: "Exams",
        href: "/exam",
        icon: ClipboardList,
        activePathPrefix: "/exam",
      },
      {
        id: "book",
        label: "Book",
        href: "https://rkmri.co/SMT300Tee5IM/",
        icon: Book,
        external: true,
      },
      {
        id: "learning-materials",
        label: "Learning Materials",
        href: "/learning-materials",
        icon: BookOpen,
        activePathPrefix: "/learning-materials",
      },
      {
        id: "results",
        label: "Results",
        href: "/results",
        icon: BarChart3,
        activePathPrefix: "/results",
      },
      {
        id: "certificates",
        label: "Certificates",
        href: "/certificates",
        icon: Award,
        activePathPrefix: "/certificates",
      },
      {
        id: "activity",
        label: "Activity",
        href: "/activity",
        icon: Activity,
        activePathPrefix: "/activity",
      },
      {
        id: "important-links",
        label: "Important Links",
        href: "/important-links",
        icon: Link2,
        activePathPrefix: "/important-links",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        id: "settings",
        label: "Profile",
        href: "/settings",
        icon: User,
      },
      {
        id: "help",
        label: "Help",
        href: "#",
        icon: HelpCircle,
        disabled: true,
      },
    ],
  },
];
