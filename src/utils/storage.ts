class storage {

  // 前缀
  prefix: string = 'W_';

  // 保存
  set(key, value: string, expire: number) {
    const valueString = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire : null
    });

    localStorage.setItem(this.prefix + key, valueString);
  }

  // 读取
  get(key: string): unknown {
    const jsonValue = localStorage.getItem(this.prefix + key);
    if (!jsonValue) {
      return null
    }

    try {
      const {value, expire} = JSON.parse(jsonValue);

      if (expire !== null || expire >= new Date().getTime()) {
        return value
      }

      this.remove(this.prefix + key);
      return null
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null
    }
  }

  // 删除
  remove(key: string) {
    localStorage.removeItem(this.prefix + key);
  }

  // 清空
  clear() {
    localStorage.clear();
  }
}

export default new storage();
