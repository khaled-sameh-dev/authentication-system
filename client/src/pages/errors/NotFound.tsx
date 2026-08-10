import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="space-y-4 text-center py-16">
      <h1 className="text-2xl font-bold text-slate-900">404 — Not found</h1>
      <p className="text-sm text-slate-500">
        This page doesn't exist. Check the URL and try again.
      </p>
      <Link to="/" className="text-sm font-medium text-emerald-600 underline">
        Back to home
      </Link>
    </div>
  );
}
