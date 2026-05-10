import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-3 border-sidebar-primary/20" />
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-sidebar-primary animate-spin" />
        </div>

        {/* <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em] animate-pulse">
            Loading Data
          </p>
          <div className="flex gap-1 mt-3">
            <div className="w-1.5 h-1.5 bg-sidebar-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-sidebar-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-sidebar-primary rounded-full animate-bounce" />
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default LoadingScreen;