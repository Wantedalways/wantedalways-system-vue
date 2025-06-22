<template>
  <el-dialog v-model="visible" title="选择图标" width="60%">
    <el-input
      v-model="searchText"
      placeholder="搜索图标..."
      clearable
      prefix-icon="Search"
    />

    <el-scrollbar height="400px">
      <div class="icon-grid">
        <div
          v-for="icon in filteredIcons"
          :key="icon"
          class="icon-item"
          :class="{ 'icon-active': selectedIcon === icon }"
          @click="handleSelect(icon)"
        >
          <el-icon :size="24">
            <component :is="icon" />
          </el-icon>
          <div class="icon-name">{{ icon }}</div>
        </div>
      </div>
    </el-scrollbar>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="confirmSelection">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const props = defineProps(['modelValue', 'visible'])

const emit = defineEmits(['update:modelValue', 'update:visible'])

// 获取所有图标名称
const allIcons = Object.keys(ElementPlusIconsVue)
const visible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})
const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const searchText = ref('')
const selectedIcon = ref(modelValue.value || '')

// 过滤图标
const filteredIcons = computed(() => {
  return allIcons.filter(icon =>
    icon.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})

// 选择图标
const handleSelect = icon => {
  selectedIcon.value = icon
}

// 确认选择
const confirmSelection = () => {
  modelValue.value = selectedIcon.value
  visible.value = false
}
</script>

<script lang="ts">
export default {
  name: 'IconPicker',
}
</script>

<style scoped lang="scss">
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  padding: 10px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.icon-active {
  background-color: var(--el-color-primary-light-8);
}

.icon-name {
  margin-top: 8px;
  font-size: 12px;
  text-align: center;
  word-break: break-all;
}
</style>
