"use client";

import { useState } from "react";

export function ClientPortalCopyButton({ clientId }: { clientId: string }) {
  const [copied, setCopied] = useState(false);

  async function copyPortalUrl() {
    const url = `${window.location.origin}/portal/${clientId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" className="admin-btn admin-btn--ghost" onClick={copyPortalUrl}>
      {copied ? "Copied!" : "View Client Portal →"}
    </button>
  );
}
