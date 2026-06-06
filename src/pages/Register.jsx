import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Salad } from "lucide-react";
import SocialAuth from "../components/ui/SocialAuth";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(form.email, form.fullName, form.password);
    if (result.ok) navigate("/app/onboarding");
    else setError(result.error);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex">
      {/* ── Left: food image ──────────────────────────── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85"
          alt="Healthy food spread"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/70 to-terra-dark/50" />
        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <div className="glass rounded-3xl p-8 max-w-sm">
            <p className="font-display text-2xl text-forest mb-3">
              Personalized to <em className="text-terra">you</em>
            </p>
            <p className="text-sm text-warmGray-dark leading-relaxed">
              Tell us about your health conditions once. Every recommendation
              and meal plan will account for them automatically.
            </p>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-col gap-2">
              {[
                "🔒 Your health data is private",
                "✅ No credit card required",
                "🌿 Free forever on basic plan",
              ].map((t) => (
                <p key={t} className="text-xs text-warmGray-dark">
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: form ───────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-cream overflow-y-auto">
        <div className="w-full max-w-md animate-fade-up">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-terra rounded-xl flex items-center justify-center shadow-warm">
              <Salad size={16} className="text-cream" />
            </div>
            <span className="font-display text-lg text-forest">NutriGuide</span>
          </Link>
           {/* Quick OAuth on landing */}
           <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <a
                href={`${import.meta.env.VITE_API_URL || "http://localhost:8002"}/auth/google/login`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 border border-warmGray/20 text-sm font-medium text-warmGray-dark hover:border-warmGray/40 hover:shadow-card transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </a>
            
            </div>

          <h1 className="font-display text-3xl text-forest mb-1">
            Create your account
          </h1>
          <p className="text-warmGray mb-2">Free — no credit card needed</p>

          {/* Social auth — fastest path to signup */}
          <SocialAuth mode="register" />

          {/* Email form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            {[
              {
                label: "Full name",
                key: "fullName",
                type: "text",
                placeholder: "Amara Tadesse",
              },
              {
                label: "Email",
                key: "email",
                type: "email",
                placeholder: "you@example.com",
              },
              {
                label: "Password",
                key: "password",
                type: "password",
                placeholder: "Min 8 characters",
              },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-medium text-warmGray-dark block mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  className="input-field"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={set(key)}
                  required
                  minLength={key === "password" ? 8 : undefined}
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary mt-1"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account with email"}
            </button>
          </form>

          <p className="text-xs text-warmGray text-center mt-4 leading-relaxed">
            By creating an account you agree to our{" "}
            <span className="text-terra cursor-pointer hover:underline">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-terra cursor-pointer hover:underline">
              Privacy Policy
            </span>
            .
          </p>

          <p className="text-center text-sm text-warmGray mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-terra font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
