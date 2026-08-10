import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterInput } from "../schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import { Link } from "react-router";

export interface RegisterFormProps {
  isPending: boolean;
  onSubmit: (data: RegisterInput) => void;
}

const RegisterForm = ({ isPending, onSubmit }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="name"
        label="Full Name"
        placeholder="Enter your name..."
        error={errors.name?.message} // 2. ربط الخطأ بالحقل الصحيح
        {...register("name")}
      />
      <Input
        id="email"
        label="Email"
        placeholder="Enter your email address..."
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Enter password..."
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" loading={isPending} className="w-full mt-4">
        Submit
      </Button>

      <div className="text-center text-sm text-slate-600 mt-4">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-emerald-600 hover:underline"
        >
          Login
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
