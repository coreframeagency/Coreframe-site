import { Suspense } from "react";
import AdminLoginPage from "./AdminLoginClient";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="admin-login" />}>
      <AdminLoginPage />
    </Suspense>
  );
}
