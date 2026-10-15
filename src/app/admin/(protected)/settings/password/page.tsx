import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default function PasswordSettingsPage() {
  return (
    <>
      <h1 className="admin-page-title">Password</h1>
      <ChangePasswordForm />
    </>
  );
}
