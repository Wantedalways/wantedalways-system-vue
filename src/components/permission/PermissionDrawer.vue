<template>
  <el-drawer v-model="drawerVisible" title="权限列表" :show-close="false" @closed="handleClose">
    <div>
      <el-checkbox @change="handleCheckAll" v-model="checkAll" :indeterminate="isIndeterminate">全选</el-checkbox>
      <el-divider direction="vertical" />
      <el-text @click="handleExpand">
        <el-icon>
          <ArrowUpBold v-if="isExpand" />
          <ArrowDownBold v-else />
        </el-icon>
        {{ isExpand ? '收起' : '展开' }}全部
      </el-text>
    </div>
    <el-tree :data="permissionTreeData" show-checkbox node-key="id" :default-checked-keys="props.ownedIds" :default-expanded-keys="props.ownedIds" ref="permissionTree">

    </el-tree>
    <div>
      <el-button type="primary" @click="handleSaveAndClose">保存</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch, watchEffect} from "vue";
import {getAllPermissionAsTree} from "@/api/setting";
import {ElMessage} from "element-plus";
import {ArrowDownBold, ArrowUpBold} from "@element-plus/icons-vue";

const props = defineProps(['visible', 'roleId', 'ownedIds']);
const emit = defineEmits(["update:visible"])
const drawerVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit("update:visible", val)
  }
})

watch(props, (val) => {
  console.log(val)
})

const checkAll = ref(false);
const isExpand = ref(false)

const permissionTreeData = reactive([])
const allIds = ref([])
/**
 * 获取权限树状数据
 */
async function queryPermissionTree() {
  const result = await getAllPermissionAsTree()
  if (result.success) {
    Object.assign(permissionTreeData, result.data.treeList)
    allIds.value = result.data.idList
  } else {
    ElMessage.error(result.message)
  }
}

function handleSaveAndClose() {

}

const permissionTree = ref()
const isIndeterminate = ref(false)
function handleClose() {
  permissionTree.value.setCheckedKeys([])
}

/**
 * 全选
 */
function handleCheckAll(value: boolean) {
  const keys = value ? allIds.value : []
  permissionTree.value.setCheckedKeys(keys, false)
  if (value) {
    isIndeterminate.value = false
  }
}

/**
 * 折叠/展开
 */
function handleExpand() {
  isExpand.value = !isExpand.value
  const nodeList = permissionTree.value.store._getAllNodes()
  for (const node of nodeList) {
    node.expanded = isExpand.value
  }
}

onMounted(() => {
  queryPermissionTree()
})
</script>

<script lang="ts">
export default {
  name: "PermissionDrawer",
}
</script>

<style scoped lang="scss">

</style>
