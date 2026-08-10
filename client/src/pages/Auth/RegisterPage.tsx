import { Card } from "@/components/ui/Card";
import { SocialButton } from "@/components/ui/SocialButton";
import { Divider } from "@/components/ui/Divider";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { useOAuthLogin } from "@/features/auth/hooks/useOAuthLogin";
import type { RegisterInput } from "@/features/auth/schemas/register.schema";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister();
  const { loginWithProvider } = useOAuthLogin();

  const handleRegister = (data: RegisterInput) => {
    registerUser(data);
  };

  return (
    <Card>
      <div className="mb-6 text-left">
        <h2 className="text-xl font-bold text-slate-900">Create an Account</h2>
        <p className="text-sm text-slate-500 mt-1">
          Join AuthShop to get started immediately
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

      <Divider text="Or register with email" />

      <RegisterForm onSubmit={handleRegister} isPending={isPending} />
    </Card>
  );
}
