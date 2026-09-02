import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { signedIn } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signedIn) navigate({ to: "/", replace: true });
  }, [signedIn, navigate]);

  if (!signedIn) return null;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
