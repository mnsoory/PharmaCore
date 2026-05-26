import React from "react";
import { ClipboardList } from "lucide-react";

const AuditLogsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track all system activity and user actions
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
            <ClipboardList className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-semibold text-foreground">
              Coming Soon
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              This page is currently under development and will be available in
              a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
