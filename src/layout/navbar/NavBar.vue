<template>
  <div class="navbar-wrapper">
    <div class="navbar-container">
      <div class="logo-container">
        <a href="/" class="logo-link">
          <el-image :src="getAssets('image/logo.png')" class="logo" />
        </a>
      </div>
      <div class="breadcrumb">
        <nav-breadcrumb />
      </div>
      <div class="content">
        <div class="theme-switch" v-show="false">
          <theme-switch />
        </div>
        <div class="profile">
          <nav-profile />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getAssets} from '@/utils'
import ThemeSwitch from '@/layout/navbar/ThemeSwitch.vue'
import NavProfile from '@/layout/navbar/NavProfile.vue'
import NavBreadcrumb from '@/layout/navbar/NavBreadcrumb.vue'
</script>

<style scoped lang="scss">
.navbar-wrapper {
  height: $navbarHeight;
  padding: 0 20px;
  border-bottom: 1px solid #dcdfe6;
  /*background-image: radial-gradient(transparent 1px, #ffffff 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);*/

  .navbar-container {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;

    .logo-container {
      display: flex;
      align-items: center;
      height: $navbarHeight;
      width: $sidebarWidth;
      min-width: $sidebarWidth;

      .logo-link {
        height: 28px;
        margin-left: 20px;

        .logo {
          position: relative;
          height: 100%;
        }
      }
    }

    .breadcrumb {
      height: $navbarHeight;
      flex-grow: 1;
    }

    .content {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .theme-switch,
      .profile {
        display: flex;
        justify-content: center;
        align-items: center;
        height: $navbarHeight;
        width: $navbarHeight;
      }
    }
  }
}
</style>
