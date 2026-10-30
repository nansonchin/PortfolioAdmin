import { toStoryFormValues } from "@/features/projects/storyForm";
import { createSectionPutHandler } from "@/lib/api/sectionRoute";
import { updateProjectStory } from "@/lib/db/projectRepository";
import { projectStorySchema } from "@/lib/validation/projectStory";

export const PUT = createSectionPutHandler({
    schema:projectStorySchema,
    update:updateProjectStory,
    toValues:toStoryFormValues
})