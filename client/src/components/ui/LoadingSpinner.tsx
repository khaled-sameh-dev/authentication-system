import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({ size = 20, className }: LoadingSpinnerProps) => {
  return (
    <LoaderCircle
      size={size}
      className={cn("animate-spin text-primary", className)}
    />
  );
};

export default LoadingSpinner;
