"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ShopEditForm({
  shop,
  settings,
}: {
  shop: any;
  settings: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: shop.name || "",
    slug: shop.slug || "",
    custom_domain: shop.custom_domain || "",
    is_active: shop.is_active ? true : false,
    about_us: settings.about_us || "",
    phone: settings.phone || "",
    address: settings.address || "",
    instagram_url: settings.instagram_url || "",
    telegram_url: settings.telegram_url || "",
    payment_gateway: settings.payment_gateway || "zarinpal",
    payment_merchant_id: settings.payment_merchant_id || "",
    payment_api_key: settings.payment_api_key || "",
    payment_is_active: settings.payment_is_active ? true : false,
    gold_profit_percent: settings.gold_profit_percent || 5,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/shops/${shop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "خطا در ذخیره");
      } else {
        setMessage("تغییرات با موفقیت ذخیره شد");
        router.refresh();
      }
    } catch {
      setMessage("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
      <h3 className="font-semibold text-lg border-b border-zinc-800 pb-3">ویرایش اطلاعات</h3>

      {message && (
        <div
          className={`p-3 rounded-xl text-sm ${
            message.includes("موفق")
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid gap-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">نام فروشگاه</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">اسلاگ</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              dir="ltr"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">دامنه اختصاصی</label>
          <input
            name="custom_domain"
            value={form.custom_domain}
            onChange={handleChange}
            dir="ltr"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
            placeholder="shop.example.com"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-5 h-5 rounded accent-amber-500"
          />
          <label htmlFor="is_active" className="text-sm">
            فروشگاه فعال باشد
          </label>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">درباره ما</label>
          <textarea
            name="about_us"
            value={form.about_us}
            onChange={handleChange}
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">تلفن</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              dir="ltr"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">آدرس</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">لینک اینستاگرام</label>
            <input
              name="instagram_url"
              value={form.instagram_url}
              onChange={handleChange}
              dir="ltr"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">لینک تلگرام</label>
            <input
              name="telegram_url"
              value={form.telegram_url}
              onChange={handleChange}
              dir="ltr"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
              placeholder="https://t.me/..."
            />
          </div>
        </div>

        {/* Payment Settings */}
        <div className="border-t border-zinc-800 pt-5">
          <h4 className="font-medium mb-4">تنظیمات درگاه پرداخت</h4>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">درگاه</label>
              <select
                name="payment_gateway"
                value={form.payment_gateway}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="zarinpal">زرین‌پال</option>
                <option value="nextpay">نکست‌پی</option>
                <option value="idpay">آیدی‌پی</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Merchant ID / API Key</label>
              <input
                name="payment_merchant_id"
                value={form.payment_merchant_id}
                onChange={handleChange}
                dir="ltr"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="payment_is_active"
                id="payment_is_active"
                checked={form.payment_is_active}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-amber-500"
              />
              <label htmlFor="payment_is_active" className="text-sm">
                درگاه پرداخت فعال باشد
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">درصد سود روی قیمت طلا (%)</label>
          <input
            type="number"
            name="gold_profit_percent"
            value={form.gold_profit_percent}
            onChange={handleChange}
            min="0"
            max="50"
            step="0.5"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition"
      >
        {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
    </form>
  );
}
