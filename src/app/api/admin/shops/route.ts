import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, custom_domain, business_type, about_us, phone, address } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "نام و اسلاگ الزامی است" }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await client.execute({
      sql: "SELECT id FROM shops WHERE slug = ?",
      args: [slug],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده است" }, { status: 400 });
    }

    // Insert shop
    const shopResult = await client.execute({
      sql: `INSERT INTO shops (name, slug, custom_domain, business_type, is_active) 
            VALUES (?, ?, ?, ?, 1) RETURNING id`,
      args: [name, slug, custom_domain || null, business_type || "gold"],
    });

    const shopId = (shopResult.rows[0] as any).id;

    // Insert default settings
    await client.execute({
      sql: `INSERT INTO shop_settings (shop_id, about_us, phone, address) 
            VALUES (?, ?, ?, ?)`,
      args: [shopId, about_us || null, phone || null, address || null],
    });

    return NextResponse.json({ success: true, id: shopId });
  } catch (error: any) {
    console.error("Create shop error:", error);
    return NextResponse.json(
      { error: error.message || "خطا در ایجاد فروشگاه" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const result = await client.execute("SELECT * FROM shops ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
