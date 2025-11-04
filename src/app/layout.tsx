import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduFinder - Find Your Perfect Educational Path",
  description: "Discover thousands of institutions, courses, and programs tailored to your goals and preferences. Compare options and read reviews to make the best choice for your education.",
  keywords: ["education", "university", "college", "courses", "comparison", "reviews"],
  authors: [{ name: "EduFinder Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "EduFinder - Find Your Perfect Educational Path",
    description: "Discover and compare educational institutions and courses worldwide",
    url: "https://edufinder.com",
    siteName: "EduFinder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduFinder - Find Your Perfect Educational Path",
    description: "Discover and compare educational institutions and courses worldwide",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
