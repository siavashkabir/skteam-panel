import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SK Team | پنل مدیریت مرکزی",
  description: "سیستم مدیریت متمرکز فروشگاه‌های آنلاین",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-zinc-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
