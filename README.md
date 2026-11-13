# SK Team - پنل مدیریت مرکزی فروشگاه‌ها

## اطلاعات ورود سوپر ادمین
- ایمیل: sk.team.it@gmail.com
- رمز عبور: Sa13591364

## دیپلوی روی Netlify

1. کد را به گیت‌هاب پوش کنید
2. در Netlify روی Import from Git کلیک کنید
3. ریپازیتوری را انتخاب کنید
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - یا از Next.js runtime استفاده کنید

5. Environment Variables را در Netlify اضافه کنید:
   - TURSO_DATABASE_URL
   - TURSO_AUTH_TOKEN
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - JWT_SECRET

## ساختار
- /login → ورود (۵ استایل مختلف)
- /admin/dashboard → پنل مادر
- /admin/shops/new → افزودن فروشگاه
- /admin/shops/[id] → مدیریت فروشگاه
- / → صفحه اصلی عمومی

## نکته امنیتی
بعد از اولین ورود، رمز عبور را از داخل پنل تغییر دهید.
