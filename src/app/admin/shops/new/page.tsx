"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewShopPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    custom_domain: "",
    business_type: "gold",
    about_us: "",
    phone: "",
    address: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Auto generate slug from name
    if (name === "name" && !form.slug) {
      const slug = value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\u0600-\u06FF-]/g, "");
      setForm((prev) => ({ ...prev, slug }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ایجاد فروشگاه");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("خطا در برقراری ارتباط");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-zinc-400 hover:text-white text-sm">
            ← بازگشت به داشبورد
          </Link>
          <h1 className="font-semibold">افزودن فروشگاه جدید</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">نام فروشگاه *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                placeholder="مثال: گالری طلای آریا"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">اسلاگ (آدرس داخلی) *</label>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-sm">/</span>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  dir="ltr"
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                  placeholder="aria-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">دامنه اختصاصی (اختیاری)</label>
              <input
                name="custom_domain"
                value={form.custom_domain}
                onChange={handleChange}
                dir="ltr"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                placeholder="shop.example.com یا goldshop.ir"
              />
              <p className="text-xs text-zinc-500 mt-1.5">
                بعد از ثبت، DNS دامنه را به Netlify متصل کنید
              </p>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">نوع کسب‌وکار</label>
              <select
                name="business_type"
                value={form.business_type}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="gold">طلا و جواهر</option>
                <option value="clothing">پوشاک</option>
                <option value="food">مواد غذایی</option>
                <option value="service">خدمات</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">شماره تماس</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                dir="ltr"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                placeholder="0912xxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">آدرس</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                placeholder="تهران، خیابان ..."
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">درباره فروشگاه</label>
              <textarea
                name="about_us"
                value={form.about_us}
                onChange={handleChange}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 resize-none"
                placeholder="توضیح کوتاه درباره فروشگاه..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition"
            >
              {loading ? "در حال ذخیره..." : "ایجاد فروشگاه"}
            </button>
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
            >
              انصراف
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
