import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRAVEEN AI — Your 24/7 Personal AI Tutor",
  description:
    "Hyper-personalized AI teacher and exam preparation platform for Board, JEE, NEET, CUET, SSC, UPSC, Banking & Defence exams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-body antialiased">{children}</body>
    </html>
  );
}
