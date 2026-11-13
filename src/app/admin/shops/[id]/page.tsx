import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import client from "@/lib/db";
import Link from "next/link";
import ShopEditForm from "./ShopEditForm";

export default async function ShopManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    redirect("/login");
  }

  const { id } = await params;
  const shopId = Number(id);

  const shopResult = await client.execute({
    sql: "SELECT * FROM shops WHERE id = ?",
    args: [shopId],
  });

  if (shopResult.rows.length === 0) {
    notFound();
  }

  const shop = shopResult.rows[0] as any;

  const settingsResult = await client.execute({
    sql: "SELECT * FROM shop_settings WHERE shop_id = ?",
    args: [shopId],
  });

  const settings = settingsResult.rows[0] as any || {};

  const productsResult = await client.execute({
    sql: "SELECT COUNT(*) as count FROM products WHERE shop_id = ?",
    args: [shopId],
  });

  const productCount = Number((productsResult.rows[0] as any)?.count || 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-zinc-400 hover:text-white text-sm">
            ← بازگشت
          </Link>
          <h1 className="font-semibold">مدیریت فروشگاه</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Info Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold">{shop.name}</h2>
              <p className="text-zinc-500 text-sm mt-1">
                /{shop.slug}
                {shop.custom_domain && (
                  <span className="text-amber-500 mr-2"> • {shop.custom_domain}</span>
                )}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                shop.is_active
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-zinc-700 text-zinc-400"
              }`}
            >
              {shop.is_active ? "فعال" : "غیرفعال"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-zinc-950 rounded-xl p-3">
              <p className="text-zinc-500">تعداد محصولات</p>
              <p className="text-lg font-semibold mt-1">{productCount}</p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-3">
              <p className="text-zinc-500">نوع کسب‌وکار</p>
              <p className="text-lg font-semibold mt-1">
                {shop.business_type === "gold" ? "طلا و جواهر" : shop.business_type}
              </p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-3">
              <p className="text-zinc-500">تلفن</p>
              <p className="text-lg font-semibold mt-1" dir="ltr">
                {settings.phone || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <ShopEditForm shop={shop} settings={settings} />
      </main>
    </div>
  );
}
