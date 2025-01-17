<template>
  <el-scrollbar class="sidebar-wrapper">
    <el-menu class="sidebar-container">
      <side-bar-item v-for="menuItem in menuList" :key="menuItem.path" :item="menuItem" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">

import SideBarItem from "@/layout/sidebar/SideBarItem.vue";
import usePermissionStore from "@/stores/modules/permission";

const permissionStore = usePermissionStore()
const menuList = permissionStore.menuList

</script>

<style scoped lang="scss">
  .sidebar-wrapper {
    border-right: 1px solid var(--el-menu-border-color);

    .sidebar-container {
      border: none;
    }
  }
</style>
