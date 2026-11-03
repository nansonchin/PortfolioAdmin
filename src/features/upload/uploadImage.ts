import {
  ALLOWED_IMAGES_TYPES,
  AllowedImageType,
  MAX_IMAGE_BYTES,
  UploadPurpose,
} from "@/lib/validation/upload";

export class UploadError extends Error {}

type PresignResponse = {
  uploadUrl?: string;
  key?: string;
  headers: Record<string, string>;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function isAllowedType(type: string): type is AllowedImageType {
  return (ALLOWED_IMAGES_TYPES as readonly string[]).includes(type);
}

export async function uploadImage(input: {
  file: File;
  projectId: string;
  purpose: UploadPurpose;
}): Promise<string> {
  const { file, projectId, purpose } = input;

  if (!isAllowedType(file.type)) {
    throw new UploadError("Only WebP, PNG or JPEG images are allowed.");
  }
  if (file.size === 0) {
    throw new UploadError("The file is empty.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadError("The image is larger than 5 MB.");
  }

  const presignResponse = await fetch("/api/uploads/presign",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({projectId,purpose,contentType:file.type,size:file.size})
  })

  const presign = (await presignResponse.json().catch(() => null)) as PresignResponse | null;
  if(!presignResponse.ok || !presign?.uploadUrl || !presign.key || !presign.headers){
    const firstFieldError = presign?.fieldErrors ? Object.values(presign.fieldErrors)[0]:undefined;
        throw new UploadError(firstFieldError ?? presign?.error??"Could not get an upload URL")
    
  }

  let putResponse:Response;

  try{
    putResponse=await fetch(presign.uploadUrl,{
        method:"PUT",
        headers:presign.headers,
        body:file
    })
  }catch{
    throw new UploadError(
        "Could not reach the storage server. Is Docker running, and is CORS configured??"
    )
  }

   if (!putResponse.ok) {
    throw new UploadError(`The storage server rejected the upload (HTTP ${putResponse.status}).`);
  }

  return presign.key;
}
