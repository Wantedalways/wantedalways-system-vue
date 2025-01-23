/**
 * 获取assets中的静态资源
 * @param url 资源路径
 */
export const getAssets = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href;
}

/**
 * 判断字符串中指定字符的数量
 */
export const countCharacter = (str: string, char: string) => {
  const regex = new RegExp(char, "g");
  return (str.match(regex) || []).length;
}
