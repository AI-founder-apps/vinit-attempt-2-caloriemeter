import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalorieMeter 🍕 — Snap, Scan, Know!",
  description: "Upload a photo of any food and instantly get a detailed calorie and nutritional breakdown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}