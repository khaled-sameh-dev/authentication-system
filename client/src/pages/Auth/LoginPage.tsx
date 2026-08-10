// src/pages/Auth/LoginPage.tsx
import { Card } from "@/components/ui/Card";
import { SocialButton } from "@/components/ui/SocialButton";
import { Divider } from "@/components/ui/Divider";
import { useLogin } from "@/features/auth/hooks/useLogin";
import type { LoginInput } from "@/features/auth/schemas/login.schema";
import LoginForm from "@/features/auth/components/LoginForm";
import { useOAuthLogin } from "@/features/auth/hooks/useOAuthLogin";

export default function LoginPage() {
  const { mutate: loginUser, isPending } = useLogin();
  const { loginWithProvider } = useOAuthLogin();

  const handleLogin = (data: LoginInput) => {
    loginUser(data);
  };

  return (
    <Card>
      <div className="mb-6 text-left">
        <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500 mt-1">
          Log in to continue to AuthShop
        </p>
      </div>

      <div className="space-y-3">
        <SocialButton
          provider="google"
          onClick={() => loginWithProvider("google")}
        />
        <SocialButton
          provider="github"
          onClick={() => loginWithProvider("github")}
        />
      </div>

      <Divider text="Or log in with email" />

      <LoginForm onSubmit={handleLogin} isPending={isPending} />
    </Card>
  );
}
