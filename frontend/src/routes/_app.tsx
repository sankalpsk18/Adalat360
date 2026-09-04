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

  console.log('[AppLayout] signedIn:', signedIn);

  useEffect(() => {
    console.log('[AppLayout] useEffect signedIn:', signedIn);
    if (!signedIn) {
      console.log('[AppLayout] Redirecting to /');
      navigate({ to: "/", replace: true });
    }
  }, [signedIn, navigate]);

  if (!signedIn) {
    console.log('[AppLayout] Returning null (not signed in)');
    return null;
  }

  console.log('[AppLayout] Rendering AppShell');
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
