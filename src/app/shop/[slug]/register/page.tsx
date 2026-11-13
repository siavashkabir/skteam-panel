"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    national_id: "",
    mobile: "",
    address: "",
    city: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.national_id || form.national_id.length !== 10) {
      setError("کد ملی باید ۱۰ رقم باشد");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, shop_slug: slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ثبت‌نام");
        setLoading(false);
        return;
      }
      router.push(`/shop/${slug}/login?registered=1`);
    } catch {
      setError("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">ثبت‌نام مشتری</h1>
          <p className="text-zinc-500 text-sm mt-1">برای خرید از فروشگاه ثبت‌نام کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">نام و نام خانوادگی *</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} required
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">کد ملی *</label>
            <input name="national_id" value={form.national_id} onChange={handleChange} required maxLength={10}
              dir="ltr" placeholder="0012345678"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">شماره موبایل *</label>
            <input name="mobile" value={form.mobile} onChange={handleChange} required
              dir="ltr" placeholder="0912xxxxxxx"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">ایمیل *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              dir="ltr" className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">رمز عبور *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6}
              dir="ltr" className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">شهر</label>
            <input name="city" value={form.city} onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">آدرس کامل</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold py-3.5 rounded-xl transition">
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>

          <p className="text-center text-sm text-zinc-500">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href={`/shop/${slug}/login`} className="text-amber-400 hover:underline">ورود</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
