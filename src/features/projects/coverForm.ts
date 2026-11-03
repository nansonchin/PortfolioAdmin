import { ProjectCoverFormValues } from "@/lib/validation/projectCover";
import { AdminProject } from "@/types/project";

export function toCoverFormValues(project:AdminProject):ProjectCoverFormValues{
    return{
        thumbnail:project.thumbnail,
        heroSrc:project.heroImage.src,
        heroSrcSet:project.heroImage.srcSet??"",
        heroSizes:project.heroImage.sizes?? ""
    }
}