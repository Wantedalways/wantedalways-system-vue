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
      min-width: $sidebarWidth;
    }

    .app-content {

      .tags {
        height: 34px;
        padding: 0 10px;
        border-bottom: 1px solid #d8dce5;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
      }
    }

  }
}

</style>
