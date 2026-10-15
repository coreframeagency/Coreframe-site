"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import Link from "next/link";

type WorkRow = {
  id: string;
  slug: string;
  name: string;
  url: string | null;
  tag: string;
  year: string;
  published: boolean;
  inDevelopment: boolean;
  sortOrder: number;
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function WorkList() {
  const [items, setItems] = useState<WorkRow[] | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [importing, setImporting] = useState(false);
  const dragId = useRef<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/work");
      setItems(res.ok ? ((await res.json()) as WorkRow[]) : []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function persistOrder(next: WorkRow[]) {
    setItems(next);
    setSaveState("saving");
    try {
      const res = await fetch("/api/admin/work/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((i) => i.id) }),
      });
      setSaveState(res.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }

  function move(index: number, delta: number) {
    if (!items) return;
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    void persistOrder(next);
  }

  function onDragStart(event: DragEvent<HTMLTableRowElement>, id: string) {
    dragId.current = id;
    event.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(event: DragEvent<HTMLTableRowElement>, id: string) {
    event.preventDefault();
    if (overId !== id) setOverId(id);
  }

  function onDrop(event: DragEvent<HTMLTableRowElement>, id: string) {
    event.preventDefault();
    setOverId(null);
    const from = dragId.current;
    dragId.current = null;
    if (!items || !from || from === id) return;
    const next = [...items];
    const fromIndex = next.findIndex((i) => i.id === from);
    const toIndex = next.findIndex((i) => i.id === id);
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    void persistOrder(next);
  }

  async function togglePublished(item: WorkRow) {
    if (!items) return;
    const nextValue = !item.published;
    setItems(items.map((i) => (i.id === item.id ? { ...i, published: nextValue } : i)));
    const res = await fetch(`/api/admin/work/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: nextValue }),
    });
    if (!res.ok) void load();
  }

  async function importExisting() {
    setImporting(true);
    try {
      await fetch("/api/admin/work/import", { method: "POST" });
      await load();
    } finally {
      setImporting(false);
    }
  }

  if (items === null) {
    return <p className="admin-work__hint">Loading…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="admin-work__empty">
        <p className="admin-work__hint">
          No work in the database yet. The public /work page is showing the built-in list.
          Import it once to manage everything from here.
        </p>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={importExisting}
          disabled={importing}
        >
          {importing ? "Importing…" : "Import current work"}
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="admin-work__hint">
        Drag rows or use the arrows to set the order on /work. Changes save instantly.
        <span className={`admin-work__save admin-work__save--${saveState}`}>
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Order saved."}
          {saveState === "error" && "Could not save order — refresh and retry."}
        </span>
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th aria-label="Drag handle" />
              <th>#</th>
              <th>Work</th>
              <th>Tag</th>
              <th>Year</th>
              <th>Status</th>
              <th>Order</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                draggable
                onDragStart={(e) => onDragStart(e, item.id)}
                onDragOver={(e) => onDragOver(e, item.id)}
                onDragLeave={() => setOverId((cur) => (cur === item.id ? null : cur))}
                onDrop={(e) => onDrop(e, item.id)}
                onDragEnd={() => setOverId(null)}
                className={`admin-work__row ${overId === item.id ? "is-drop-target" : ""} ${item.published ? "" : "is-hidden"}`}
              >
                <td className="admin-work__handle" title="Drag to reorder">
                  ⋮⋮
                </td>
                <td className="admin-table__mono">{String(index + 1).padStart(2, "0")}</td>
                <td>
                  <span className="admin-table__name">{item.name}</span>
                  {item.url ? <span className="admin-work__url">{item.url}</span> : null}
                </td>
                <td className="admin-table__mono">{item.tag}</td>
                <td className="admin-table__mono">{item.year}</td>
                <td>
                  <button
                    type="button"
                    className={`admin-work__status ${item.published ? "is-live" : ""}`}
                    onClick={() => togglePublished(item)}
                    title="Toggle visibility on /work"
                  >
                    {item.published ? "Live" : "Hidden"}
                  </button>
                  {item.inDevelopment ? <span className="admin-work__dev">In dev</span> : null}
                </td>
                <td>
                  <div className="admin-work__arrows">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-work__arrow"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${item.name} up`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-work__arrow"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label={`Move ${item.name} down`}
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  <Link href={`/admin/work/${item.id}`} className="admin-btn admin-btn--ghost">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
