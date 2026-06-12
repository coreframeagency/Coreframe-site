"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "@/components/brand/Wordmark";

const NAV_GROUPS = [
  {
    label: null,
    items: [{ href: "/admin", label: "Dashboard", exact: true }],
  },
  {
    label: "Documents",
    items: [
      { href: "/admin/invoices", label: "Invoices" },
      { href: "/admin/quotations", label: "Quotations" },
      { href: "/admin/documents/new", label: "New Document" },
    ],
  },
  {
    label: "Clients",
    items: [
      { href: "/admin/clients", label: "Clients" },
      { href: "/admin/projects", label: "Projects" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/pipeline", label: "Pipeline" },
      { href: "/admin/revenue", label: "Revenue" },
    ],
  },
  {
    label: "Settings",
    items: [{ href: "/admin/availability", label: "Availability" }],
  },
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
        {NAV_GROUPS.map((group) => (
          <div key={group.label ?? "root"} className="admin-sidebar__group">
            {group.label ? (
              <p className="admin-sidebar__group-label">{group.label}</p>
            ) : null}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar__link ${isActive(item.href, "exact" in item ? item.exact : false) ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <p className="admin-sidebar__user">Logged in as COREFRAME</p>
        <button type="button" className="admin-btn admin-btn--ghost admin-sidebar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
