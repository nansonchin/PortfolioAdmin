import { AllowedImageType, UploadPurpose } from "../validation/upload";

const EXTENSIONS:Record<AllowedImageType,string>={
    "image/webp":"webp",
    "image/png":"png",
    "image/jpeg":"jpg"
}

export function buildObjectKey(input:{
    projectId:string;
    purpose:UploadPurpose;
    contentType:AllowedImageType
}):string{
    const extension = EXTENSIONS[input.contentType];
      return `projects/${input.projectId}/${input.purpose}/${crypto.randomUUID()}.${extension}`;

}