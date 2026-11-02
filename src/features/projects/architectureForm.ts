import { AdminProject, ArchitectureNode, ProjectArchitectureSection } from "@/types/project";

export function toArchitectureFormValues(project:AdminProject):ProjectArchitectureSection{
    return {architecture:project.architecture??null}
}

export function createNode(title =""):ArchitectureNode{
    return{
        id:crypto.randomUUID(),
        title
    }
}

export function createArchitecture():NonNullable<ProjectArchitectureSection["architecture"]>{
    return {
        title:"Architecture",
        description:"",
        root:createNode("System")
    }
}