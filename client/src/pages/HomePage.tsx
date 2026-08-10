import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Link } from "react-router";

export default function HomePage() {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();


  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome, {user?.name}
      </h1>
      <p className="text-sm text-slate-500">
        Role: <span className="font-semibold">{user?.role.toUpperCase()}</span>{" "}
        · Email verified:{" "}
        <span className="font-semibold">{user?.isVerified ? "Yes" : "No"}</span>
      </p>

      <div className="flex gap-3">
        <Link
          to="/profile"
          className="text-sm font-medium text-emerald-600 underline"
        >
          Go to profile (role: {user?.role.toUpperCase()})
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          disabled={isPending}
          className="text-sm font-medium text-red-500 underline disabled:opacity-50"
        >
          {isPending ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );
}
