import { ProjectStoryFormValues } from "@/lib/validation/projectStory";
import { AdminProject } from "@/types/project";

export function toStoryFormValues(project:AdminProject):ProjectStoryFormValues{
    return{
        problem:project.story.problem,
        approach:project.story.approach,
        architecture:project.story.architecture,
        outcome:project.story.outcome
    }
}