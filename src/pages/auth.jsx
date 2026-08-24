import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Cat, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { brandAssets } from "../components/brand";

function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        if (!form.username.trim()) {
          setError("Username tidak boleh kosong.");
          setIsLoading(false);
          return;
        }
        await register(form.username, form.email, form.password);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError("");
    setForm({ username: "", email: "", password: "" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fdf8f3] p-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-100/80 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-100/80 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-50/80 blur-3xl" />
      </div>

      {/* Floating cat emoji decorations */}
      <span className="pointer-events-none absolute top-12 left-10 text-6xl opacity-10 rotate-[-15deg]">🐱</span>
      <span className="pointer-events-none absolute bottom-16 right-12 text-5xl opacity-10 rotate-[10deg]">🐾</span>
      <span className="pointer-events-none absolute top-1/3 right-8 text-4xl opacity-10 rotate-[-5deg]">✨</span>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-900/90 shadow-xl">
            <Cat size={32} strokeWidth={2} className="text-amber-50" />
          </div>
          {brandAssets?.logo?.dark ? (
            <img src={brandAssets.logo.dark} alt="PurrFocus" className="h-8 object-contain" />
          ) : (
            <span className="text-2xl font-black tracking-tight text-amber-900">PurrFocus</span>
          )}
          <p className="mt-2 text-sm font-medium text-amber-900/50">
            {mode === "login" ? "Selamat datang kembali 🐾" : "Buat akunmu, mulai fokus 🐱"}
          </p>
        </div>

        {/* Form card */}
        <div className="overflow-hidden rounded-[2rem] border border-amber-100 bg-white/80 shadow-2xl shadow-amber-900/10 backdrop-blur-md">
          {/* Tab switcher */}
          <div className="flex border-b border-amber-100 bg-amber-50/60 p-2">
            <button
              onClick={() => mode !== "login" && switchMode()}
              className={`flex-1 rounded-xl py-2.5 text-sm font-black transition-all ${
                mode === "login"
                  ? "bg-amber-900 text-amber-50 shadow-sm"
                  : "text-amber-900/50 hover:text-amber-900"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => mode !== "register" && switchMode()}
              className={`flex-1 rounded-xl py-2.5 text-sm font-black transition-all ${
                mode === "register"
                  ? "bg-amber-900 text-amber-50 shadow-sm"
                  : "text-amber-900/50 hover:text-amber-900"
              }`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-8">
            {/* Username (register only) */}
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-amber-900/60">
                  Username
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                  <User size={16} strokeWidth={2.5} className="shrink-0 text-amber-900/40" />
                  <input
                    type="text"
                    placeholder="nama_kucingmu"
                    value={form.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    className="flex-1 bg-transparent text-sm font-bold text-amber-900 outline-none placeholder:text-amber-900/30"
                    autoComplete="username"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-amber-900/60">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                <Mail size={16} strokeWidth={2.5} className="shrink-0 text-amber-900/40" />
                <input
                  type="email"
                  placeholder="kamu@email.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="flex-1 bg-transparent text-sm font-bold text-amber-900 outline-none placeholder:text-amber-900/30"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-amber-900/60">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                <Lock size={16} strokeWidth={2.5} className="shrink-0 text-amber-900/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "Min. 6 karakter" : "••••••••"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  minLength={mode === "register" ? 6 : undefined}
                  className="flex-1 bg-transparent text-sm font-bold text-amber-900 outline-none placeholder:text-amber-900/30"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="shrink-0 text-amber-900/30 hover:text-amber-900/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-900 px-6 py-4 text-sm font-black text-amber-50 shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-800 hover:shadow-amber-900/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Masuk ke PurrFocus" : "Buat Akun"}
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>

            {/* Switch mode text */}
            <p className="text-center text-xs font-medium text-amber-900/50">
              {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="font-black text-amber-900 underline underline-offset-2 hover:text-amber-700"
              >
                {mode === "login" ? "Daftar di sini" : "Masuk"}
              </button>
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] font-medium text-amber-900/30">
          PurrFocus · Fokus bersama kucingmu 🐾
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
