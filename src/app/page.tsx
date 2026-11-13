import Link from "next/link";
import client from "@/lib/db";
import { getLiveGoldPrices } from "@/lib/gold-price";

export default async function HomePage() {
  let shops: any[] = [];
  let prices = await getLiveGoldPrices();

  try {
    const result = await client.execute(
      "SELECT id, name, slug, logo_url, is_active FROM shops WHERE is_active = 1 ORDER BY created_at DESC LIMIT 12"
    );
    shops = result.rows as any[];
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <header className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <span className="text-amber-400 font-bold">SK</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">SK Team</h1>
              <p className="text-xs text-zinc-500">فروشگاه‌های آنلاین</p>
            </div>
          </div>
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
          >
            ورود به پنل
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Live Prices */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">قیمت لحظه‌ای بازار</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 text-sm">انس جهانی</p>
              <p className="text-2xl font-bold text-amber-400 mt-1" dir="ltr">
                ${prices.ounce_usd.toLocaleString()}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 text-sm">دلار</p>
              <p className="text-2xl font-bold text-white mt-1">
                {prices.dollar_toman.toLocaleString()} تومان
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 text-sm">طلای ۱۸ عیار</p>
              <p className="text-2xl font-bold text-amber-300 mt-1">
                {(prices.gold_18_toman / 1000).toLocaleString()} هزار
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 text-sm">طلای ۲۴ عیار</p>
              <p className="text-2xl font-bold text-amber-200 mt-1">
                {(prices.gold_24_toman / 1000).toLocaleString()} هزار
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-600 mt-3">
            آخرین بروزرسانی: {new Date(prices.updated_at).toLocaleString("fa-IR")}
          </p>
        </section>

        {/* Shops */}
        <section>
          <h2 className="text-xl font-semibold mb-6">فروشگاه‌های فعال</h2>
          {shops.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800">
              هنوز فروشگاهی ثبت نشده است
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/?shop=${shop.slug}`}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-amber-500/30 transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden group-hover:border-amber-500/40 transition">
                      {shop.logo_url ? (
                        <img src={shop.logo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-zinc-500">
                          {shop.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-amber-400 transition">
                        {shop.name}
                      </h3>
                      <p className="text-sm text-zinc-500">/{shop.slug}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-800 mt-16 py-8 text-center text-zinc-600 text-sm">
        © {new Date().getFullYear()} SK Team · سیستم مدیریت متمرکز فروشگاه‌ها
      </footer>
    </div>
  );
}
