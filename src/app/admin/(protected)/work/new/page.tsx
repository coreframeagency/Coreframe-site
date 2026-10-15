import { EMPTY_WORK, WorkForm } from "@/components/admin/WorkForm";

export default function NewWorkPage() {
  return (
    <>
      <h1 className="admin-page-title">Add work</h1>
      <WorkForm initial={EMPTY_WORK} />
    </>
  );
}
