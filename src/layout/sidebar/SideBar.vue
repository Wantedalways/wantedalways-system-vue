<template>
  <el-scrollbar class="sidebar-wrapper">
    <el-menu class="sidebar-container">
      <el-sub-menu index="1">
        <template #title>
          组织架构
        </template>
        <el-menu-item>
          部门管理
        </el-menu-item>
        <el-menu-item>
          用户管理
        </el-menu-item>
        <el-menu-item>
          职位管理
        </el-menu-item>
        <el-menu-item>
          用户组管理
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          系统设置
        </template>
        <el-menu-item>
          角色管理
        </el-menu-item>
        <el-menu-item>
          权限管理
        </el-menu-item>
        <el-menu-item>
          数据字典
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
  .sidebar-wrapper {
    border-right: 1px solid var(--el-menu-border-color);

    .sidebar-container {
      border: none;
    }
  }
</style>
