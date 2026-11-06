import { createSectionPutHandler } from "@/lib/api/sectionRoute";
import { updateProjectTranslation } from "@/lib/db/translationRepository";
import { toTranslationFormValues } from "@/lib/translation/form";
import { projectTranslationSchema } from "@/lib/validation/projectTranslation";

export const PUT =createSectionPutHandler({
    schema:projectTranslationSchema,
    update:(id,translation)=>updateProjectTranslation(id,"zh",translation),
    toValues:({project,translation})=>toTranslationFormValues(project,translation)

})