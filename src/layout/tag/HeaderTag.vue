<template>
  <el-scrollbar class="tags-container">
    <el-tag closable size="large" class="tag-item" type="info">首页</el-tag>
    <el-tag closable size="large" class="tag-item">标签</el-tag>
  </el-scrollbar>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
  .tags-container {
    display: flex;
    padding: 5px 0 0 0;

    .tag-item {
      margin-left: 3px;
    }
  }
</style>
