import { createDocumentPutHandler } from "@/lib/api/documentRoute";
import { getSiteDocument, saveSiteDocument } from "@/lib/db/siteRepository";
import { toProfileFormValues } from "@/lib/validation/siteContent";
import { toProfileTranslationForm } from "@/lib/translation/site";
import type { Profile, ProfileTranslation } from "@/types/site";
import { profileTranslationSchema } from "@/lib/translation/siteValidation";

export const PUT = createDocumentPutHandler({
  schema: profileTranslationSchema,
  save: async (translation) => {
    await saveSiteDocument<ProfileTranslation>("profile", "zh", translation);

    const english = await getSiteDocument<Profile>("profile", "en");
    return toProfileTranslationForm(toProfileFormValues(english), translation);
  },
});