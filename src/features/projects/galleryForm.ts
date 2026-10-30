import { ProjectGalleryFormValues } from "@/lib/validation/projectGallery";
import { AdminProject, ProjectGallery, ProjectGalleryImage } from "@/types/project";

export function toGalleryFormValues(project: AdminProject): ProjectGalleryFormValues {
  return {
    gallery: project.gallery.map(({ id, imageUrl, title, description }) => ({
      id,
      imageUrl,
      title,
      description,
    })),
  };
}

export function createGalleryItem():ProjectGalleryImage{
    return{
        id:crypto.randomUUID(),
        imageUrl:"",
        title:"",
        description:""
    }
}