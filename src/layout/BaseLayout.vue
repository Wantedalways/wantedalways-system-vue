<template>
  <div class="app-wrapper">
    <div class="app-container">
      <div class="navbar">
        <nav-bar/>
      </div>
      <el-container class="app-main">
        <div class="sidebar">
          <side-bar />
        </div>
        <el-container class="app-content">
          <el-header class="tags">
            <header-tag />
          </el-header>
          <el-main class="content">
            <app-main />
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">

import SideBar from "@/layout/sidebar/SideBar.vue";
import NavBar from "@/layout/navbar/NavBar.vue";
import HeaderTag from "@/layout/tag/HeaderTag.vue";
import AppMain from "@/layout/main/AppMain.vue";
</script>

<style scoped lang="scss">
.app-wrapper {
  height: 100%;

  .app-container {
    display: flex;
    flex-direction: column;
    height: 100%;

    .navbar {
      height: $navbarHeight;
      width: 100%;
    }

    .sidebar {
      width: $sidebarWidth;
      padding: 20px 0 20px 32px;
    }

    .tags {
      height: 40px;
      padding: 0;
      margin-right: 15px;
      border-bottom: 1px solid var(--el-menu-border-color);
    }
  }
}

</style>
