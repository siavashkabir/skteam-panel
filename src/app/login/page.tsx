"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Theme = "minimal" | "gold" | "dark" | "glass" | "classic";

const themes: { id: Theme; name: string }[] = [
  { id: "minimal", name: "مینیمال" },
  { id: "gold", name: "طلایی" },
  { id: "dark", name: "تیره" },
  { id: "glass", name: "شیشه‌ای" },
  { id: "classic", name: "کلاسیک" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>("minimal");

  useEffect(() => {
    const saved = localStorage.getItem("login_theme") as Theme;
    if (saved) setTheme(saved);
  }, []);

  function changeTheme(t: Theme) {
    setTheme(t);
    localStorage.setItem("login_theme", t);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ورود");
        setLoading(false);
        return;
      }
      router.push(data.redirect || "/admin/dashboard");
    } catch {
      setError("خطا در برقراری ارتباط");
      setLoading(false);
    }
  }

  const styles: Record<Theme, any> = {
    minimal: {
      bg: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-black",
      card: "bg-zinc-900/80 border-zinc-800",
      input: "bg-zinc-950 border-zinc-700 focus:border-amber-500/50",
      btn: "bg-amber-500 hover:bg-amber-400 text-black",
      accent: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
    gold: {
      bg: "bg-gradient-to-br from-amber-950 via-yellow-950 to-black",
      card: "bg-gradient-to-b from-amber-900/30 to-zinc-900/90 border-amber-700/40",
      input: "bg-black/40 border-amber-700/50 focus:border-amber-400",
      btn: "bg-gradient-to-r from-amber-500 to-yellow-500 text-black",
      accent: "text-amber-300",
      iconBg: "bg-amber-500/20 border-amber-400/30",
    },
    dark: {
      bg: "bg-black",
      card: "bg-zinc-950 border-zinc-800",
      input: "bg-black border-zinc-800 focus:border-white/30",
      btn: "bg-white hover:bg-zinc-200 text-black",
      accent: "text-white",
      iconBg: "bg-white/5 border-white/10",
    },
    glass: {
      bg: "bg-gradient-to-br from-indigo-950 via-purple-950 to-zinc-950",
      card: "bg-white/5 backdrop-blur-xl border-white/10",
      input: "bg-white/5 border-white/10 focus:border-white/30",
      btn: "bg-white/20 hover:bg-white/30 text-white border border-white/20",
      accent: "text-purple-300",
      iconBg: "bg-white/10 border-white/20",
    },
    classic: {
      bg: "bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950",
      card: "bg-stone-900 border-stone-700",
      input: "bg-stone-950 border-stone-600 focus:border-stone-400",
      btn: "bg-stone-100 hover:bg-white text-stone-900",
      accent: "text-stone-300",
      iconBg: "bg-stone-800 border-stone-600",
    },
  };

  const s = styles[theme];

  return (
    <div className={`min-h-screen ${s.bg} flex items-center justify-center p-4`} dir="rtl">
      <div className="w-full max-w-md">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => changeTheme(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs transition ${
                theme === t.id
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-black/20 text-zinc-400 border border-transparent hover:text-white"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border mb-4 ${s.iconBg}`}>
            <svg className={`w-8 h-8 ${s.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">پنل مدیریت مرکزی</h1>
          <p className="text-zinc-400 mt-2 text-sm">SK Team Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className={`${s.card} backdrop-blur border rounded-2xl p-8 shadow-2xl`}>
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition ${s.input}`}
                placeholder="sk.team.it@gmail.com"
                required
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition ${s.input}`}
                placeholder="••••••••"
                required
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3.5 rounded-xl transition-all duration-200 mt-2 disabled:opacity-50 ${s.btn}`}
            >
              {loading ? "در حال ورود..." : "ورود به پنل"}
            </button>
          </div>
        </form>
        <p className="text-center text-zinc-600 text-xs mt-8">سیستم مدیریت متمرکز فروشگاه‌ها · SK Team</p>
      </div>
    </div>
  );
}
