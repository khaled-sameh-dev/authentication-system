import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import { Link } from "react-router";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/schemas/forgot-password.schema";

export interface ForgotPasswordFormProps {
  isPending: boolean;
  onSubmit: (data: ForgotPasswordInput) => void;
}

const ForgotPasswordForm = ({
  isPending,
  onSubmit,
}: ForgotPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="email"
        label="Email"
        placeholder="Enter your account email..."
        error={errors.email?.message}
        {...register("email")}
      />

      <Button type="submit" loading={isPending} className="w-full mt-4">
        Send reset link
      </Button>

      <div className="text-center text-sm text-slate-600 mt-4">
        <Link
          to="/login"
          className="font-semibold text-emerald-600 hover:underline"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
