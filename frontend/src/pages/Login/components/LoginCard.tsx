import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { useAuthStore } from "../../../store/useAuthStore";
import { Lock, Eye, EyeOff, User, CheckCircle2 } from "lucide-react";
import AppLogo from "../../../components/ui/AppLogo";

const LoginCard: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({
        identifier,
        password,
        rememberMe,
      });

      setAuth(
        {
          fullName: response.fullName,
          role: response.role,
          email: response.email,
        },
        response.token,
      );

      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const serverMessage = err.response?.data?.Message;

        if (serverMessage) {
          setError(serverMessage);
        } else if (status === 401) {
          setError("Invalid username or password.");
        } else if (status === 429) {
          setError("Too many attempts. Please try again later.");
        } else if (err.code === "ERR_NETWORK") {
          setError("Connection failed. Check your internet or CORS settings.");
        } else {
          setError("Login failed. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Top accent */}
          <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />

          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <AppLogo showSub={false} />
              <h1 className="text-xl font-bold text-center mt-4 mb-1 tracking-tight text-foreground">
                Welcome back to PharmaCore
              </h1>
              <p className="text-sm text-muted-foreground text-center">
                Sign in to manage your pharmacy
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-300/90 bg-destructive/5 px-4 py-2.5 text-sm text-destructive text-center">
                  {error}
                </div>
              )}

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Username / Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="Enter your username or email"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/40 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full rounded-lg border border-border bg-muted/40 py-2.5 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none h-4 w-4 rounded border border-border checked:bg-sidebar-primary checked:border-sidebar-primary transition-all cursor-pointer"
                    />
                    <CheckCircle2 className="absolute left-0.5 h-3 w-3 text-sidebar-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-sidebar-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold transition-opacity active:scale-[0.98] mt-1 ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:opacity-90 cursor-pointer"
                }`}
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </button>

              {/* Footer note */}
              <p className="text-center text-sm text-muted-foreground pt-1">
                Don't have an account?{" "}
                <a
                  href="#"
                  className="font-semibold text-sidebar-primary hover:underline underline-offset-4"
                >
                  Request Access
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
