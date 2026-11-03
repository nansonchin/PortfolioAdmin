"use client";

import {
  ProjectCoverFormValues,
  validateProjectCover,
} from "@/lib/validation/projectCover";
import { useSectionForm } from "./hooks/useSectionForm";

type Props = {
  projectId: string;
  initialValues: ProjectCoverFormValues;
};

export default function ProjectCoverForm({ projectId, initialValues }: Props) {
  const form = useSectionForm<ProjectCoverFormValues>({
    endpoint: `/api/projects/${encodeURIComponent(projectId)}/cover`,
    initialValues,
    validate: validateProjectCover,
  });

  const { values, errors, setField} = form;

  function changeHeroSrc(next:string){
    setField("heroSrc",next)
    if(values.heroSrcSet !== ""){
        setField("heroSrcSet","")
    }
    if(values.heroSizes !== ""){
        setField("heroSizes","")
    }
  }

    const srcSetWillBeRemoved = form.saved.heroSrcSet !== "" && values.heroSrcSet === "";

}
