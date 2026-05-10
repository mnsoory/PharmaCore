import React from "react";
import { AlertCircle, RefreshCw, ChevronLeft } from "lucide-react";

interface ErrorScreenProps {
  onRetry: () => void;
  resetLoading?: boolean;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ onRetry, resetLoading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-4">
      <div className="max-w-md w-full bg-card rounded-xl border border-border shadow-lg p-8 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
            <AlertCircle size={40} strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-card rounded-full flex items-center justify-center border border-border">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-ping" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-foreground tracking-tight mb-2">
          Connection Lost
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          We couldn't fetch your pharmacy data from the server. This might be a
          temporary network issue.
        </p>

        {/* Actions */}
        <div className="flex flex-col w-full gap-2">
          <button
            onClick={onRetry}
            className="w-full h-11 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          >
            <RefreshCw
              size={16}
              className={resetLoading ? "animate-spin" : ""}
            />
            Retry Connection
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full h-10 rounded-lg text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5 transition-colors hover:bg-muted"
          >
            <ChevronLeft size={16} />
            Go Back
          </button>
        </div>

        {/* Error code */}
        <p className="mt-6 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          Error Code: 500_INTERNAL_SERVER_ERROR
        </p>
      </div>
    </div>
  );
};

export default ErrorScreen;
