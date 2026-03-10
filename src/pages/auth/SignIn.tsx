import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Lock, Mail, Zap } from "lucide-react";
import { useAuth } from "@/context/Auth/AuthContext";
import { ROUTES } from "@/services/routes/clientRoutes";

// ─── Validation Schema ────────────────────────────────────────────────────────

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

const SignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    setServerError(null);
    try {
      await signIn(data);
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Sign in failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />
      </div>

      {/* Grid lines overlay (subtle) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4 shadow-[0_0_30px_hsl(var(--primary)/0.15)]">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            QuantexQ
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Industrial Monitoring Platform
          </p>
        </div>

        {/* Card */}
        <div className="dashboard-panel border border-border/50 p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Access your operator dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="sign-in-email"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="sign-in-email"
                  type="email"
                  autoComplete="email"
                  placeholder="operator@quantexq.com"
                  className={`w-full bg-input border rounded-md pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    errors.email
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border hover:border-border/80"
                  }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="sign-in-password"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="sign-in-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full bg-input border rounded-md pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    errors.password
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border hover:border-border/80"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* Demo Hint */}
            <div className="rounded-md bg-primary/5 border border-primary/15 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Demo credentials: </span>
              operator@quantexq.com / password123
            </div>

            {/* Submit */}
            <button
              id="sign-in-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-2.5 rounded-md text-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to={ROUTES.SIGN_UP}
              className="text-foreground font-medium hover:text-primary underline underline-offset-4 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} QuantexQ · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default SignIn;
