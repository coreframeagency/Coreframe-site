import { Suspense } from "react";
import AdminLoginPage from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="admin-login" />}>
      <AdminLoginPage />
    </Suspense>
  );
}
