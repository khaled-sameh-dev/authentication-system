import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { ChangePasswordInput } from "@/features/auth/schemas/change-password.schema";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import ChangePasswordForm from "@/features/auth/components/Changepasswordform";


const getInitials = (name?: string): string => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { mutate: changePassword, isPending } = useChangePassword();

  const handleChangePassword = (
    data: ChangePasswordInput,
    { resetForm }: { resetForm: () => void },
  ) => {
    changePassword(data, {
      onSuccess: (response) => {
        toast.success(response.message ?? "Password updated successfully!");
        resetForm();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ??
            "Failed to update password. Please check your current password.",
        );
      },
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

      {/* Account info */}
      <div className="rounded-md border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
            {getInitials(user?.name)}
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">
              {user?.name}
            </p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm">
          <div>
            <p className="text-xs text-slate-400">Role</p>
            <p className="mt-0.5 font-medium capitalize text-slate-700">
              {user?.role}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Email status</p>
            <p className="mt-0.5">
              {user?.isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Not verified
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Change password
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose a strong password you don't use elsewhere.
          </p>
        </div>

        <ChangePasswordForm
          onSubmit={handleChangePassword}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
