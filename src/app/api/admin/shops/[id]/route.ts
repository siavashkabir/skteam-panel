import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const shopId = Number(id);
    const body = await req.json();

    // Update shop
    await client.execute({
      sql: `UPDATE shops SET 
        name = ?, 
        slug = ?, 
        custom_domain = ?, 
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
      args: [
        body.name,
        body.slug,
        body.custom_domain || null,
        body.is_active ? 1 : 0,
        shopId,
      ],
    });

    // Update or insert settings
    const existing = await client.execute({
      sql: "SELECT id FROM shop_settings WHERE shop_id = ?",
      args: [shopId],
    });

    if (existing.rows.length > 0) {
      await client.execute({
        sql: `UPDATE shop_settings SET 
          about_us = ?,
          phone = ?,
          address = ?,
          instagram_url = ?,
          telegram_url = ?,
          payment_gateway = ?,
          payment_merchant_id = ?,
          payment_api_key = ?,
          payment_is_active = ?,
          gold_profit_percent = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE shop_id = ?`,
        args: [
          body.about_us || null,
          body.phone || null,
          body.address || null,
          body.instagram_url || null,
          body.telegram_url || null,
          body.payment_gateway || "zarinpal",
          body.payment_merchant_id || null,
          body.payment_api_key || null,
          body.payment_is_active ? 1 : 0,
          body.gold_profit_percent || 5,
          shopId,
        ],
      });
    } else {
      await client.execute({
        sql: `INSERT INTO shop_settings (
          shop_id, about_us, phone, address, instagram_url, telegram_url,
          payment_gateway, payment_merchant_id, payment_api_key, payment_is_active, gold_profit_percent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          shopId,
          body.about_us || null,
          body.phone || null,
          body.address || null,
          body.instagram_url || null,
          body.telegram_url || null,
          body.payment_gateway || "zarinpal",
          body.payment_merchant_id || null,
          body.payment_api_key || null,
          body.payment_is_active ? 1 : 0,
          body.gold_profit_percent || 5,
        ],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update shop error:", error);
    return NextResponse.json(
      { error: error.message || "خطا در به‌روزرسانی" },
      { status: 500 }
    );
  }
}
