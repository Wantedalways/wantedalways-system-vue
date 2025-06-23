<template>
  <el-switch
    v-model="theme"
    :inactive-action-icon="Sunny"
    class="switch"
    @change="toggleDark"
  >
  </el-switch>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Sunny} from '@element-plus/icons-vue'
import {useDark, useToggle} from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const theme = ref(false)
</script>

<style scoped lang="scss"></style>
