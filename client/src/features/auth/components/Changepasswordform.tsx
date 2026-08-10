import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "../schemas/change-password.schema";

export interface ChangePasswordFormProps {
  isPending: boolean;
  onSubmit: (
    data: ChangePasswordInput,
    helpers: { resetForm: () => void },
  ) => void;
}

const ChangePasswordForm = ({
  isPending,
  onSubmit,
}: ChangePasswordFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const submit = (data: ChangePasswordInput) => {
    onSubmit(data, { resetForm: reset });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <Input
        id="currentPassword"
        type="password"
        label="Current password"
        placeholder="Enter your current password..."
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <Input
        id="newPassword"
        type="password"
        label="New password"
        placeholder="Enter a new password..."
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <Input
        id="confirmNewPassword"
        type="password"
        label="Confirm new password"
        placeholder="Re-enter the new password..."
        error={errors.confirmNewPassword?.message}
        {...register("confirmNewPassword")}
      />

      <Button type="submit" loading={isPending} className="w-full mt-2">
        Update password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
