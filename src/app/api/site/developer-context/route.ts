import { createDocumentPutHandler } from "@/lib/api/documentRoute";
import { saveSiteDocument } from "@/lib/db/siteRepository";
import { developerContextSchema } from "@/lib/validation/siteContent";
import type { DeveloperContext } from "@/types/site";

export const PUT = createDocumentPutHandler({
  schema: developerContextSchema,
  save: (context) => saveSiteDocument<DeveloperContext>("developer_context", "en", context),
});