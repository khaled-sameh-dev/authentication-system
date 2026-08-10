import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        403 — Unauthorized
      </h1>
      <p className="text-sm text-slate-500">
        You don't have permission to view this page.
      </p>
      <Link to="/" className="text-sm font-medium text-emerald-600 underline">
        Back to home
      </Link>
    </div>
  );
}