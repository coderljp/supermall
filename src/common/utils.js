/**
 * 防抖动(频繁刷新，请求等)
 */
export function debounce(func,depay){
 let timer = null
 return  function(...args){
   if(timer) clearTimeout(timer)
     timer = setTimeout(() => {
     func.apply(this,args)
   },depay)
 }
}