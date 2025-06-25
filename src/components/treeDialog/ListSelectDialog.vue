<template>
  <tree-dialog
    v-model:visible="visible"
    :title="title"
    v-model:selected-items="selectedItems"
    v-model:result-items="resultList"
    :type="type"
  >
    <div class="tree-wrapper">
      <el-input
        v-model="queryParams"
        :prefix-icon="Search"
        placeholder="搜索"
        class="search"
        clearable
      />
      <el-scrollbar class="tree-scrollbar">
        <el-tree
          :data="treeData"
          node-key="id"
          :expand-on-click-node="false"
          @node-click="handleSelect"
          ref="treeRef"
          check-strictly
          :filter-node-method="treeFilter"
          :default-expanded-keys="defaultExpand"
        >
          <template #default="{ data, node }">
            <el-icon class="tree-node-icon"><Management /></el-icon>
            <span>{{ data.label }}</span>
            <el-icon v-if="node.checked" class="checked-node"
            ><Select
            /></el-icon>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </tree-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from 'vue'
import TreeDialog from '@/components/treeDialog/TreeDialog.vue'
import {Management, Search, Select} from '@element-plus/icons-vue'
import storage from '@/utils/storage'
import {DEPART_TREE} from '@/constant/cache'
import {getDepartTreeList} from '@/api/setting'
import {ElMessage} from 'element-plus'

const props = defineProps(['visible', 'resultList', 'title', 'dataList', 'type'])
const emit = defineEmits(['update:visible', 'update:resultList'])
const visible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})

const resultList = computed({
  get() {
    return props.resultList
  },
  set(val) {
    emit('update:resultList', val)
  },
})

const queryParams = ref('')
const treeData = computed(() => {
  return props.dataList
})
const selectedItems = ref([])

/**
 * 选择部门
 */
function handleSelect(data) {
  if (selectedItems.value.includes(data)) {
    selectedItems.value = selectedItems.value.filter(
      item => item.id !== data.id,
    )
  } else {
    selectedItems.value.push(data)
  }
}

const treeRef = ref()
/**
 * 刷新选中状态
 */
watch(
  selectedItems,
  value => {
    if (treeRef.value) {
      treeRef.value.setCheckedKeys([])
      value.forEach(item => {
        treeRef.value.setChecked(item, true, false)
      })
    }
  },
  { deep: true },
)

/**
 * 搜索
 */
function treeFilter(value: string, data) {
  if (!value) {
    return true
  }
  return data.label.includes(value)
}

watch(queryParams, value => {
  treeRef.value.filter(value)
})

const defaultExpand = ref([])

watch(visible, value => {
  if (value) {
    if (resultList.value.length > 0) {
      selectedItems.value = [...resultList.value]
    }
  }
})

function clear() {
  selectedItems.value = []
}

defineExpose({
  clear,
})
onMounted(() => {

})
</script>

<script lang="ts">
export default {
  name: "ListSelectDialog",
}
</script>

<style scoped lang="scss">
.tree-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 14px;

  .search {
    width: 260px;
  }

  .tree-scrollbar {
    margin-top: 10px;
    height: 340px;

    .tree-node-icon {
      margin-right: 5px;
      color: var(--el-color-primary-dark-2);
    }

    .checked-node {
      margin-left: 8px;
    }
  }
}
</style>
