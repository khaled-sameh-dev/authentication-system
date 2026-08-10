import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../schemas/reset-password.schema";

export interface ResetPasswordFormProps {
  isPending: boolean;
  onSubmit: (data: ResetPasswordInput) => void;
}

const ResetPasswordForm = ({ isPending, onSubmit }: ResetPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="password"
        type="password"
        label="New password"
        placeholder="Enter new password..."
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" loading={isPending} className="w-full mt-4">
        Reset password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
