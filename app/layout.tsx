import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { baseUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "MCQ Analysis — Student",
    template: "%s — MCQ Analysis",
  },
  description: "Student portal for MCQ Analysis",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full light", poppins.variable)}
      suppressHydrationWarning
    >
      <body className="flex h-full min-h-0 flex-col overflow-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
