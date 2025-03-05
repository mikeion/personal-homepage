import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "../components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Mike Ion | Academic & Developer",
  description: "Personal website of Mike Ion - Research, Teaching, Programming, and Consulting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth light">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
