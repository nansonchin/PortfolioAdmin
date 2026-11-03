import { isLegacyPath, isStorageKey } from "./imageRef";
import { isHttpUrl } from "./validation/projectBasic";

const PORTFOLIO_ORIGIN = (
  process.env.NEXT_PUBLIC_PORTFOLIO_ORIGIN ?? ""
).replace(/\/+$/, "");

const STORAGE_PUBLIC_BASE = (process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");


export function resolvePreviewSrc(value: string): string | null {
  const ref = value.trim();
  if (ref === "") return null;

  if (isHttpUrl(ref)) return ref;
  if (isStorageKey(ref)) return STORAGE_PUBLIC_BASE ? `${STORAGE_PUBLIC_BASE}/${ref}` : null;
  if (isLegacyPath(ref)) return PORTFOLIO_ORIGIN ? `${PORTFOLIO_ORIGIN}${ref}` : null;

  return null;
}
