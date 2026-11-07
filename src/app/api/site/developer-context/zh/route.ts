import { createDocumentPutHandler } from "@/lib/api/documentRoute";
import { getSiteDocument, saveSiteDocument } from "@/lib/db/siteRepository";
import { toDeveloperFormValues } from "@/lib/validation/siteContent";
import { toDeveloperTranslationForm } from "@/lib/translation/site";
import type { DeveloperContext, DeveloperContextTranslation } from "@/types/site";
import { developerTranslationSchema } from "@/lib/translation/siteValidation";

export const PUT = createDocumentPutHandler({
  schema: developerTranslationSchema,
  save: async (translation) => {
    await saveSiteDocument<DeveloperContextTranslation>("developer_context", "zh", translation);

    const english = await getSiteDocument<DeveloperContext>("developer_context", "en");
    return toDeveloperTranslationForm(toDeveloperFormValues(english), translation);
  },
});