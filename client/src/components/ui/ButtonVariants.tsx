import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-xl",
    "font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-primary",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "select-none",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-hover",

        secondary:
          "bg-surface border border-border text-text hover:bg-surface-hover",

        outline:
          "border border-border bg-transparent hover:bg-surface",

        ghost:
          "bg-transparent hover:bg-surface",

        danger:
          "bg-danger text-white hover:brightness-110",
      },

      size: {
        sm: "h-9 px-3 text-sm",

        md: "h-11 px-5",

        lg: "h-12 px-6 text-base",

        icon: "h-11 w-11",
      },

      fullWidth: {
        true: "w-full",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);