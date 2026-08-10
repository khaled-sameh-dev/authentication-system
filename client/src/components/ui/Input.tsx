import { cn } from "@/lib/utils";

import { forwardRef, type ComponentPropsWithoutRef } from "react";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, type = "text", id, ...props },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm text-slate-700 font-medium block"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          className={cn(
            `flex w-full h-10 bg-transparent outline-none px-3 py-1.5 text-slate-900 border text-sm shadow-md rounded-md transition-colors duration-300 blacholder:text-slate-400 focus-visible::outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            error
              ? "border-destructive focus-visible:ring-destructive text-red-900"
              : "border-slate-300 focus-visible:border-emerald-500 focus-visible:ring-emerald-100",
            className,
          )}
          {...props}
        />

        {error && (
          <div className="text-destructive text-sm animate-pulse">{error}</div>
        )}

        {!error && helperText && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
      </div>
    );
  },
);
export default Input;
