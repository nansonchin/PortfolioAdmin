import { toListsFormValues } from "@/features/projects/listsForm";
import { createSectionPutHandler } from "@/lib/api/sectionRoute";
import { updateProjectLists } from "@/lib/db/projectRepository";
import { projectListsSchema } from "@/lib/validation/projectLists";


export const PUT = createSectionPutHandler({
  schema:projectListsSchema,
  update:updateProjectLists,
  toValues:toListsFormValues,
})