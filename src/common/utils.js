/* 防抖，参数： 1. 调用的函数 2. 等待的时间 */
export function debounce(func, delay) {
  let timer = null
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay);
  }
}