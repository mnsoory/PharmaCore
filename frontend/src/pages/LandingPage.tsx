import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  LogIn,
  HelpCircle,
  Mail,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AppLogo from "../components/ui/AppLogo";
import Footer from "../components/ui/Footer";

const features = [
  { icon: LayoutDashboard, label: "Inventory" },
  { icon: BarChart3, label: "Analytics" },
  { icon: ShieldCheck, label: "Security" },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen w-full flex flex-col bg-muted/30">
      {/* Nav */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <AppLogo />
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a
            href="/docs"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
            Support
          </a>
          <a
            href="mailto:admin@pharmacore.com"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            Contact
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Left — Hero + CTA */}
          <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-start max-w-lg">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-sidebar-primary/30 bg-sidebar-primary/8 px-4 py-1.5 mb-7">
              <span className="h-2 w-2 rounded-full bg-sidebar-primary animate-pulse" />
              <span className="text-xs font-semibold text-sidebar-primary tracking-wide">
                Pharmacy Management System
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-5">
              Modern Pharmacy
              <br />
              Management
              <br />
              <span className="text-sidebar-primary">Made Simple</span>
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-sm">
              A complete, secure, data-driven solution for managing sales,
              stock, suppliers, and staff — all in one place.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-10">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground"
                >
                  <Icon className="h-4 w-4 text-sidebar-primary" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() =>
                  isAuthenticated ? navigate("/dashboard") : navigate("/login")
                }
                className="flex h-12 items-center justify-center gap-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground px-8 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                {isAuthenticated ? "Go to Dashboard" : "Enter System"}
              </button>

              <button
                onClick={() => navigate("/docs")}
                className="flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50"
              >
                View Documentation
              </button>
            </div>
          </div>

          {/* Right — Dashboard preview */}
          <div className="flex-1 w-full max-w-xl">
            <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-1.5 h-9 px-4 border-b border-border bg-muted/40">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
                <div className="flex-1 mx-4 h-5 rounded-md bg-muted/60 flex items-center px-3 text-[10px] text-muted-foreground">
                  pharmacore.app/dashboard
                </div>
              </div>

              {/* Pure Tailwind CSS Dashboard Mockup */}
              <div className="p-4 bg-muted/10 aspect-16/10 flex gap-3 select-none">
                {/* Mock Sidebar */}
                <div className="w-1/4 border-r border-border/50 pr-2 flex flex-col gap-2.5">
                  <div className="h-4 w-3/4 rounded bg-muted-foreground/20 mb-2" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-primary/20" />{" "}
                    {/* Active Item */}
                    <div className="h-3 w-5/6 rounded bg-muted-foreground/10" />
                    <div className="h-3 w-11/12 rounded bg-muted-foreground/10" />
                    <div className="h-3 w-4/5 rounded bg-muted-foreground/10" />
                  </div>
                </div>

                {/* Mock Main Content */}
                <div className="flex-1 flex flex-col gap-3">
                  {/* Mock Top Stats Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg border border-border/50 bg-card/50 space-y-1.5">
                      <div className="h-2 w-1/2 rounded bg-muted-foreground/15" />
                      <div className="h-4 w-2/3 rounded bg-muted-foreground/25" />
                    </div>
                    <div className="p-2 rounded-lg border border-border/50 bg-card/50 space-y-1.5">
                      <div className="h-2 w-2/3 rounded bg-muted-foreground/15" />
                      <div className="h-4 w-1/2 rounded bg-muted-foreground/25" />
                    </div>
                    <div className="p-2 rounded-lg border border-border/50 bg-card/50 space-y-1.5">
                      <div className="h-2 w-1/2 rounded bg-muted-foreground/15" />
                      <div className="h-4 w-3/4 rounded bg-destructive/20 animate-pulse" />
                    </div>
                  </div>

                  {/* Mock Main Chart Area */}
                  <div className="flex-1 rounded-lg border border-border/50 bg-card/50 p-3 flex flex-col justify-between">
                    <div className="h-2 w-1/4 rounded bg-muted-foreground/15" />
                    <div className="flex items-end gap-3 h-24 pt-4 px-2 border-b border-border/40">
                      <div className="w-full bg-primary/20 rounded-t h-[40%]" />
                      <div className="w-full bg-primary/30 rounded-t h-[65%]" />
                      <div className="w-full bg-primary/15 rounded-t h-[25%]" />
                      <div className="w-full bg-primary/40 rounded-t h-[85%]" />
                      <div className="w-full bg-primary/60 rounded-t h-[55%]" />
                      <div className="w-full bg-primary/25 rounded-t h-[70%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer paddingY="py-3" />
    </div>
  );
};

export default LandingPage;
