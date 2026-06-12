import type { Metadata } from "next";
import { Wordmark } from "@/components/brand/Wordmark";
import { StartForm } from "@/components/start/StartForm";
import "../admin/admin.css";

export const metadata: Metadata = {
  title: "Start a Project",
  description: "Submit a project brief to COREFRAME. We map, design, build, and operate digital systems.",
};

export default function StartPage() {
  return (
    <div className="start-page">
      <div className="start-page__inner">
        <div style={{ marginBottom: 32 }}>
          <Wordmark />
        </div>
        <StartForm />
      </div>
    </div>
  );
}
