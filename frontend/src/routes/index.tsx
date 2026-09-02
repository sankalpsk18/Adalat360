import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Landmark, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ROLES, type Role } from "@/lib/api";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DemoDataBadge } from "@/components/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — ADALAT360 Evidence & Records" },
      {
        name: "description",
        content:
          "Secure role-based sign-in for the ADALAT360 digital document and evidence management prototype.",
      },
      { property: "og:title", content: "Sign in — ADALAT360 Evidence & Records" },
      {
        property: "og:description",
        content: "Role-based access to hash-chained case records, custody ledgers and conflict-aware search.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useSession();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("investigating_officer");
  const [id, setId] = useState("RD-4417");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2">
          <Landmark className="size-6 text-accent" />
          <span className="text-lg font-semibold tracking-tight text-white">ADALAT360</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight text-white">
            Tamper-evident custody for legal and investigation records.
          </h1>
          <ul className="mt-6 space-y-3 text-sm opacity-80">
            <li className="flex gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
              Every record carries a SHA-256 hash and a hash-chained custody trail.
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
              Nothing is overwritten — every edit becomes a new, diffable version.
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
              Search surfaces conflicts and uncertainty instead of one confident answer.
            </li>
          </ul>
        </div>
        <p className="data-mono text-[11px] opacity-50">
          SIH26190 · Blockchain &amp; Cybersecurity · design prototype
        </p>
      </div>

      <div className="flex items-center justify-center p-6">
        <form
          className="w-full max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            signIn(role);
            navigate({ to: "/dashboard" });
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Officer sign-in</h2>
              <p className="mt-1 text-sm text-muted-foreground">Access-controlled system. Activity is logged.</p>
            </div>
            <DemoDataBadge />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="svc" className="text-xs">
                Service / Bar ID
              </Label>
              <Input
                id="svc"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="data-mono mt-1"
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="pwd" className="text-xs">
                Passphrase
              </Label>
              <Input id="pwd" type="password" defaultValue="demo-passphrase" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Sign in as role (demo)</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {ROLES.find((r) => r.id === role)!.access}
              </p>
            </div>

            <Button type="submit" className="w-full">
              <Lock className="size-4" /> Sign in
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Prototype only — synthetic data, no real case material, no live government integration.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
