import {
  Award,
  BarChart3,
  Book,
  BookOpen,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  Settings,
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
        id: "practice",
        label: "Practice",
        href: "#",
        icon: BookOpen,
        disabled: true,
      },
      {
        id: "results",
        label: "Results",
        href: "#",
        icon: BarChart3,
        disabled: true,
      },
      {
        id: "certificates",
        label: "Certificates",
        href: "#",
        icon: Award,
        disabled: true,
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: Settings,
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
