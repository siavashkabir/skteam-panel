import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import client from "@/lib/db";
import Link from "next/link";

export default async function SuperAdminDashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "super_admin") {
    redirect("/login");
  }

  const shopsResult = await client.execute("SELECT * FROM shops ORDER BY created_at DESC");
  const shops = shopsResult.rows as any[];

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <span className="text-amber-400 font-bold text-sm">SK</span>
            </div>
            <div>
              <h1 className="font-semibold text-white">پنل مادر</h1>
              <p className="text-xs text-zinc-500">مدیریت مرکزی فروشگاه‌ها</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 hidden sm:block">{session.full_name || session.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button className="text-sm text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-zinc-800">
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm mb-1">تعداد فروشگاه‌ها</p>
            <p className="text-3xl font-bold text-white">{shops.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm mb-1">فعال</p>
            <p className="text-3xl font-bold text-emerald-400">
              {shops.filter((s) => s.is_active).length}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm mb-1">غیرفعال</p>
            <p className="text-3xl font-bold text-zinc-400">
              {shops.filter((s) => !s.is_active).length}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm mb-1">نوع کسب‌وکار</p>
            <p className="text-3xl font-bold text-amber-400">طلا</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link
            href="/admin/shops/new"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            افزودن فروشگاه جدید
          </Link>
        </div>

        {/* Shops List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="font-semibold text-lg">لیست فروشگاه‌ها</h2>
          </div>

          {shops.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              هنوز فروشگاهی ثبت نشده است
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/30 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                      {shop.logo_url ? (
                        <img src={shop.logo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-zinc-500 text-lg font-bold">
                          {shop.name?.charAt(0) || "؟"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{shop.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-zinc-500">
                        <span>/{shop.slug}</span>
                        {shop.custom_domain && (
                          <span className="text-amber-500/80">• {shop.custom_domain}</span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            shop.is_active
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-zinc-700 text-zinc-400"
                          }`}
                        >
                          {shop.is_active ? "فعال" : "غیرفعال"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/shops/${shop.id}`}
                      className="px-4 py-2 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
                    >
                      مدیریت
                    </Link>
                    <Link
                      href={`/?shop=${shop.slug}`}
                      target="_blank"
                      className="px-4 py-2 text-sm rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition"
                    >
                      مشاهده سایت
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
