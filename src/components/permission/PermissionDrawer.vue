<template>
  <el-drawer v-model="drawerVisible" title="权限列表" :show-close="false" ref="permissionDrawerRef"
             :before-close="handleClose" class="permission_drawer">
    <div class="tool-wrapper">
      <el-input v-model="treeQueryParam" placeholder="权限名称" :prefix-icon="Search" clearable class="search" />
      <el-checkbox @change="handleCheckAll" v-model="checkAll" :indeterminate="isIndeterminate" class="check-all">全选
      </el-checkbox>
      <el-divider direction="vertical" class="divider"/>
      <el-text @click="handleExpand" class="expand">
        <el-icon>
          <ArrowUpBold v-if="isExpand"/>
          <ArrowDownBold v-else/>
        </el-icon>
        &nbsp;{{ isExpand ? '收起' : '展开' }}全部&nbsp;
      </el-text>
    </div>
<!--    <el-text class="tree-title" tag="b">当前权限</el-text>-->
    <el-tree :data="permissionTreeData"
             show-checkbox
             node-key="id"
             :default-checked-keys="checkedKeys"
             :default-expanded-keys="expandKeys"
             ref="permissionTreeRef"
             check-strictly
             @check="handleTreeCheck"
             :filter-node-method="treeFilter"
             class="tree"
    >
      <template #default="{node, data}">
        <el-text :class="{'is_matched': data.isMatched}" class="tree-node-span">
          {{ node.label }}
          <el-icon v-show="data.isMatched">
            <Star/>
          </el-icon>
        </el-text>
      </template>
    </el-tree>
    <div class="button-wrapper">
      <el-button @click="closeDrawer">取消</el-button>
      <el-button type="primary" plain @click="handleSave">仅保存</el-button>
      <el-button type="primary" @click="handleSaveAndClose">保存并关闭</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {getAllPermissionAsTree, setPermissionForRole} from "@/api/setting";
import {ElMessage} from "element-plus";
import {ArrowDownBold, ArrowUpBold, Place, Search, Star} from "@element-plus/icons-vue";
import type {PermissionForRole} from "@/api/type";

const props = defineProps(['visible', 'roleId', 'ownedIds']);
const emit = defineEmits(["update:visible", 'update:ownedIds'])
const drawerVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit("update:visible", val)
  }
})

const checkAll = ref(false);
const isExpand = ref(false)

const permissionTreeData = reactive([])
const allIds = ref([])
const checkedKeys = ref([])
const expandKeys = ref([])
const permissionTreeRef = ref()
const isIndeterminate = ref(false)

watch(() => props.ownedIds, (newVal) => {
  checkedKeys.value = newVal
  expandKeys.value = newVal
  if (checkedKeys.value.length === 0) {
    checkAll.value = false
    isIndeterminate.value = false
    isExpand.value = false
  } else if (checkedKeys.value.length === allIds.value.length) {
    checkAll.value = true
    isIndeterminate.value = false
    isExpand.value = true
  } else {
    checkAll.value = false
    isIndeterminate.value = true
    isExpand.value = true
  }
})

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

/**
 * 权限筛选
 */
const treeQueryParam = ref('')

function treeFilter(value: string, data, node) {
  if (!value) {
    data.isMatched = false
    if (node.expanded) {
      isExpand.value = true
    }
    return true
  }
  if (data.label.includes(value)) {
    data.isMatched = true
    return true
  }
  return false
}

watch(treeQueryParam, (val) => {
  permissionTreeRef.value.filter(val)
})

const permissionDrawerRef = ref()

/**
 * 取消
 */
function closeDrawer() {
  permissionDrawerRef.value.handleClose()
}

/**
 * 保存
 */
async function handleSave() {
  const propsOwnedIds = props.ownedIds
  if (checkedKeys.value.sort().toString() === propsOwnedIds.sort().toString()) {
    return
  }
  const data: PermissionForRole = {
    roleId: props.roleId,
    newPermissionIds: checkedKeys.value,
    oldPermissionIds: propsOwnedIds
  }
  const result = await setPermissionForRole(data)
  if (result.success) {
    emit('update:ownedIds', checkedKeys.value)
    ElMessage.success(result.message)
  } else {
    ElMessage.error(result.message)
  }
}

/**
 * 保存并关闭
 */
function handleSaveAndClose() {
  handleSave()
  closeDrawer()
}

/**
 * 关闭时选中状态
 */
function handleClose(done: (cancel?: boolean) => void) {
  permissionTreeRef.value.setCheckedKeys([])
  checkAll.value = false
  isIndeterminate.value = false
  const nodeList = permissionTreeRef.value.store._getAllNodes()
  for (const node of nodeList) {
    node.expanded = false
  }
  treeQueryParam.value = ''
  done()
}

/**
 * 全选
 */
function handleCheckAll(value: boolean) {
  const keys = value ? allIds.value : []
  checkedKeys.value = keys
  permissionTreeRef.value.setCheckedKeys(keys, false)
  if (value) {
    isIndeterminate.value = false
  }
}

/**
 * 折叠/展开
 */
function handleExpand() {
  isExpand.value = !isExpand.value
  const nodeList = permissionTreeRef.value.store._getAllNodes()
  for (const node of nodeList) {
    node.expanded = isExpand.value
  }
}

/**
 * 权限节点选择
 */
function handleTreeCheck() {
  checkedKeys.value = permissionTreeRef.value.getCheckedKeys()
  checkAll.value = checkedKeys.value.length === allIds.value.length
  isIndeterminate.value = checkedKeys.value.length === 0 ? false : checkedKeys.value.length !== allIds.value.length
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
.tool-wrapper {
  margin-bottom: 5px;
  display: flex;
  flex-wrap: wrap;
  position: relative;

  .search {
    //padding: 0 24px 5px 24px;
    padding: 0 12px 5px 12px;
    margin-bottom: 10px;
  }

  .check-all {
    padding-left: 24px;
  }

  .divider {
    align-self: center;
  }

  .expand {
    align-self: center;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }
}

.tool-wrapper:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 12px;
  width: 50%;
  height: 1px;
  background-color: var(--el-menu-border-color);
}

.tree-title {
  margin-left: 24px;
  width: 100%;
}

.tree {
  margin-top: 5px;

  .is_matched {
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: var(--el-color-primary);
  }
}



.button-wrapper {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>

<style lang="scss">
.permission_drawer {
  .el-drawer__header {
    padding-left: 20px;
    font-weight: bold;
    //color: var(--el-color-primary);
    margin-bottom: 0;
    padding-bottom: 20px;
    //border-bottom: 1px solid var(--el-menu-border-color);
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  }
}
</style>
