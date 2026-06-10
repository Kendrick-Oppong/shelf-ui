import type { Metadata } from "next";
import { Bai_Jamjuree, Courier_Prime } from "next/font/google";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import "./globals.css";
import { RootProvider } from "fumadocs-ui/provider/next";

const fontSans = Bai_Jamjuree({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const courier = Courier_Prime({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Shelf UI — File UI Components for React",
    template: "%s · Shelf UI",
  },
  description:
    "Copy-paste file UI components for React. Upload, preview, manage, navigate — with first-class Supabase, S3, and Cloudinary support.",
  keywords: [
    "file upload",
    "react components",
    "shadcn",
    "file management",
    "dropzone",
    "supabase",
    "tailwind",
    "typescript",
  ],
  authors: [{ name: "Kendrick Oppong" }],
  creator: "Kendrick Oppong",
  metadataBase: new URL("https://shelfui.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shelfui.dev",
    title: "Shelf UI — File UI Components for React",
    description:
      "Copy-paste file UI components for React. Upload, preview, manage, navigate — with first-class Supabase, S3, and Cloudinary support.",
    siteName: "Shelf UI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelf UI — File UI Components for React",
    description:
      "Copy-paste file UI components for React. Upload, preview, manage, navigate.",
    creator: "@kendrickoppong",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${fontSans.variable} ${courier.variable} h-full antialiased`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem
        >
          <RootProvider theme={{ enabled: false }}>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
