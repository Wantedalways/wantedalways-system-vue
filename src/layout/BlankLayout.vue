<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="cached">
        <component :is="Component" :key="route.name" v-if="flag" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/modules/app'
import {nextTick, ref, watch} from 'vue'

const appStore = useAppStore()
const cached = appStore.cachedTags

const flag = ref(true)
watch(
  () => appStore.refreshFlag,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script lang="ts">
export default {
  name: 'blankLayout',
}
</script>

<style scoped lang="scss"></style>
