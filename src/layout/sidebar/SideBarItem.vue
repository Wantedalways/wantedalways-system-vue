<template>
  <div v-show="!item.hidden">
    <el-menu-item v-if="!hasChildren(item)" :index="item.path">
      <el-icon v-if="item.meta.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span :class="{'blank-icon': !item.meta.icon}">{{item.meta.title}}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="item.path">
      <template #title>
        <el-icon v-if="item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{item.meta.title}}</span>
      </template>
      <side-bar-item v-for="child in item.children" :key="child.path" :item="child" />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
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
</script>

<style scoped lang="scss">
  .blank-icon {
    margin-left: 10px;
  }
</style>


