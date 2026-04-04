import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import GlobalUI from "@/components/GlobalUI";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EdTech CRM",
  description: "District sales & operations dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b]`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto min-w-0">
            {children}
          </main>
          <GlobalUI />
        </div>
      </body>
    </html>
  );
}
