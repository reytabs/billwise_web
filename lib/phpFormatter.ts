// Shared currency formatter for the app
const LOCALE = process.env.NEXT_LOCALE || process.env.LOCALE || "en-PH";
const CURRENCY = process.env.NEXT_CURRENCY || process.env.CURRENCY || "PHP";

export const phpFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
});

export function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(Number(num))) return phpFormatter.format(0);
  return phpFormatter.format(Number(num));
}

export default phpFormatter;
