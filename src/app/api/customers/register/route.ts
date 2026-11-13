import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shop_slug, full_name, email, password, national_id, mobile, address, city } = body;

    if (!shop_slug || !full_name || !email || !password || !national_id || !mobile) {
      return NextResponse.json({ error: "لطفاً تمام فیلدهای الزامی را پر کنید" }, { status: 400 });
    }

    if (String(national_id).length !== 10) {
      return NextResponse.json({ error: "کد ملی باید ۱۰ رقم باشد" }, { status: 400 });
    }

    const shopResult = await client.execute({
      sql: "SELECT id FROM shops WHERE slug = ? AND is_active = 1",
      args: [shop_slug],
    });
    if (shopResult.rows.length === 0) {
      return NextResponse.json({ error: "فروشگاه یافت نشد" }, { status: 404 });
    }
    const shopId = (shopResult.rows[0] as any).id;

    const existing = await client.execute({
      sql: "SELECT id FROM customers WHERE shop_id = ? AND email = ?",
      args: [shopId, email.toLowerCase().trim()],
    });
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "این ایمیل قبلاً ثبت شده است" }, { status: 400 });
    }

    const passwordHash = `$2a$12$registered_${Buffer.from(password).toString("base64").slice(0, 20)}`;

    await client.execute({
      sql: `INSERT INTO customers (shop_id, email, password_hash, full_name, national_id, mobile, address, city)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        shopId,
        email.toLowerCase().trim(),
        passwordHash,
        full_name.trim(),
        national_id,
        mobile,
        address || null,
        city || null,
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: error.message || "خطا در ثبت‌نام" }, { status: 500 });
  }
}
