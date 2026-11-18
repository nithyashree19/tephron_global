import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import logo from "../assets/tephron-logo.jpg";
import heroImg from "../assets/tephron-hero.webp";
import ThemeToggle from "../components/ThemeToggle";
import { login, isSignedIn } from "../lib/adminAuth";
import { gsap, smooth, prefersReducedMotion } from "../lib/motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";
  const cardRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Sign in · Tephron Admin";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !cardRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { y: 24, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: smooth, clearProps: "transform" });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  if (isSignedIn()) return <Navigate to="/admin" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check for empty fields first, so an empty form gets a clear message
    const errs = {};
    if (!email.trim()) errs.email = "Enter your email address.";
    if (!password) errs.password = "Enter your password.";
    setFieldErrors(errs);
    setError("");
    if (Object.keys(errs).length) return;

    if (!login(email, password)) {
      setError("That email or password isn’t right. Please try again.");
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-bg px-5 py-12 text-fg">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-white/55 dark:bg-[#05080f]/80" />

      <div className="fixed right-5 top-5">
        <ThemeToggle />
      </div>

      <div ref={cardRef} className="glass w-full max-w-md rounded-[24px] border p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <p className="text-[0.9375rem] font-semibold">Tephron Admin</p>
            <p className="text-[0.8125rem] text-muted">Sign in to manage the website</p>
          </div>
        </div>

        <h1 className="mt-10 text-[1.75rem] font-semibold tracking-[-0.02em]">Sign in</h1>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-[0.875rem] font-medium">Email</label>
            <div className="relative">
              <FiMail aria-hidden="true" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setFieldErrors((f) => ({ ...f, email: "" }));
                }}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "login-email-err" : undefined}
                className="w-full rounded-xl border border-line bg-surface py-3 pl-10 pr-4 text-[0.9375rem] text-fg placeholder:text-faint focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-soft"
                placeholder="you@example.com"
              />
            </div>
            {fieldErrors.email && (
              <p id="login-email-err" role="alert" className="mt-1.5 text-[0.8125rem] font-medium text-accent">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-[0.875rem] font-medium">Password</label>
            <div className="relative">
              <FiLock aria-hidden="true" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                  setFieldErrors((f) => ({ ...f, password: "" }));
                }}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "login-password-err" : undefined}
                className="w-full rounded-xl border border-line bg-surface py-3 pl-10 pr-11 text-[0.9375rem] text-fg placeholder:text-faint focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-soft"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-bg-alt hover:text-fg"
              >
                {showPassword ? <FiEyeOff size={16} aria-hidden="true" /> : <FiEye size={16} aria-hidden="true" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="login-password-err" role="alert" className="mt-1.5 text-[0.8125rem] font-medium text-accent">{fieldErrors.password}</p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-[0.875rem] font-medium text-accent">
              {error}
            </p>
          )}

          <button type="submit" className="admin-grad flex h-12 w-full items-center justify-center gap-2 rounded-full text-[0.9375rem] font-semibold text-white transition-[filter] hover:brightness-95">
            Sign in <FiArrowRight aria-hidden="true" size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
