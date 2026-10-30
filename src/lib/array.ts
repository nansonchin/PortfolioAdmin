export function replaceAt<T>(items:T[],index:number,value:T):T[]{
    return items.map((item,i)=>(i === index? value:item))
}

export function removeAt<T>(items:T[], index:number):T[]{
    return items.filter((_,i)=>i!==index)
}

export function moveItem<T>(items:T[], index:number,delta:-1|1):T[]{
    const target = index +delta;
    if(target<0 || target>=items.length) return items;

    const next=[...items];
    [next[index],next[target]] = [next[target],next[index]]

    return next;
}