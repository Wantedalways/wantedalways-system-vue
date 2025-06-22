<template>
  <tree-dialog
    v-model:visible="visible"
    :title="title"
    v-model:selected-items="selectedDepartItems"
    v-model:result-items="resultDeparts"
    :type="'部门'"
  >
    <div class="tree-wrapper">
      <el-input
        v-model="departQueryParams"
        :prefix-icon="Search"
        placeholder="搜索部门"
        class="search"
        clearable
      />
      <el-scrollbar class="tree-scrollbar">
        <el-tree
          :data="departTreeData"
          node-key="id"
          :expand-on-click-node="false"
          @node-click="handleSelect"
          ref="departTreeRef"
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import TreeDialog from '@/components/treeDialog/TreeDialog.vue'
import { Management, Search, Select } from '@element-plus/icons-vue'
import storage from '@/utils/storage'
import { DEPART_TREE } from '@/constant/cache'
import { getDepartTreeList } from '@/api/setting'
import { ElMessage } from 'element-plus'

const props = defineProps(['visible', 'resultDeparts', 'title'])
const emit = defineEmits(['update:visible', 'update:resultDeparts'])
const visible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})

const resultDeparts = computed({
  get() {
    return props.resultDeparts
  },
  set(val) {
    emit('update:resultDeparts', val)
  },
})

const departQueryParams = ref('')
const departTreeData = reactive([])

/**
 * 获取部门树
 */
async function getDepartTree() {
  if (storage.get(DEPART_TREE)) {
    Object.assign(departTreeData, storage.get(DEPART_TREE))
  } else {
    const result = await getDepartTreeList()
    if (result.success) {
      Object.assign(departTreeData, result.data)
      storage.set(DEPART_TREE, result.data)
    } else {
      ElMessage.error(result.message)
    }
  }
}

const selectedDepartItems = ref([])

/**
 * 选择部门
 */
function handleSelect(data) {
  if (selectedDepartItems.value.includes(data)) {
    selectedDepartItems.value = selectedDepartItems.value.filter(
      item => item.id !== data.id,
    )
  } else {
    selectedDepartItems.value.push(data)
  }
}

const departTreeRef = ref()
/**
 * 刷新选中状态
 */
watch(
  selectedDepartItems,
  value => {
    if (departTreeRef.value) {
      departTreeRef.value.setCheckedKeys([])
      value.forEach(item => {
        departTreeRef.value.setChecked(item, true, false)
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

watch(departQueryParams, value => {
  departTreeRef.value.filter(value)
})

const defaultExpand = ref([])

watch(visible, value => {
  if (value) {
    if (resultDeparts.value.length > 0) {
      selectedDepartItems.value = [...resultDeparts.value]
    }
    defaultExpand.value = [departTreeData[0].id]
  }
})

function clear() {
  selectedDepartItems.value = []
}

defineExpose({
  clear,
})
onMounted(() => {
  getDepartTree()
})
</script>

<script lang="ts">
export default {
  name: 'DepartSelectDialog',
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
