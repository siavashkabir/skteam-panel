import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const shop_slug = formData.get("shop_slug") as string;
    const customer_name = formData.get("customer_name") as string;
    const customer_mobile = formData.get("customer_mobile") as string;
    const customer_email = (formData.get("customer_email") as string) || null;
    const description = (formData.get("description") as string) || null;
    const image = formData.get("image") as File | null;

    if (!shop_slug || !customer_name || !customer_mobile) {
      return NextResponse.json({ error: "اطلاعات الزامی ناقص است" }, { status: 400 });
    }

    const shopResult = await client.execute({
      sql: "SELECT id FROM shops WHERE slug = ? AND is_active = 1",
      args: [shop_slug],
    });
    if (shopResult.rows.length === 0) {
      return NextResponse.json({ error: "فروشگاه یافت نشد" }, { status: 404 });
    }
    const shopId = (shopResult.rows[0] as any).id;

    let imageUrl: string | null = null;
    if (image && image.size > 0) {
      const ext = image.name.split(".").pop() || "jpg";
      const fileName = `custom-orders/${shopId}/${Date.now()}.${ext}`;
      const buffer = Buffer.from(await image.arrayBuffer());

      const { data, error } = await supabaseAdmin.storage
        .from("products")
        .upload(fileName, buffer, {
          contentType: image.type,
          upsert: false,
        });

      if (!error && data) {
        const { data: pub } = supabaseAdmin.storage.from("products").getPublicUrl(data.path);
        imageUrl = pub.publicUrl;
      }
    }

    await client.execute({
      sql: `INSERT INTO custom_orders (shop_id, customer_name, customer_mobile, customer_email, description, image_url, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      args: [shopId, customer_name, customer_mobile, customer_email, description, imageUrl],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Custom order error:", error);
    return NextResponse.json({ error: error.message || "خطا در ثبت سفارش" }, { status: 500 });
  }
}
