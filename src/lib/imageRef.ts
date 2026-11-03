import { isHttpUrl } from "./validation/projectBasic";

const STORAGE_KEY_PATTERN =
  /^projects\/[A-Za-z0-9_-]+\/(gallery|hero|thumbnail)\/[0-9a-f-]{36}\.(webp|png|jpg)$/;

export function isStorageKey(value: string): boolean {
  return STORAGE_KEY_PATTERN.test(value);
}

export function isLegacyPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}

export function isAllowedImageRef(value: string): boolean {
  return isStorageKey(value) || isLegacyPath(value) || isHttpUrl(value);
}
