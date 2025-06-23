<template>
  <router-view v-slot="{ Component, route }" class="main-container">
    <transition>
      <keep-alive :include="cached">
        <Component :is="Component" v-if="flag" :key="route.name" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/modules/app'
import {nextTick, ref, watch} from 'vue'

const appStore = useAppStore()
const flag = ref(true)

const cached = appStore.cachedTags

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

<style scoped lang="scss">
.main-container {
  height: 100%;
}
</style>
