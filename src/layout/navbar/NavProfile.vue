<template>
  <el-dropdown placement="bottom-start">
    <el-icon class="avatar">
      <UserFilled />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="EditPen">修改密码</el-dropdown-item>
        <el-dropdown-item :icon="SwitchButton" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">

import {EditPen, SwitchButton, UserFilled} from "@element-plus/icons-vue";
</script>

<style scoped lang="scss">
  .avatar {
    font-size: 24px;
    cursor: pointer;
  }
</style>
