import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AdminNav } from "@/components/AdminNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Multi-tenant pipeline administration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                      <path d="M12 3v6" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold leading-none text-primary">Admin Dashboard</h1>
                    <p className="text-xs text-muted-foreground">Multi-tenant Platform</p>
                  </div>
                </div>
                <AdminNav />
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30">
                  System Admin
                </div>
              </div>
            </div>
          </header>
          <main className="container px-4 py-8">{children}</main>
          <footer className="border-t border-primary/20 bg-primary/5">
            <div className="container flex h-14 items-center justify-between px-4 text-sm text-muted-foreground">
              <p>© 2025 Admin Platform. All rights reserved.</p>
              <p>Multi-tenant Architecture Demo</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
