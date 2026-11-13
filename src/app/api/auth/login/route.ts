import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { createSession, checkRateLimit, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ایمیل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(email.toLowerCase())) {
      return NextResponse.json(
        { error: "تعداد تلاش‌های ورود بیش از حد مجاز است. ۱۵ دقیقه صبر کنید." },
        { status: 429 }
      );
    }

    const result = await client.execute({
      sql: "SELECT id, email, password_hash, role, shop_id, full_name, is_active FROM users WHERE email = ? LIMIT 1",
      args: [email.toLowerCase().trim()],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const user = result.rows[0] as any;

    if (!user.is_active) {
      return NextResponse.json(
        { error: "حساب کاربری غیرفعال است" },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash as string);

    if (!isValid) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    await createSession({
      id: Number(user.id),
      email: user.email as string,
      role: user.role as "super_admin" | "shop_admin",
      shop_id: user.shop_id ? Number(user.shop_id) : null,
      full_name: user.full_name as string | null,
    });

    return NextResponse.json({
      success: true,
      role: user.role,
      redirect: user.role === "super_admin" ? "/admin/dashboard" : "/admin/shop",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "خطای سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
