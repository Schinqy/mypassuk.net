import { Loader2 } from "lucide-react";

export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center w-full h-48 ${className}`}>
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">Loading data...</p>
    </div>
  );
}
