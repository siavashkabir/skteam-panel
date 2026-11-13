"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CustomOrderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customer_name: "",
    customer_mobile: "",
    customer_email: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("shop_slug", slug);
      fd.append("customer_name", form.customer_name);
      fd.append("customer_mobile", form.customer_mobile);
      fd.append("customer_email", form.customer_email);
      fd.append("description", form.description);
      if (image) fd.append("image", image);

      const res = await fetch("/api/custom-orders", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ثبت سفارش");
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4" dir="rtl">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-emerald-400">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">سفارش شما ثبت شد</h1>
          <p className="text-zinc-400 mb-6">فروشگاه به زودی با شما تماس می‌گیرد.</p>
          <Link href={`/shop/${slug}`} className="inline-block bg-amber-500 text-black font-semibold px-6 py-3 rounded-xl">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <header className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href={`/shop/${slug}`} className="text-zinc-400 hover:text-white text-sm">← بازگشت</Link>
          <h1 className="font-semibold">سفارش طلای سفارشی</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          عکس طلا یا طرح مورد نظر خود را آپلود کنید. فروشگاه بررسی می‌کند و در صورت امکان برای شما تهیه می‌کند.
        </p>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>
          )}

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">نام و نام خانوادگی *</label>
            <input name="customer_name" value={form.customer_name} onChange={handleChange} required
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">شماره موبایل *</label>
            <input name="customer_mobile" value={form.customer_mobile} onChange={handleChange} required dir="ltr"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">ایمیل</label>
            <input type="email" name="customer_email" value={form.customer_email} onChange={handleChange} dir="ltr"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">توضیحات سفارش</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="مثلاً: انگشتر طلا ۱۸ عیار با طرح مشابه عکس، وزن حدود ۴ گرم"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 resize-none" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">عکس طلا / طرح مورد نظر *</label>
            <input type="file" accept="image/*" onChange={handleImage} required
              className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-medium" />
            {preview && (
              <img src={preview} alt="preview" className="mt-3 rounded-xl max-h-48 object-contain border border-zinc-700" />
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold py-3.5 rounded-xl transition">
            {loading ? "در حال ارسال..." : "ثبت سفارش سفارشی"}
          </button>
        </form>
      </main>
    </div>
  );
}
