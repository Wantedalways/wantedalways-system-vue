<template>
  <el-switch v-model="theme"
             :inactive-action-icon="Sunny"
             class="switch">
    <template #active-action>

    </template>
  </el-switch>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {Sunny} from "@element-plus/icons-vue";

const theme = ref(false)
</script>

<style scoped lang="scss">

</style>
