const debounce = (fn,delay=500)=>{
    let timer 
    return (...args)=>{
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this,args)
        }, delay);
    }
}