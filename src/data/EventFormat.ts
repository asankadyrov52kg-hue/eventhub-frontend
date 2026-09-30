const MONTHS = [
  "янв.",
  "февр.",
  "мар.",
  "апр.",
  "мая",
  "июн.",
  "июл.",
  "авг.",
  "сент.",
  "окт.",
  "нояб.",
  "дек.",
];


export function parseEventDate(value: string): { date: string; time: string } {
  const match = value.match(/^(\d{1,2})\s+(\S+)\s+(\d{4}),\s*(\d{1,2}:\d{2})$/);
  if (!match) return { date: "", time: "" };

  const monthIndex = MONTHS.indexOf(match[2]);
  if (monthIndex === -1) return { date: "", time: "" };

  const [, day, , year, time] = match;
  return {
    date: `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day.padStart(2, "0")}`,
    time: time.padStart(5, "0"),
  };
}


export function formatEventDate(date: string, time: string): string {
  const [year, month, day] = date.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}, ${time}`;
}


export function parsePrice(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}


export function formatPrice(value: number): string {
  return value === 0 ? "Бесплатно" : `${value.toLocaleString("ru-RU")} ₽`;
}


export function formatIsoDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const p = (n: number) => String(n).padStart(2, "0");
  return formatEventDate(
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`,
    `${p(d.getHours())}:${p(d.getMinutes())}`,
  );
}


export function toIsoDate(value: string): string {
  const { date, time } = parseEventDate(value);
  if (!date || !time) return value;
  return new Date(`${date}T${time}:00`).toISOString();
}