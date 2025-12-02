"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@acme/ui/lib/cn";

const navItems = [
  { href: "/", label: "Pipelines" },
  { href: "/tenants", label: "Tenants" },
  { href: "/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
