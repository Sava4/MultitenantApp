import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { getTenantId, getTenantBrand } from "./tenant/config";
import { VendorNav } from "@/components/VendorNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Get tenant branding at build/request time
const tenantId = getTenantId();
const brand = getTenantBrand(tenantId);

export const metadata: Metadata = {
  title: brand.appTitle,
  description: `${brand.appTitle} - Pipeline management`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* Apply theme overrides if configured */}
        {brand.themeOverrides && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                :root {
                  ${brand.themeOverrides.primary ? `--primary: ${brand.themeOverrides.primary};` : ""}
                  ${brand.themeOverrides.primaryForeground ? `--primary-foreground: ${brand.themeOverrides.primaryForeground};` : ""}
                }
              `,
            }}
          />
        )}
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={`${brand.appTitle} logo`}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-lg"
                    />
                  ) : (
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h1 className="text-lg font-bold leading-none text-primary">
                      {brand.appTitle}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Tenant: {tenantId}
                    </p>
                  </div>
                </div>
                <VendorNav />
              </div>
              <div className="flex items-center gap-3">
                {brand.poweredByLabel && (
                  <span className="text-xs text-muted-foreground">
                    {brand.poweredByLabel}
                  </span>
                )}
                <div className="rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30">
                  Vendor Portal
                </div>
              </div>
            </div>
          </header>
          <main className="container px-4 py-8">{children}</main>
          <footer className="border-t border-primary/20 bg-primary/5">
            <div className="container flex h-14 items-center justify-between px-4 text-sm text-muted-foreground">
              <p>© 2025 {brand.appTitle}. All rights reserved.</p>
              {brand.poweredByLabel && <p>{brand.poweredByLabel}</p>}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
