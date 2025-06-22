<template>
  <el-scrollbar
    class="tags-container"
    ref="tagsContainer"
    @wheel="handleScroll"
    @scroll="closeMenu"
  >
    <div class="tags-content">
      <el-tag
        v-for="tag in visitedTags"
        :key="tag.path"
        :closable="!tag.meta.affix"
        @close="closeSelectedTag(tag)"
        @click.middle="isAffix(tag) ? '' : closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
        class="tag-item"
        :class="{ active: isActive(tag) }"
        :type="isActive(tag) ? 'primary' : 'info'"
        :effect="isActive(tag) ? 'dark' : 'plain'"
        ref="tags"
        v-bind="{ tagData: tag }"
      >
        <router-link
          :to="{ path: tag.path, query: tag.query }"
          custom
          v-slot="{ navigate }"
        >
          <span @click="navigate">{{ tag.meta.title }}</span>
        </router-link>
      </el-tag>
    </div>
  </el-scrollbar>

  <ul
    v-show="menuVisible"
    :style="{ left: menuLeft + 'px', top: menuTop + 'px' }"
    class="contextmenu"
  >
    <li @click="reload(selectedTag)">刷新</li>
    <li v-show="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
      关闭
    </li>
    <li @click="closeOthers(selectedTag)">关闭其他</li>
    <li @click="closeAll(selectedTag)">关闭所有</li>
  </ul>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/modules/app'
import { useRoute, useRouter } from 'vue-router'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import usePermissionStore from '@/stores/modules/permission'
import path from 'path-browserify'
import { ElScrollbar } from 'element-plus'

const appStore = useAppStore()
const visitedTags = computed(() => appStore.visitedTags)
let affix = []

/**
 * 初始化固定展示的标签
 */
function initTags() {
  const permissionStore = usePermissionStore()
  const affixTags = (affix = filterAffixTags(permissionStore.routes))
  for (const tag of affixTags) {
    if (tag.name) {
      appStore.addVisitedTag(tag)
    }
  }
}

/**
 * 预生成固定展示的标签数组
 */
function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length > 0) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}

const route = useRoute()
const router = useRouter()

/**
 * 添加标签
 */
async function addTag() {
  const { name, meta } = route
  if (name) {
    await appStore.addVisitedTag(route)
    if (meta && meta.cache) {
      await appStore.addCachedTag(route)
    }
  }
}

/**
 * 关闭选择的标签
 */
async function closeSelectedTag(tag) {
  await appStore.removeVisitedTag(tag)
  await appStore.removeCachedTag(tag)
  if (isActive(tag)) {
    await router.push('/home')
  }
}

/**
 * 判断是否为活跃状态
 */
function isActive(tag) {
  return tag.path === route.path
}

/**
 * 判断是否为固定标签
 */
function isAffix(tag) {
  return tag.meta && tag.meta.affix
}

// 右键菜单visible
const menuVisible = ref(false)
// 菜单坐标
const menuLeft = ref(0)
const menuTop = ref(0)
const selectedTag = ref({})
const tagsContainer = ref()

/**
 * 打开菜单
 */
function openMenu(tag, e) {
  // 菜单宽度
  const menuWidth = 150

  const offsetWidth = tagsContainer.value.offsetWidth
  const maxLeft = offsetWidth - menuWidth
  const left = e.clientX + 15
  if (left > maxLeft) {
    menuLeft.value = maxLeft
  } else {
    menuLeft.value = left
  }
  menuTop.value = e.clientY

  menuVisible.value = true
  selectedTag.value = tag
}

/**
 * 关闭菜单
 */
function closeMenu() {
  menuVisible.value = false
}

/**
 * 刷新当前标签页
 */
async function reload(tag) {
  await appStore.removeCachedTag(tag)
  await appStore.refresh()
  await addTag()
}

/**
 * 关闭其他标签
 */
async function closeOthers(tag) {
  await router.push(tag)
  await appStore.removeOtherTag(tag)
}

/**
 * 关闭所有标签
 */
async function closeAll(tag) {
  await appStore.removeAllTags()
  if (affix.some(t => t.path === tag.path)) {
    return
  }
  await router.push('/home')
}

/**
 * 滚动事件
 */
function handleScroll(e) {
  const eventDelta = -e.wheelDelta || -e.deltaY * 40
  tagsContainer.value!.setScrollLeft(
    tagsContainer.value.wrapRef.scrollLeft + eventDelta / 4,
  )
}

const tags = ref()

/**
 * 滚动到目标标签
 * @param targetTag
 */
function scrollToTarget(targetTag) {
  const containerWidth = tagsContainer.value.offsetWidth
  const wrap = tagsContainer.value.wrapRef

  let firstTag
  let lastTag
  // 确定第一个和最后一个标签
  if (tags.value.length > 0) {
    firstTag = tags.value[0]
    lastTag = tags.value[tags.value.length - 1]
  }

  if (firstTag === targetTag) {
    wrap.scrollLeft = 0
  } else if (lastTag === targetTag) {
    wrap.scrollLeft = wrap.scrollWidth - containerWidth
  } else {
    // 找到目前前后两个标签
    const targetIndex = tags.value.findIndex(item => item === targetTag)
    const preTag = tags.value[targetIndex - 1]
    const nextTag = tags.value[targetIndex + 1]

    const tagSpacing = 5
    const beforePreTagOffsetLeft = preTag.$el.offsetLeft - tagSpacing
    const afterNextTagOffsetLeft =
      nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagSpacing
    if (afterNextTagOffsetLeft > wrap.scrollLeft + containerWidth) {
      wrap.scrollLeft = afterNextTagOffsetLeft - containerWidth
    } else if (beforePreTagOffsetLeft < wrap.scrollLeft) {
      wrap.scrollLeft = beforePreTagOffsetLeft
    }
  }
}

/**
 * 移动到当前标签
 */
function scrollToCurrentTag() {
  nextTick(() => {
    for (const tagItem of tags.value) {
      const to = tagItem.$attrs.tagData
      if (to.path === route.path) {
        scrollToTarget(tagItem)
        if (to.fullPath !== route.fullPath) {
          appStore.updateVisitedTag(tagItem)
        }
        break
      }
    }
  })
}

watch(route, () => {
  addTag()
  scrollToCurrentTag()
})

/**
 * 点击任意位置关闭右键菜单
 */
watch(menuVisible, value => {
  if (value) {
    document.addEventListener('click', closeMenu)
  } else {
    document.removeEventListener('click', closeMenu)
  }
})

onMounted(() => {
  // 初始化预固定的标签
  initTags()
  // 添加当前标签
  addTag()
})
</script>

<style scoped lang="scss">
.tags-container {
  width: 100%;

  .tags-content {
    display: flex;
    padding-top: 4px;

    .tag-item {
      margin-right: 5px;
      height: 26px;
      cursor: pointer;

      &.active {
        // 圆形图标
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
}

.contextmenu {
  position: absolute;
  background-color: #ffffff;
  z-index: 3000;
  margin: 0;
  padding: 5px 5px;
  list-style-type: none;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}
</style>
