/**
 * 获取assets中的静态资源
 * @param url 资源路径
 */
export const getAssets = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href;
}
