"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "@/components/brand/Wordmark";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/quotations", label: "Quotations" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/documents/new", label: "New Document" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <Wordmark />
      </div>
      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-sidebar__link ${isActive(item.href, item.exact) ? "is-active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <p className="admin-sidebar__user">Logged in as COREFRAME</p>
        <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
