import { type ReactNode } from "react";
import { Link, useLocation } from "react-router";

const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white px-4 py-6">
        <p className="mb-4 text-xs font-semibold uppercase text-slate-400">
          Admin
        </p>
        <nav className="space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                location.pathname === item.to
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
