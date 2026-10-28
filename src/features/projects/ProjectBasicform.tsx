import { ProjectBasicFormValues } from "@/lib/validation/projectBasic";
import {useRouter} from "next/navigation"
import { useEffect, useMemo, useState } from "react";

type Props={
    projectId:string;
    initialValues:ProjectBasicFormValues;
}

type Message ={type:"ok" | "error"; text:string}

export default function  ProjectBasicForm({projectId,initialValues}:Props){
    const router = useRouter();

    const [saved,setSaved] = useState(initialValues);
    const [values,setValues] = useState(initialValues)
    const [errors,setErrors] = useState<Record<string,string>>();
    const [saving,setSaving] =  useState(false)
    const [message,setMessage] = useState<Message|null>(null)

    const dirty = useMemo(()=>(Object.keys(values)as (keyof ProjectBasicFormValues)[]).some((key=>values[key]!==saved[key])),[values,saved])

    useEffect(()=>{
        if(!dirty){
            return
        }

        const warn = (event:BeforeUnloadEvent){
            event.preventDefault()
        }

        window.addEventListener("beforeunload",warn)

        return()=>window.removeEventListener("beforeunload",warn)

    },[dirty])

    const setField:K extends keyof ProjectBasicFormValues =(
        key:K,
        value:ProjectBasicFormValues[K]
     ) =>{
        setValues((current)=>({...current,[key]:value}));
        setErrors((current)=>{
            if(!(key in current)) return current;
        })
    }
}