import { ProjectStatus } from "@/types/project";
import { ProjectListItem } from "./listItem";

export const ALL ="all";

export type ProjectFilters={
    query:string;
    status:typeof ALL | ProjectStatus
    category:string;
    featuredOnly:boolean
}

export const DEFAULT_FILTERS:ProjectFilters={
    query:"",
    status:ALL,
    category:ALL,
    featuredOnly:false
}

export function filterProjects(
    items:ProjectListItem[],
    filters:ProjectFilters,
):ProjectListItem[]{
    const query = filters.query.trim().toLowerCase();

    return items.filter((item)=>{
        if(filters.status !== ALL && item.status !==filters.status) return false;
        if(filters.category !== ALL && item.category !== filters.category) return false;
        if(filters.featuredOnly && !item.featured) return false;

        if(query){
            const haystack = [item.title,item.slug,item.category,...item.technologies].join(" ").toLowerCase()
            if(!haystack.includes(query)) return false;
        }

        return true;
    })
}

export function getCategories(items:ProjectListItem[],):string[]{
    return [...new Set(items.map((item)=>item.category).filter(Boolean))].sort(
        (a,b)=>a.localeCompare(b),
    )
}