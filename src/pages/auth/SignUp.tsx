// React & Hooks
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Hooks

// Services & API

// Types & Schemas

// Contexts
import { useAuth } from "@/context/auth";

// Utils & Constants
import { ROUTES } from "@/app/routes/routeEndpoints";

// Icons & Utils
import { Eye, EyeOff, Loader2, Lock, Mail, User, Zap } from "lucide-react";

// ─── Validation Schema ────────────────────────────────────────────────────────

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

// ─── Password Strength ────────────────────────────────────────────────────────

const getPasswordStrength = (
  password: string,
): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-destructive" };
  if (score <= 2) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 3) return { score, label: "Good", color: "bg-info" };
  return { score, label: "Strong", color: "bg-success" };
};

// ─── Component ────────────────────────────────────────────────────────────────

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignUpForm) => {
    setServerError(null);
    try {
      await signUp(data);
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />
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
            <h2 className="text-lg font-semibold text-foreground">
              Create an account
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Join the QuantexQ operator network
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="sign-up-name"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="sign-up-name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  className={`w-full bg-input border rounded-md pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    errors.name
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border hover:border-border/80"
                  }`}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="sign-up-email"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="sign-up-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
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
                htmlFor="sign-up-password"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="sign-up-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`w-full bg-input border rounded-md pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    errors.password
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border hover:border-border/80"
                  }`}
                  {...register("password", {
                    onChange: (e) => setPasswordValue(e.target.value),
                  })}
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
              {/* Password strength bar */}
              {passwordValue && (
                <div className="space-y-1 pt-0.5">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < strength.score ? strength.color : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strength:{" "}
                    <span className="text-foreground">{strength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="sign-up-confirm-password"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="sign-up-confirm-password"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`w-full bg-input border rounded-md pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    errors.confirmPassword
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border hover:border-border/80"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              id="sign-up-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-2.5 rounded-md text-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to={ROUTES.SIGN_IN}
              className="text-foreground font-medium hover:text-primary underline underline-offset-4 transition-colors"
            >
              Sign in
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

export default SignUp;
