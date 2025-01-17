<template>
  <div v-show="!item.hidden">
    <el-menu-item v-if="!hasChildren(item)" :index="item.path" @click="goRoute(item.path)">
      {{item.meta.title}}
    </el-menu-item>
    <el-sub-menu v-else :index="item.path">
      <template #title>
        {{item.meta.title}}
      </template>
      <side-bar-item v-for="child in item.children" :key="child.path" :item="child" />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

defineProps(['item'])

function hasChildren(item: any) {
  if (item.children) {
    const routeChild = item.children.filter(child => {
      return !(child.hidden || !child.meta.route);
    })
    return routeChild.length > 0;
  }
  return false
}

const router = useRouter()

function goRoute(path: string) {
  router.push(path);
}
</script>

<style scoped lang="scss">

</style>
