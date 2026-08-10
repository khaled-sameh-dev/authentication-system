import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
      <p className="text-sm text-slate-500">
        Logged in as {user?.name} — role: {user?.role}
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">Total orders</p>
          <p className="text-xl font-bold text-slate-900">128</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">Revenue</p>
          <p className="text-xl font-bold text-slate-900">$8,420</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">Low stock items</p>
          <p className="text-xl font-bold text-slate-900">3</p>
        </div>
      </div>
    </div>
  );
}
