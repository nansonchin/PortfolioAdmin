import { toCoverFormValues } from "@/features/projects/coverForm";
import { createSectionPutHandler } from "@/lib/api/sectionRoute";
import { updateProjectCover } from "@/lib/db/projectRepository";
import { projectCoverSchema } from "@/lib/validation/projectCover";

export const PUT = createSectionPutHandler({
    schema:projectCoverSchema,
    update:updateProjectCover,
    toValues:toCoverFormValues,
})