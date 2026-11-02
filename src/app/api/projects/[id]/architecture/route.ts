import { toArchitectureFormValues } from "@/features/projects/architectureForm";
import { createSectionPutHandler } from "@/lib/api/sectionRoute";
import { updateProjectArchiteture } from "@/lib/db/projectRepository";
import { projectArchitectureSchema } from "@/lib/validation/projectArchitecture";

export const PUT = createSectionPutHandler({
    schema:projectArchitectureSchema,
    update:updateProjectArchiteture,
    toValues:toArchitectureFormValues
})