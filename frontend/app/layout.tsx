import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee Management | Gupio",
  description: "Manage your organization's employees efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
