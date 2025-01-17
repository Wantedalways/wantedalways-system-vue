<template>
  <el-breadcrumb class="breadcrumb-container">
    <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
      <span v-if="index === levelList.length - 1 || item.redirect === ''">{{item.meta.title}}</span>
      <a v-else @click.prevent="handleLink(item)">{{item.meta.title}}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
  import {onMounted, ref, watch} from "vue";

  const levelList = ref([])
  const route = useRoute()
  const router = useRouter()

  function getBreadcrumb() {
    let routeRecords = route.matched.filter(item => item.meta && item.meta.title)
    const first = routeRecords[0]

    if (!isHome(first)) {
      routeRecords = [{path: '/home', meta: {title: '首页'}}].concat(routeRecords)
    }
    levelList.value = routeRecords
  }

  function isHome(route) {
    const routeName = route && route.name
    if (!routeName) {
      return false;
    }
    return routeName.trim().toLocaleLowerCase() === 'home'
  }

  function handleLink(item) {
    const {redirect, path} = item
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
  }
</style>
