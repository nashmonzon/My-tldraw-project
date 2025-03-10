import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = fullScreen
    ? "absolute inset-0 flex flex-col items-center justify-center bg-white z-50"
    : "flex flex-col items-center justify-center p-4 bg-white";

  return (
    <div className={containerClasses}>
      <div className="absolute inset-0 bg-black opacity-50 z-40"></div>
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary z-50`}
      />
      {text && (
        <p className="text-sm text-muted-foreground mt-2 z-50">{text}</p>
      )}
    </div>
  );
}
