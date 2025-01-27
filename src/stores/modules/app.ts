import {defineStore} from "pinia";

const useAppStore = defineStore('app', {
  state() {
    return {
      visitedTags: [],
      cachedTags: ['blankLayout'],
      refreshFlag: true
    }
  },
  actions: {
    /**
     * 添加已访问标签
     * @param tag
     */
    async addVisitedTag(tag) {
      if (this.visitedTags.some(t => t.path === tag.path)) {
        return
      }
      // 使用Object.assign复制并创建新对象。
      this.visitedTags.push(Object.assign({}, tag))
    },
    /**
     * 添加缓存标签
     * @param tag
     */
    async addCachedTag(tag) {
      if (this.cachedTags.includes(tag.name)) {
        return
      }
      this.cachedTags.push(tag.name)
    },
    /**
     * 移除已访问标签
     * @param tag
     */
    async removeVisitedTag(tag) {
      for (const [key, value] of this.visitedTags.entries()) {
        if (value.path === tag.path) {
          this.visitedTags.splice(key, 1)
        }
      }
    },
    /**
     * 移除缓存的标签
     */
    async removeCachedTag(tag) {
      const index = this.cachedTags.indexOf(tag.name)
      if (index > -1) {
        this.cachedTags.splice(index, 1)
      }
    },
    /**
     * 刷新页面
     */
    async refresh() {
      this.refreshFlag = !this.refreshFlag
    },
    /**
     * 删除其他标签
     */
    async removeOtherTag(tag) {
      this.visitedTags = this.visitedTags.filter(t => {
        return t.meta.affix || t.path === tag.path
      })

      const index = this.cachedTags.indexOf(tag.name)
      if (index > -1) {
        this.cachedTags = [tag.name]
      } else {
        this.cachedTags = ['blankLayout']
      }
    },
    /**
     * 删除所有标签
     */
    async removeAllTags() {
      this.visitedTags = this.visitedTags.filter(t => t.meta.affix)
      this.cachedTags = ['blankLayout']
    },
    /**
     * 更新标签
     */
    updateVisitedTag(tag) {
      for (const t of this.visitedTags) {
        if (t.path === tag.path) {
          Object.assign(t, tag)
          break
        }
      }
    }
  }
})

export default useAppStore
