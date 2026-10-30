const PORTFOLIO_ORIGIN = (
  process.env.NEXT_PUBLIC_PORTFOLIO_ORIGIN ?? ""
).replace(/\/+$/, "");

export function resolvePreviewSrc(value: string): string | null {
  const url = value.trim();

  if (url === "") return null;

  if (/^https?:\/\//i.test(url)) return url;

  if (url.startsWith("/") && !url.startsWith("//") && PORTFOLIO_ORIGIN) {
    return `${PORTFOLIO_ORIGIN}${url}`;
  }

  return null;
}
