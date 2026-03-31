import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataFlow AI | Enterprise Data Entry Automation",
  description: "Automate Data Entry with AI Accuracy. The complete suite for extracting structured data from any document format.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} min-h-screen bg-gray-50 antialiased`}>
      <body className="min-h-screen font-sans text-gray-900 bg-gray-50">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
