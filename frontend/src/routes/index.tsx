import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Landmark, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth, ROLES, type Role, DEMO_CREDENTIALS } from '@/lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Sign in — ADALAT360 Evidence & Records' },
      { name: 'description', content: 'Secure role-based sign-in for the ADALAT360 digital document and evidence management prototype.' },
      { property: 'og:title', content: 'Sign in — ADALAT360 Evidence & Records' },
      { property: 'og:description', content: 'Role-based access to hash-chained case records, custody ledgers and conflict-aware search.' },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('investigating_officer');
  const [serviceBarId, setServiceBarId] = useState(DEMO_CREDENTIALS['investigating_officer'].serviceBarId);
  const [passphrase, setPassphrase] = useState(DEMO_CREDENTIALS['investigating_officer'].passphrase);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setServiceBarId(DEMO_CREDENTIALS[newRole].serviceBarId);
    setPassphrase(DEMO_CREDENTIALS[newRole].passphrase);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(role, serviceBarId, passphrase);
      toast.success(`Signed in as ${ROLES.find(r => r.id === role)?.label}`);
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

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
              Nothing is overwritten — every edit becomes a new, diffable version.
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
              Search surfaces conflicts and uncertainty instead of one confident answer.
            </li>
          </ul>
        </div>
        <p className="font-mono text-[11px] opacity-50">
          SIH26190 · Blockchain & Cybersecurity · design prototype
        </p>
      </div>

      <div className="flex items-center justify-center p-6">
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Officer sign-in</h2>
              <p className="mt-1 text-sm text-muted-foreground">Access-controlled system. Activity is logged.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="svc" className="text-xs">Service / Bar ID</Label>
              <Input
                id="svc"
                value={serviceBarId}
                onChange={(e) => setServiceBarId(e.target.value)}
                className="font-mono mt-1"
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="pwd" className="text-xs">Password</Label>
              <Input
                id="pwd"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="text-xs">Sign in as role (demo)</Label>
              <Select value={role} onValueChange={(v) => handleRoleChange(v as Role)} disabled={isLoading}>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              <Lock className="size-4" /> {isLoading ? 'Signing in...' : 'Sign in'}
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