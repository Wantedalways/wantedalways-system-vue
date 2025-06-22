<template>
  <div class="depart-container">
    <div class="depart-wrapper">
      <div class="depart-search-wrapper">
        <el-input
          :prefix-icon="Search"
          placeholder="搜索部门、用户"
          clearable
        />
        <el-button
          :icon="Plus"
          circle
          class="add-button"
          @click="handleDepartAddButtonClick"
        />
      </div>
      <div class="tab-wrapper">
        <el-radio-group v-model="tabValue" class="tab" size="small">
          <el-radio-button label="部门" value="部门" class="tab-item" />
          <el-radio-button label="用户组" value="用户组" class="tab-item" />
        </el-radio-group>
        <div v-show="tabValue === '部门'" class="depart-tab">
          <el-scrollbar class="depart-scrollbar">
            <el-tree
              :data="departTreeData"
              :default-expanded-keys="defaultExpand"
              node-key="id"
              class="depart-tree"
              :expand-on-click-node="false"
              check-strictly
              highlight-current
              @node-click="handleNodeClick"
              ref="departTreeRef"
              draggable
              :allow-drag="allowDrag"
              @node-drop="handleDrop"
              v-loading="departTreeLoading"
            >
              <template #default="{ data }">
                <div
                  class="tree-node"
                  @mouseenter="handleNodeMouseEnter(data.id)"
                  @mouseleave="handleNodeMouseLeave"
                >
                  <el-icon class="tree-node-icon">
                    <Management />
                  </el-icon>
                  <span class="tree-node-span">{{ data.label }}</span>
                  <el-popover
                    placement="bottom-start"
                    trigger="click"
                    :show-arrow="false"
                    v-if="data.id === hoverNodeId || data.id === checkedNodeId"
                    class="depart-popover"
                    popper-style="max-width: 100px"
                    popper-class="depart-popover"
                  >
                    <template #reference>
                      <el-icon class="tree-node-icon-more">
                        <MoreFilled />
                      </el-icon>
                      -->
                    </template>
                    <template #default>
                      <div class="depart-popover-content">
                        <div
                          class="depart-popover-item"
                          @click="openEditDepartDialog(data)"
                        >
                          修改
                        </div>
                        <div
                          class="depart-popover-item"
                          @click="handleDeleteDepart(data)"
                        >
                          删除
                        </div>
                        <div
                          class="depart-popover-item"
                          @click="handleAddChildDepart(data.id)"
                        >
                          添加子部门
                        </div>
                      </div>
                    </template>
                  </el-popover>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="user-wrapper">
      <div class="user-title">{{ title }}</div>
      <div v-if="!userDetailFlag" class="user-list">
        <div class="user-button-group">
          <el-button type="primary" :icon="Plus" size="small"
            >添加用户</el-button
          >
          <el-button :icon="Delete" size="small">删除用户</el-button>
          <el-button
            type="primary"
            :icon="Refresh"
            size="small"
            class="user-button-sync"
            >同步企业微信</el-button
          >
        </div>
        <div class="user-table">
          <el-table
            v-loading="userTableLoading"
            :data="userResult.records"
            stripe
            highlight-current-row
            table-layout="auto"
            ref="userTableRef"
            row-key="id"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @selection-change="console.log(1)"
            @sort-change="handleSort"
            :height="'calc(100vh - 280px)'"
          >
            <el-table-column type="selection" fixed />
            <el-table-column
              prop="realName"
              label="姓名"
              width="170"
              sortable="custom"
            />
            <el-table-column
              prop="departIds_dictText"
              label="部门"
              width="180"
            />
            <el-table-column prop="username" label="账号" />
            <el-table-column prop="phone" label="手机" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="gender_dictText" label="性别" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" text type="primary">详情</el-button>
                <el-button size="small" text type="primary">编辑</el-button>
                <el-dropdown class="button-more" trigger="click">
                  <el-button size="small" text type="info">
                    更多
                    <el-icon>
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <el-button
                          v-if="scope.row.status === 2"
                          size="small"
                          text
                          type="primary"
                          >启用</el-button
                        >
                        <el-button v-else text size="small">禁用</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button size="small" text>重置密码</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button size="small" text type="danger"
                          >删除</el-button
                        >
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            layout="total, prev, pager, next, sizes"
            :total="userResult.total || 0"
            background
            v-model:current-page="userQueryParams.pageNo"
            @update:current-page="getUserList"
            v-model:page-size="userQueryParams.pageSize"
            @update:page-size="getUserList"
          />
        </div>
      </div>
      <div v-else-if="!userDetailFlag" class="user-detail">
        <div class="user-button-group">
          <el-button>返回</el-button>
          <el-button>编辑</el-button>
          <el-button>禁用</el-button>
          <el-button>删除</el-button>
        </div>
        <div>
          <h1>用户详情</h1>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="departAddDialogVisible" title="新增部门" width="550">
    <el-form
      :model="departAddParams"
      label-position="right"
      label-width="auto"
      class="depart-form"
      hide-required-asterisk
      :rules="departRules"
      ref="departAddFormRef"
    >
      <el-form-item label="上级部门" prop="parentId">
        <el-tree-select
          :data="departTreeData"
          check-strictly
          v-model="departAddParams.parentId"
          filterable
          clearable
          class="depart-form-item"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="departName">
        <el-input
          v-model="departAddParams.departName"
          clearable
          class="depart-form-item"
        />
      </el-form-item>
      <el-form-item label="企业微信编码" prop="workWxId">
        <el-input
          v-model="departAddParams.workWxId"
          clearable
          class="depart-form-item"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        class="depart-form-button"
        @click="departAddDialogVisible = false"
        >取消</el-button
      >
      <el-button
        class="depart-form-button"
        type="primary"
        @click="handleAddDepart"
        >确认</el-button
      >
    </template>
  </el-dialog>

  <el-dialog v-model="departEditDialogVisible" title="修改部门" width="550">
    <el-form
      :model="departEditParams"
      label-position="right"
      label-width="auto"
      class="depart-form"
      hide-required-asterisk
      :rules="departRules"
      ref="departEditFormRef"
    >
      <el-form-item label="上级部门" prop="parentId">
        <el-tree-select
          :data="editFilterDepartTree"
          check-strictly
          v-model="departEditParams.parentId"
          filterable
          clearable
          class="depart-form-item"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="departName">
        <el-input
          v-model="departEditParams.departName"
          clearable
          class="depart-form-item"
        />
      </el-form-item>
      <el-form-item label="企业微信编码" prop="workWxId">
        <el-input
          v-model="departEditParams.workWxId"
          clearable
          class="depart-form-item"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        class="depart-form-button"
        @click="departEditDialogVisible = false"
        >取消</el-button
      >
      <el-button
        class="depart-form-button"
        type="primary"
        @click="handleEditDepart"
        >确认</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  Delete,
  Management,
  MoreFilled,
  Plus,
  Refresh,
  Search,
} from '@element-plus/icons-vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import storage from '@/utils/storage'
import { DEPART_TREE } from '@/constant/cache'
import {
  addDepart,
  deleteDepart,
  dragDepart,
  editDepart,
  getDepartTreeList,
  getUserListByDepartId,
  validateDeleteDepart,
  validateDepart,
} from '@/api/setting'
import {
  ElMessage,
  ElMessageBox,
  ElTreeSelect,
  type FormRules,
} from 'element-plus'
import type { Depart } from '@/api/type'
import { useDebounceFn } from '@/utils/debounce'
import type { NodeDropType } from 'element-plus/es/components/tree/src/tree.type'

const departTreeData = reactive([])
const defaultExpand = ref([])
const departTreeRef = ref()
const departTreeLoading = ref(false)

/**
 * 获取部门树
 */
async function getDepartTree() {
  departTreeLoading.value = true
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
  departTreeLoading.value = false
}

const tabValue = ref('部门')

/**
 * 部门操作图标显隐
 */
const hoverNodeId = ref('')

function handleNodeMouseEnter(id: string) {
  hoverNodeId.value = id
}

const checkedNodeId = ref('')
const userTableRef = ref()

async function handleNodeClick(data) {
  checkedNodeId.value = data.id
  if (data.id === selectedDepartId.value) {
    userTableRef.value.clearSort()

    userQueryParams.value = {
      departId: data.id,
      pageNo: 1,
      pageSize: 20,
      orderBy: '',
      order: '',
    }
    await getUserList()
  }
  selectedDepartId.value = data.id
  userDetailFlag.value = false
  title.value = data.departName
}

function handleNodeMouseLeave() {
  hoverNodeId.value = ''
}

const departAddDialogVisible = ref(false)
const departEditDialogVisible = ref(false)

function handleDepartAddButtonClick() {
  if (tabValue.value === '部门') {
    departAddDialogVisible.value = true
  }
}

const departAddParams = ref({
  parentId: '',
  departName: '',
  workWxId: '',
})
const departEditParams = ref({
  id: '',
  parentId: '',
  departName: '',
  workWxId: '',
})
const editDepartValidateParams = {
  parentId: '',
  departName: '',
  workWxId: '',
}

function openEditDepartDialog(data) {
  editDepartValidateParams.parentId = data.parentId
  editDepartValidateParams.departName = data.departName
  editDepartValidateParams.workWxId = data.workWxId

  departEditParams.value = {
    id: data.id,
    parentId: data.parentId,
    departName: data.departName,
    workWxId: data.workWxId,
  }

  departEditDialogVisible.value = true
}

const departRules = reactive<FormRules<Depart>>({
  departName: [{ validator: validateName, trigger: 'blur' }],
  workWxId: [{ validator: validateWorkWxId, trigger: 'blur' }],
})

async function validateName(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入部门名称'))
  } else {
    if (
      editDepartValidateParams.departName === '' ||
      editDepartValidateParams.departName !== departEditParams.value.departName
    ) {
      const result = await validateDepart(value, 'departName')
      if (!result.success) {
        callback(new Error(result.message))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}

async function validateWorkWxId(rule: any, value: any, callback: any) {
  if (value === '') {
    callback()
  } else {
    if (
      editDepartValidateParams.workWxId === '' ||
      editDepartValidateParams.workWxId !== departEditParams.value.workWxId
    ) {
      const result = await validateDepart(value, 'workWxId')
      if (!result.success) {
        callback(new Error(result.message))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}

const departAddFormRef = ref()
const handleAddDepart = useDebounceFn(() => {
  departAddFormRef.value.validate(async valid => {
    if (valid) {
      const result = await addDepart(departAddParams.value)
      if (result.success) {
        ElMessage.success(result.message)
        await getDepartTree()
        departAddDialogVisible.value = false
      } else {
        ElMessage.error(result.message)
      }
    }
  })
})

function handleAddChildDepart(id: string) {
  departAddParams.value.parentId = id
  departAddDialogVisible.value = true
}

const departEditFormRef = ref()
const handleEditDepart = useDebounceFn(() => {
  departEditFormRef.value.validate(async valid => {
    if (valid) {
      const result = await editDepart(departEditParams.value)
      if (result.success) {
        ElMessage.success(result.message)
        // 解决树状结构更新问题
        departTreeRef.value.remove({
          id: departEditParams.value.id,
        })
        await getDepartTree()
        departEditDialogVisible.value = false
      } else {
        ElMessage.error(result.message)
      }
    }
  })
})

const editFilterDepartTree = computed(() => {
  const markDisabled = (nodes, parentDisabled = false) => {
    return nodes.map(node => {
      const isDisabled = parentDisabled || node.id === departEditParams.value.id
      return {
        ...node,
        disabled: isDisabled,
        children: node.children
          ? markDisabled(node.children, isDisabled)
          : undefined,
      }
    })
  }
  return markDisabled(departTreeData)
})

const handleDeleteDepart = useDebounceFn(async data => {
  const validateResult = await validateDeleteDepart(data.id)
  if (validateResult.success) {
    ElMessageBox.confirm('确认删除此部门（' + data.label + '）？', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }).then(async () => {
      const result = await deleteDepart(data.id)
      if (result.success) {
        ElMessage.success(result.message)
        await getDepartTree()
      } else {
        ElMessage.error(result.message)
      }
    })
  } else {
    await ElMessageBox.alert('请删除此部门下的成员或子部门后，再删除此部门')
  }
})

const dragParams = ref({
  draggingId: '',
  dropId: '',
  dropType: '',
})

const allowDrag = (draggingNode: Node) => {
  return !draggingNode.data.label.includes('新华手术器械有限公司')
}

const handleDrop = async (
  draggingNode: Node,
  dropNode: Node,
  dropType: NodeDropType,
) => {
  dragParams.value = {
    draggingId: draggingNode.data.id,
    dropId: dropNode.data.id,
    dropType: dropType,
  }
  const result = await dragDepart(dragParams.value)
  if (result.success) {
    ElMessage.success(result.message)
  } else {
    await getDepartTree()
    ElMessage.error(result.message)
  }
}

const userTableLoading = ref(false)
const userResult = ref([])
const userDetailFlag = ref(false)
const selectedDepartId = ref('')
const userQueryParams = ref({
  departId: '',
  pageNo: 1,
  pageSize: 20,
  orderBy: '',
  order: '',
})
const title = ref('')

async function getUserList() {
  const result = await getUserListByDepartId(userQueryParams.value)
  if (result.success) {
    userResult.value = result.data
  } else {
    ElMessage.error(result.message)
  }
}

function handleSort(data: { column: any; prop: string; order: any }) {
  const { prop, order } = data
  if (prop.indexOf('_dictText') !== -1) {
    userQueryParams.value.orderBy = prop.substring(0, prop.indexOf('_dictText'))
  } else {
    userQueryParams.value.orderBy = prop
  }
  userQueryParams.value.order = order === 'descending' ? 'desc' : 'asc'

  getUserList()
}

watch(departAddDialogVisible, value => {
  if (!value) {
    departAddParams.value = {
      parentId: '',
      departName: '',
      workWxId: '',
    }
  }
})

watch(selectedDepartId, async value => {
  userQueryParams.value = {
    departId: value,
    pageNo: 1,
    pageSize: 20,
    orderBy: '',
    order: '',
  }
  await getUserList()
  title.value += '(' + userResult.value.total + '人)'
})

onMounted(async () => {
  await getDepartTree()
  defaultExpand.value = [departTreeData[0].id]
  selectedDepartId.value = defaultExpand.value[0]
  title.value = departTreeData[0].departName
})
</script>

<script lang="ts">
export default {
  name: 'DepartSetting',
}
</script>

<style scoped lang="scss">
.depart-container {
  height: 100%;
  display: flex;

  .depart-wrapper {
    height: 100%;
    min-width: 260px;
    background-color: #e6e8eb;
    display: flex;
    flex-direction: column;

    .depart-search-wrapper {
      display: flex;
      margin: 15px;

      .add-button {
        border: none;
        background: none;
        margin-left: 5px;

        &:hover {
          background-color: var(--el-color-primary-light-8);
        }
      }
    }

    .tab-wrapper {
      padding: 0 15px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      .tab {
        width: 100%;
        margin-bottom: 5px;
        justify-content: center;
      }

      .depart-tab {
        flex-grow: 1;
        height: 700px;
        padding-top: 10px;
        border-top: 1px solid var(--el-menu-border-color);

        .depart-tree {
          background-color: #e6e8eb;

          .tree-node {
            width: 100%;
            display: flex;
            align-items: center;
          }

          .tree-node-icon {
            margin-right: 5px;
            color: var(--el-color-primary-dark-2);
          }

          .tree-node-span {
            flex: 1;
          }

          .tree-node-icon-more {
            margin-right: 5px;
            transform: rotate(90deg);
          }
        }
      }
    }
  }

  .user-wrapper {
    height: 100%;
    flex-grow: 1;
    background-color: #fafcff;
    display: flex;
    flex-direction: column;
    padding: 0 20px 0 20px;

    .user-title {
      height: 42px;
      font-size: 18px;
      padding-top: 20px;
      font-weight: 600;
      color: var(--el-color-info-dark-2);
    }

    .user-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .user-button-group {
        margin-bottom: 5px;
      }

      .user-table {
        flex: 1;
        padding-top: 20px;
        border-top: 1px solid var(--el-menu-border-color);

        .button-more {
          margin-left: 12px;
        }
      }
    }
  }
}

.depart-popover-content {
  display: flex;
  flex-direction: column;
  width: 80px;

  .depart-popover-item {
    margin: 2px 0;
    padding: 1px 0 0 5px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      color: #ffffff;
      background-color: #409eff;
    }
  }
}

.depart-form {
  padding: 25px;

  .depart-form-item {
    width: 350px;
  }
}

.depart-form-button {
  width: 100px;
}
</style>

<style lang="scss">
.depart-container {
  .depart-wrapper {
    .tab-wrapper {
      .el-radio-button__inner {
        width: 115px;
      }
    }
  }
}

.depart-popover {
  min-width: 80px !important;
  padding: 0;
}
</style>
