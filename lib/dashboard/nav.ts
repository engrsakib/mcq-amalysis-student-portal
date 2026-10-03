import {
  Activity,
  Award,
  BarChart3,
  Book,
  BookOpen,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  KeyRound,
  Link2,
  User,
} from "lucide-react";
import type { NavGroup } from "@/lib/dashboard/types";
import { PLAY_STORE_URL } from "@/lib/important-links/play-store";

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
        activeExact: true,
      },
      {
        id: "change-password",
        label: "Change password",
        href: "/settings/change-password",
        icon: KeyRound,
        activePathPrefix: "/settings/change-password",
      },
      {
        id: "help",
        label: "Help",
        href: "#",
        icon: HelpCircle,
        disabled: true,
      },
      {
        id: "play-store",
        label: "Get it on Google Play",
        href: PLAY_STORE_URL,
        external: true,
        variant: "playStoreBadge",
      },
    ],
  },
];
