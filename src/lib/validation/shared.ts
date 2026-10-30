export type ValidationResult = 
    | {ok:true}
    | {ok:false, errors:Record<string,string>};