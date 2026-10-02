import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { baseUrl } from "@/lib/site";
import { rootSiteMetadata } from "@/lib/site/metadata";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  ...rootSiteMetadata,
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [{ url: "/icons.svg", type: "image/svg+xml" }],
    shortcut: "/icons.svg",
    apple: [{ url: "/icons.svg", type: "image/svg+xml" }],
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
