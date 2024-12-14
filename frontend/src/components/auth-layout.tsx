import { Navigate, Outlet } from "react-router-dom";

export function AuthLayout() {
  const user = false;
  const isLoading = false;

  return isLoading ? (
    <div className="h-screen flex items-center justify-center">Loading</div>
  ) : user ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{
        redirectUrl: window.location.pathname,
      }}
    />
  );
}
