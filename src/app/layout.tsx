import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "../components/layout/MainLayout";
import AuthProvider from "../components/providers/AuthProvider";
import BootstrapProvider from "../components/providers/BootstrapProvider";
import NewsProvider from "../providers/NewsProvider";

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
        <AuthProvider>
          <BootstrapProvider>
            <NewsProvider>
              <MainLayout>{children}</MainLayout>
            </NewsProvider>
          </BootstrapProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
