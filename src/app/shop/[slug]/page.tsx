import { notFound } from "next/navigation";
import client from "@/lib/db";
import { getLiveGoldPrices, calculateProductPrice } from "@/lib/gold-price";
import Link from "next/link";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shopResult = await client.execute({
    sql: "SELECT * FROM shops WHERE slug = ? AND is_active = 1 LIMIT 1",
    args: [slug],
  });

  if (shopResult.rows.length === 0) notFound();
  const shop = shopResult.rows[0] as any;

  const settingsResult = await client.execute({
    sql: "SELECT * FROM shop_settings WHERE shop_id = ?",
    args: [shop.id],
  });
  const settings = (settingsResult.rows[0] as any) || {};

  const productsResult = await client.execute({
    sql: "SELECT * FROM products WHERE shop_id = ? AND is_active = 1 ORDER BY created_at DESC",
    args: [shop.id],
  });
  const products = productsResult.rows as any[];

  const prices = await getLiveGoldPrices();
  const profit = settings.gold_profit_percent || 5;

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center overflow-hidden">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-amber-400 font-bold text-lg">{shop.name?.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{shop.name}</h1>
              <p className="text-xs text-zinc-500">فروشگاه طلا و جواهر</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/shop/${slug}/cart`} className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm transition">
              سبد خرید
            </Link>
            <Link href={`/shop/${slug}/login`} className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-medium transition">
              ورود / ثبت‌نام
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Live Prices */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-zinc-300">قیمت لحظه‌ای بازار</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-xs mb-1">انس جهانی</p>
              <p className="text-xl font-bold text-amber-400" dir="ltr">${prices.ounce_usd.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-xs mb-1">دلار</p>
              <p className="text-xl font-bold">{prices.dollar_toman.toLocaleString()} <span className="text-sm text-zinc-500">تومان</span></p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-xs mb-1">طلای ۱۸ عیار</p>
              <p className="text-xl font-bold text-amber-300">{(prices.gold_18_toman / 1000).toLocaleString()} <span className="text-sm">هزار</span></p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-xs mb-1">طلای ۲۴ عیار</p>
              <p className="text-xl font-bold text-amber-200">{(prices.gold_24_toman / 1000).toLocaleString()} <span className="text-sm">هزار</span></p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">محصولات</h2>
            <span className="text-sm text-zinc-500">{products.length} محصول</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-zinc-500">
              هنوز محصولی ثبت نشده است
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => {
                const finalPrice = p.price || calculateProductPrice(p.weight, p.karat || 18, prices.gold_18_toman, profit);
                return (
                  <Link
                    key={p.id}
                    href={`/shop/${slug}/products/${p.id}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition group"
                  >
                    <div className="aspect-square bg-zinc-800 relative">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-4xl">◆</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium group-hover:text-amber-400 transition line-clamp-1">{p.title}</h3>
                      <div className="flex items-center justify-between mt-2 text-sm text-zinc-400">
                        <span>{p.weight} گرم · {p.karat || 18} عیار</span>
                      </div>
                      <p className="mt-2 text-lg font-bold text-amber-400">
                        {finalPrice.toLocaleString()} <span className="text-sm text-zinc-500">تومان</span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* About & Contact */}
        {(settings.about_us || settings.phone || settings.address) && (
          <section className="mt-16 grid md:grid-cols-2 gap-8">
            {settings.about_us && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="font-semibold mb-3">درباره ما</h3>
                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{settings.about_us}</p>
              </div>
            )}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-3">تماس با ما</h3>
              <div className="space-y-2 text-sm text-zinc-400">
                {settings.phone && <p>تلفن: <span dir="ltr">{settings.phone}</span></p>}
                {settings.address && <p>آدرس: {settings.address}</p>}
                <div className="flex gap-3 mt-4">
                  {settings.instagram_url && (
                    <a href={settings.instagram_url} target="_blank" className="text-amber-400 hover:underline">اینستاگرام</a>
                  )}
                  {settings.telegram_url && (
                    <a href={settings.telegram_url} target="_blank" className="text-amber-400 hover:underline">تلگرام</a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-zinc-800 mt-16 py-8 text-center text-zinc-600 text-sm">
        {shop.name} · طراحی و پشتیبانی SK Team
      </footer>
    </div>
  );
}
