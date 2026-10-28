type ToggleProps={
    checked:boolean;
    onChange:(next:boolean)=>void;
    label:string;
    disabled?:boolean;
}

export default function Toggle({checked,onChange,label,disabled}:ToggleProps){
    return(
        <button type ="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={()=>onChange(!checked)}
            className={`relative h-5 w-10 shrink-0 border transition disabled:opacity-50 
                ${checked? "border-gold bg-gold/20": "border-line bg-ink"}`}
        >
            <span className={`absolute top-0.5 left-0.5 size-3.5 transition-transform ${checked? "translate-x-5 bg-gold":"bg-muted"}`}/>

        </button>
    )
}