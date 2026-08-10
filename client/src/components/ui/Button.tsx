import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { LoaderCircle } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ButtonVariants";


export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
          }),
          className,
        )}
        {...props}
      >
        {loading ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <>
            {leftIcon && (
              <span className="mr-2 flex items-center">{leftIcon}</span>
            )}

            {children}

            {rightIcon && (
              <span className="ml-2 flex items-center">{rightIcon}</span>
            )}
          </>
        )}
      </button>
    );
  },
);

export default Button;
