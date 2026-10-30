import { toGalleryFormValues } from "@/features/projects/galleryForm";
import { createSectionPutHandler } from "@/lib/api/sectionRoute";
import { updateProjectGallery } from "@/lib/db/projectRepository";
import { projectGallerySchema } from "@/lib/validation/projectGallery";

export const PUT = createSectionPutHandler({
    schema:projectGallerySchema,
    update:updateProjectGallery,
    toValues:toGalleryFormValues,
})