import { customRef, type Ref, unref } from 'vue'

/**
 * 创建一个防抖的 ref
 * @param value 初始值
 * @param delay 防抖延迟时间(毫秒)，默认300ms
 */
export function useDebouncedRef<T>(value: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>

  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

// import { Ref, unref } from 'vue'

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 防抖延迟时间(毫秒)，默认300ms
 * @returns 防抖后的函数
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 防抖函数，支持响应式 delay
 * @param fn 要执行的函数
 * @param delay 防抖延迟时间(毫秒)，可以是ref或普通值，默认500ms
 * @returns 防抖后的函数
 */
export function useDebounceFnWithRefDelay<T extends (...args: any[]) => any>(
  fn: T,
  delay: number | Ref<number> = 500
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const currentDelay = unref(delay)
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, args)
    }, currentDelay)
  }
}
