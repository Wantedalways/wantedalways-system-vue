<template>
  <el-scrollbar class="sidebar-wrapper">
    <el-menu class="sidebar-container" router :default-active="route.path">
      <side-bar-item v-for="menuItem in menuList" :key="menuItem.path" :item="menuItem" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">

import SideBarItem from "@/layout/sidebar/SideBarItem.vue";
import usePermissionStore from "@/stores/modules/permission";
import {useRoute} from "vue-router";

const permissionStore = usePermissionStore()
const menuList = permissionStore.menuList
const route = useRoute()

</script>

<style scoped lang="scss">
  .sidebar-wrapper {

    .sidebar-container {
      border: none;
    }
  }
</style>

<style lang="scss">
  .sidebar-container {

    .el-menu-item.is-active  {
        font-weight: 600;
    }
  }
</style>
