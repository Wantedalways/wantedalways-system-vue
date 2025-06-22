<template>
  <el-breadcrumb class="breadcrumb-container">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
        <span
          v-if="index === levelList.length - 1 || item.redirect === ''"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'

const levelList = ref([])
const route = useRoute()
const router = useRouter()

function getBreadcrumb() {
  let routeRecords = route.matched.filter(item => item.meta && item.meta.title)
  const first = routeRecords[0]

  if (!isHome(first)) {
    routeRecords = [{ path: '/home', meta: { title: '首页' } }].concat(
      routeRecords,
    )
  }
  levelList.value = routeRecords
}

function isHome(route) {
  const routeName = route && route.name
  if (!routeName) {
    return false
  }
  return routeName.trim() === 'HomeView'
}

function handleLink(item) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

watch(route, () => {
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})

onMounted(() => {
  getBreadcrumb()
})
</script>

<style scoped lang="scss">
.breadcrumb-container {
  display: inline-block;
  line-height: 15px;
  height: 15px;
  border-left: 2px solid var(--el-menu-border-color);
  padding-left: 11px;
  margin: 20px 0;

  .no-redirect {
    color: #97a8be;
  }
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
