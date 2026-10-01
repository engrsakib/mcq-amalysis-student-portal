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
  title: "MCQ Analysis — Student",
  description: "Student portal for MCQ Analysis",
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
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
