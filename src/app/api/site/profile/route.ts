import { createDocumentPutHandler } from "@/lib/api/documentRoute";
import { saveSiteDocument } from "@/lib/db/siteRepository";
import { profileSchema } from "@/lib/validation/siteContent";
import type { Profile } from "@/types/site";

export const PUT = createDocumentPutHandler({
  schema: profileSchema,
  save: (profile) => saveSiteDocument<Profile>("profile", "en", profile),
});