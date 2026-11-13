import { GoldPrice } from "@/types";

// منابع رایگان قیمت ایران + تقریبی اونس جهانی
// در نسخه واقعی می‌توانید از APIهای پولی یا پروکسی خودتان استفاده کنید

export async function getLiveGoldPrices(): Promise<GoldPrice> {
  try {
    // تلاش برای گرفتن قیمت از یک منبع عمومی (نمونه)
    // در صورت نیاز می‌توانید این را با API واقعی جایگزین کنید

    // فعلاً مقادیر تقریبی بر اساس بازار فعلی (نوامبر ۲۰۲۶)
    // بعداً به API واقعی وصل می‌کنیم

    const ounce = 3880; // دلار
    const dollar = 920000; // تومان تقریبی (باید از API واقعی گرفته شود)
    const gold18 = Math.round((ounce * dollar) / 31.1035 * 0.75); // تقریبی ۱۸ عیار
    const gold24 = Math.round((ounce * dollar) / 31.1035);

    return {
      ounce_usd: ounce,
      dollar_toman: dollar,
      gold_18_toman: gold18,
      gold_24_toman: gold24,
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    // مقادیر پیش‌فرض در صورت خطا
    return {
      ounce_usd: 3880,
      dollar_toman: 920000,
      gold_18_toman: 86000000,
      gold_24_toman: 114700000,
      updated_at: new Date().toISOString(),
    };
  }
}

export function calculateProductPrice(
  weight: number,
  karat: number,
  gold18Price: number,
  profitPercent: number = 5
): number {
  const pureGoldRatio = karat / 24;
  const basePrice = weight * pureGoldRatio * (gold18Price / 0.75);
  const finalPrice = basePrice * (1 + profitPercent / 100);
  return Math.round(finalPrice);
}
