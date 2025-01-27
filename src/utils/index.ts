import storage from "@/utils/storage";
import {DATA_DICT} from "@/constant/cache";
import type {DataDict, DictItem} from "@/utils/type/type";

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

/**
 * 获取数据字典
 */
export const getDict = (dictCode: string): DictItem | null => {
  if (storage.get(DATA_DICT) && storage.get(DATA_DICT)[dictCode]) {
    return storage.get(DATA_DICT)[dictCode];
  }
  return null;
}
