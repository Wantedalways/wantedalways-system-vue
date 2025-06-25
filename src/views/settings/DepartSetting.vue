<template>
  <div class="depart-container">
    <div class="depart-wrapper">
      <div class="depart-search-wrapper">
        <el-input
          :prefix-icon="Search"
          placeholder="搜索部门、用户"
          clearable
          v-model="orgQueryParam"
        />
        <el-button
          :icon="Plus"
          circle
          class="add-button"
          @click="handleDepartAddButtonClick"
        />
      </div>
      <div class="tab-wrapper" v-show="!searchVisible">
        <el-radio-group v-model="tabValue" class="tab" size="small">
          <el-radio-button label="部门" value="部门" class="tab-item"/>
          <el-radio-button label="用户组" value="用户组" class="tab-item"/>
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
                    <Management/>
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
                        <MoreFilled/>
                      </el-icon>
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
      <div v-show="searchVisible" v-loading="searchLoading" class="search-wrapper">
        <el-scrollbar>
          <div v-if="userQueryListData.length > 0" class="user-search">
            <div class="search-title">用户</div>
            <div v-for="item in userQueryListData" :key="item.id" class="selected-item">
              <el-icon class="selected-icon">
                <UserFilled/>
              </el-icon>
              <el-text class="selected-user">{{ item.realName }}</el-text>
              <el-text class="selected-depart" truncated>{{
                  item.departIds_dictText
                }}
              </el-text>
            </div>
          </div>
          <div v-if="departQueryListData.length > 0" class="depart-search">
            <div class="search-title">部门</div>
            <el-scrollbar>
              <div v-for="item in departQueryListData" :key="item.id" class="selected-item">
                <el-icon class="selected-icon">
                  <Management/>
                </el-icon>
                <el-text class="selected-user">{{ item.departName }}</el-text>
              </div>
            </el-scrollbar>
          </div>
          <div v-if="groupQueryData.length > 0" class="group-search">
            <div class="search-title">用户组</div>
            <el-scrollbar>
              <div v-for="item in groupQueryData" :key="item.id">
                <el-icon class="selected-icon">
                  <Management/>
                </el-icon>
                <el-text class="selected-user">{{ item.name }}</el-text>
              </div>
            </el-scrollbar>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="user-wrapper">
      <div class="user-title">{{ title }}</div>
      <div v-if="!userDetailFlag" class="user-list">
        <div class="user-button-group">
          <el-button type="primary" :icon="Plus" size="small"
          >添加用户
          </el-button
          >
          <el-button :icon="Delete" size="small">删除用户</el-button>
          <el-button
            type="primary"
            :icon="Refresh"
            size="small"
            class="user-button-sync"
          >同步企业微信
          </el-button
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
            <el-table-column type="selection" fixed/>
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
            <el-table-column prop="username" label="账号"/>
            <el-table-column prop="phone" label="手机"/>
            <el-table-column prop="email" label="企业邮箱"/>
            <el-table-column prop="gender_dictText" label="性别"/>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" text type="primary" @click="handleDetail(scope.row.id)">详情</el-button>
                <el-button size="small" text type="primary">编辑</el-button>
                <el-dropdown class="button-more" trigger="click">
                  <el-button size="small" text type="info">
                    更多
                    <el-icon>
                      <ArrowDown/>
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
                        >启用
                        </el-button
                        >
                        <el-button v-else text size="small">禁用</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button size="small" text>重置密码</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button size="small" text type="danger"
                        >删除
                        </el-button
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
      <div v-else-if="userDetailFlag" class="user-detail">
        <div class="user-button-group">
          <el-button @click="handleBack" size="small" plain type="info" :icon="DArrowLeft">返回</el-button>
          <el-button size="small" plain type="info" @click="handleEditUserFromDetail">编辑</el-button>
          <el-button size="small" plain type="info">禁用</el-button>
          <el-button size="small" plain type="info">删除</el-button>
        </div>
        <div class="user-info">
          <el-skeleton animated :loading="userDetailLoading" :throttle="{ leading: 500, trailing: 500, initVal: true }"
                       :rows="15">
            <template #default>
              <el-scrollbar>
                <el-descriptions :title="userDetailData.userInfo.realName" direction="vertical" :column="2">
                  <el-descriptions-item label="账号">
                    {{ userDetailData.userInfo.username ? userDetailData.userInfo.username : '未设置' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="企业邮箱">
                    {{ userDetailData.userInfo.email ? userDetailData.userInfo.email : '未设置' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="手机">
                    {{ userDetailData.userInfo.phone ? userDetailData.userInfo.phone : '未设置' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="座机">
                    {{ userDetailData.userInfo.telephone ? userDetailData.userInfo.telephone : '未设置' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="身份证号">
                    {{ userDetailData.userInfo.idNumber ? userDetailData.userInfo.idNumber : '未设置' }}
                  </el-descriptions-item>
                </el-descriptions>
                <el-divider/>
                <el-descriptions :column="1" direction="vertical">
                  <el-descriptions-item label="部门">
                    <div v-if="userDetailData.departInfo.length > 0">
                      <el-tag v-for="item in userDetailData.departInfo" :key="item.id">{{ item.departName }}</el-tag>
                    </div>
                    <span v-else>未设置</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="用户组">
                    <div v-if="userDetailData.groupInfo.length > 0">
                      <el-tag v-for="item in userDetailData.groupInfo" :key="item.id">{{ item.name }}</el-tag>
                    </div>
                    <span v-else>未设置</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="部门负责人">{{ userDetailData.orgInfo.isLeader ? '是' : '否' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="负责部门">
                    <div v-if="userDetailData.orgInfo.isLeader">
                      <el-tag v-for="item in userDetailData.orgInfo.leadingDeparts" :key="item.id">
                        {{ item.departName }}
                      </el-tag>
                    </div>
                    <span v-else>未设置</span>
                  </el-descriptions-item>
                </el-descriptions>
              </el-scrollbar>
            </template>
          </el-skeleton>
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
      >取消
      </el-button
      >
      <el-button
        class="depart-form-button"
        type="primary"
        @click="handleAddDepart"
      >确认
      </el-button
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
      >取消
      </el-button
      >
      <el-button
        class="depart-form-button"
        type="primary"
        @click="handleEditDepart"
      >确认
      </el-button
      >
    </template>
  </el-dialog>

  <el-dialog v-model="userEditDialogVisible" title="编辑用户信息">
    <el-scrollbar>
      <el-form :model="userDetailEditParam.userInfo" :rules="userRules" ref="userEditFormRef">
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="userDetailEditParam.userInfo.realName"/>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="userDetailEditParam.userInfo.username"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="userDetailEditParam.userInfo.gender">
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="企业邮箱" prop="email">
          <el-input v-model="userDetailEditParam.userInfo.email"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="userDetailEditParam.userInfo.phone"/>
        </el-form-item>
        <el-form-item label="座机" prop="telephone">
          <el-input v-model="userDetailEditParam.userInfo.telephone"/>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="userDetailEditParam.userInfo.idNumber"/>
        </el-form-item>
      </el-form>
      <el-divider/>
      <el-descriptions :column="1" direction="vertical">
        <el-descriptions-item label="部门">
          <el-tag v-for="item in userDetailEditParam.departInfo" :key="item.id" disable-transitions>
            <template #default>
              <el-icon>
                <Management/>
              </el-icon>
              <span>{{ item.departName }}</span>
              <span v-if="item.isMajor">主</span>
              <el-popover
                placement="bottom-start"
                trigger="click"
                :show-arrow="false"
                popper-style="max-width: 100px"
                popper-class="depart-popover"
              >
                <template #reference>
                  <el-icon style="transform: rotate(90deg)">
                    <MoreFilled/>
                  </el-icon>
                </template>
                <template #default>
                  <div class="depart-popover-content">
                    <div
                      class="depart-popover-item" @click="editRemoveDepart(item.id)"
                    >
                      删除
                    </div>
                    <div
                      class="depart-popover-item" v-if="!item.isMajor"
                    >
                      设为主部门
                    </div>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-tag>
          <el-button text type="primary" size="small" @click="editModifyDepart">修改</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="用户组">
          <el-tag v-for="item in userDetailEditParam.groupInfo" :key="item.id" disable-transitions>{{
              item.name
            }}
          </el-tag>
          <el-button text type="primary" size="small" @click="editModifyGroup">修改</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="部门负责人">
          <el-radio-group v-model="userDetailEditParam.orgInfo.isLeader">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item label="负责部门" v-if="userDetailEditParam.orgInfo.isLeader">
          <el-tag v-for="item in userDetailEditParam.orgInfo.leadingDeparts" :key="item.id" disable-transitions>
            <template #default>
              <el-icon>
                <Management/>
              </el-icon>
              <span>{{ item.departName }}</span>
              <el-icon>
                <Close/>
              </el-icon>
            </template>
          </el-tag>
          <el-button text type="primary" size="small" @click="editModifyLeadingDepart">修改</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-scrollbar>
    <template #footer>
      <el-button
        class="depart-form-button"
        @click="userEditDialogVisible = false"
      >取消
      </el-button
      >
      <el-button
        class="depart-form-button"
        type="primary"
        @click="handleUserEdit"
      >确认
      </el-button
      >
    </template>

    <depart-select-dialog
      v-model:visible="departEditSelectVisible"
      v-model:result-departs="resultEditDeparts"
      :title="'选择部门'"
      ref="editDepartSelectRef"
      :user-depart-flag="true"
    />

    <list-select-dialog v-model:visible="editLeadingDepartSelectVisible" v-model:resultList="editResultLeadingDeparts"
                        :title="'选择部门'"
                        :data-list="editLeadingDeparts" ref="editLeadingDepartSelectRef" :type="'部门'"/>

    <list-select-dialog v-model:visible="editGroupSelectVisible" v-model:resultList="editResultGroups"
                        :title="'选择部门'"
                        :data-list="editGroups" ref="editGroupSelectRef" :type="'用户组'"/>
  </el-dialog>

</template>

<script setup lang="ts">
import {
  ArrowDown, Close,
  DArrowLeft,
  Delete,
  Management,
  MoreFilled,
  Plus,
  Refresh,
  Search,
  UserFilled,
} from '@element-plus/icons-vue'
import {computed, onMounted, reactive, ref, toRaw, watch} from 'vue'
import storage from '@/utils/storage'
import {DEPART_TREE, USER_GROUP} from '@/constant/cache'
import {
  addDepart,
  deleteDepart,
  dragDepart,
  editDepart, editUser, getAllGroupList,
  getDepartTreeList, getUserDetail,
  getUserListByDepartId,
  searchOrg,
  validateDeleteDepart,
  validateDepart, validatePermission, validateUser,
} from '@/api/setting'
import {ElMessage, ElMessageBox, ElTreeSelect, type FormRules,} from 'element-plus'
import type {Depart, SysUser} from '@/api/type'
import {useDebounceFn} from '@/utils/debounce'
import type {NodeDropType} from 'element-plus/es/components/tree/src/tree.type'
import DepartSelectDialog from "@/components/dapart/DepartSelectDialog.vue";
import {cloneDeep} from 'lodash-es'
import ListSelectDialog from "@/components/treeDialog/ListSelectDialog.vue";

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
  departName: [{validator: validateName, trigger: 'blur'}],
  workWxId: [{validator: validateWorkWxId, trigger: 'blur'}],
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
  const {prop, order} = data
  if (prop.indexOf('_dictText') !== -1) {
    userQueryParams.value.orderBy = prop.substring(0, prop.indexOf('_dictText'))
  } else {
    userQueryParams.value.orderBy = prop
  }
  userQueryParams.value.order = order === 'descending' ? 'desc' : 'asc'

  getUserList()
}

const orgQueryParam = ref('')
const userQueryListData = ref([])
const departQueryListData = ref([])
const groupQueryData = ref([])
const searchVisible = ref(false)
const searchLoading = ref(false)

const userDetailLoading = ref(false)
const userDetailData = reactive({
  userInfo: {},
  departInfo: [],
  groupInfo: [],
  orgInfo: {
    isLeader: false,
    leadingDeparts: []
  }
})
const handleDetail = useDebounceFn(async (id: string) => {
  userDetailLoading.value = true
  title.value = '用户详情'
  userDetailFlag.value = true

  const result = await getUserDetail(id)
  if (result.success) {
    Object.assign(userDetailData, result.data)
    userDetailLoading.value = false
  } else {
    ElMessage.error(result.message)
  }
})

function handleBack() {
  userDetailFlag.value = false
}

const userEditDialogVisible = ref(false)
const userDetailAddParam = reactive({
  userInfo: {},
  departInfo: [],
  groupInfo: [],
  orgInfo: {
    isLeader: false,
    leadingDeparts: []
  }
})
const userDetailEditParam = reactive({
  userInfo: {},
  departInfo: [],
  groupInfo: [],
  orgInfo: {
    isLeader: false,
    leadingDeparts: []
  }
})
const userEditValidateParams = {
  username: '',
  email: '',
  phone: '',
  idNumber: ''
}

function handleEditUserFromDetail() {
  Object.assign(userDetailEditParam, cloneDeep(userDetailData))
  userEditValidateParams.username = userDetailData.userInfo.username
  userEditValidateParams.email = userDetailData.userInfo.email
  userEditValidateParams.phone = userDetailData.userInfo.phone
  userEditValidateParams.idNumber = userDetailData.userInfo.idNumber
  userEditDialogVisible.value = true
}

function editRemoveDepart(id: string) {
  userDetailEditParam.departInfo = userDetailEditParam.departInfo.filter(item => {
    return item.id !== id
  })
}

const departEditSelectVisible = ref(false)
const resultEditDeparts = ref([])
const editDepartSelectRef = ref()

function editModifyDepart() {
  resultEditDeparts.value = userDetailEditParam.departInfo.map(item => {
    const {departName, ...rest} = item
    return {...rest, label: departName}
  })
  departEditSelectVisible.value = true
}

watch(departEditSelectVisible, value => {
  if (!value) {
    userDetailEditParam.departInfo = resultEditDeparts.value.map(item => {
      const {label, ...rest} = item
      return {...rest, departName: label}
    })
    resultEditDeparts.value = []
    editDepartSelectRef.value.clear()
  }
})

const editLeadingDepartSelectVisible = ref(false)
const editResultLeadingDeparts = ref([])
const editLeadingDeparts = ref([])
const editLeadingDepartSelectRef = ref()

function editModifyLeadingDepart() {
  editLeadingDeparts.value = userDetailEditParam.departInfo.map(item => {
    const {departName, ...rest} = item
    return {...rest, label: departName}
  })
  editResultLeadingDeparts.value = userDetailEditParam.orgInfo.leadingDeparts.map(item => {
    const {departName, ...rest} = item
    return {...rest, label: departName}
  })
  editLeadingDepartSelectVisible.value = true
}

watch(editLeadingDepartSelectVisible, value => {
  if (!value) {
    userDetailEditParam.orgInfo.isLeader = editResultLeadingDeparts.value.length > 0
    userDetailEditParam.orgInfo.leadingDeparts = editResultLeadingDeparts.value.map(item => {
      const {label, ...rest} = item
      return {...rest, departName: label}
    })
    console.log(userDetailEditParam.orgInfo.leadingDeparts)
    editResultLeadingDeparts.value = []
    editLeadingDepartSelectRef.value.clear()
  }
})

const editGroupSelectVisible = ref(false)
const editResultGroups = ref([])
const editGroups = ref([])
const editGroupSelectRef = ref()

async function editModifyGroup() {
  await getGroupList()
  editGroupSelectVisible.value = true
}

async function getGroupList() {
  if (storage.get(USER_GROUP)) {
    editGroups.value = storage.get(USER_GROUP)
  } else {
    const result = await getAllGroupList()
    if (result.success) {
      editGroups.value = result.data
      storage.set(USER_GROUP, result.data)
    } else {
      ElMessage.error(result.message)
    }
  }
}

const userRules = reactive<FormRules<SysUser>>({
  realName: [{required: true, message: '请输入姓名', trigger: 'blur'}],
  username: [{validator: validateUsername, trigger: 'blur'}],
  email: [{validator: validateEmail, trigger: 'blur'}],
  phone: [{validator: validatePhone, trigger: 'blur'}],
  idNumber: [{validator: validateIdNumber, trigger: 'blur'}],
})

async function validateUsername(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入账号'))
  } else {
    if (
      userEditValidateParams.username === '' ||
      userEditValidateParams.username !== userDetailEditParam.userInfo.username
    ) {
      const result = await validateUser(value, 'username')
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
async function validateEmail(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入邮箱'))
  } else {
    if (
      userEditValidateParams.email === '' ||
      userEditValidateParams.email !== userDetailEditParam.userInfo.email
    ) {
      const result = await validateUser(value, 'email')
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
async function validatePhone(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else {
    if (
      userEditValidateParams.phone === '' ||
      userEditValidateParams.phone !== userDetailEditParam.userInfo.phone
    ) {
      const result = await validateUser(value, 'phone')
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
async function validateIdNumber(rule: any, value: any, callback: any) {
  if (
    userEditValidateParams.idNumber === '' ||
    userEditValidateParams.idNumber !== userDetailEditParam.userInfo.idNumber
  ) {
    const result = await validateUser(value, 'idNumber')
    if (!result.success) {
      callback(new Error(result.message))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
const userEditFormRef = ref()
const handleUserEdit = useDebounceFn(() => {
  userEditFormRef.value.validate(async valid => {
    if (valid) {
      if (userDetailEditParam.departInfo.length === 0) {
        ElMessage.error('请至少选择一个所属部门！')
        return
      }
      if (userDetailEditParam.orgInfo.isLeader) {
        if (userDetailEditParam.orgInfo.leadingDeparts.length === 0) {
          ElMessage.error('请至少选择一个负责部门！')
          return;
        }
      } else {
        userDetailEditParam.orgInfo.leadingDeparts = []
      }
      const result = await editUser(userDetailEditParam)
      if (result.success) {
        ElMessage.success(result.message)
        Object.assign(userDetailData, cloneDeep(userDetailEditParam))
        userEditDialogVisible.value = false
      } else {
        ElMessage.error(result.message)
      }
    }
  })
})

watch(userEditDialogVisible, value => {
  if (!value) {
    userEditFormRef.value.clearValidate()
  }
})

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

watch(orgQueryParam, useDebounceFn(async value => {
  const param = value.trim()
  if (param) {
    searchVisible.value = true
    searchLoading.value = true

    const result = await searchOrg(param)
    if (result.success) {
      userQueryListData.value = result.data.userList
      departQueryListData.value = result.data.departList
      groupQueryData.value = result.data.groupList
      searchLoading.value = false
    } else {
      ElMessage.error(result.message)
      userQueryListData.value = []
      departQueryListData.value = []
      groupQueryData.value = []
      searchLoading.value = false
    }
  } else {
    userQueryListData.value = []
    departQueryListData.value = []
    groupQueryData.value = []
    searchVisible.value = false
    searchLoading.value = false
  }
}))

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
    max-width: 260px;
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

    .search-wrapper {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      background: #e6e8eb;
      margin: 0 16px;
      max-height: 700px;

      .el-loading-mask {
        background: #e6e8eb;
      }

      .search-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-color-info-dark-2);
        margin-bottom: 8px;
        padding-left: 5px;
      }

      .user-search {
        margin-bottom: 5px;
      }

      .selected-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 3px 5px 4px 5px;
        margin-right: 30px;
        border-radius: 4px;

        &:hover {
          background-color: var(--el-color-primary-light-9);
        }

        .selected-icon {
          margin-right: 5px;
          color: var(--el-color-primary-dark-2);
        }

        .selected-user {
          flex-grow: 1;
        }

        .selected-depart {
          width: 100px;
          text-align: right;
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

    .user-detail {
      display: flex;
      flex-direction: column;

      .user-button-group {
        margin-bottom: 5px;

        .el-button {
          width: 65px;
        }
      }

      .user-info {
        flex: 1;
        padding-top: 20px;
        border-top: 1px solid var(--el-menu-border-color);
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

    .search-wrapper {
      .el-loading-mask {
        background: #e6e8eb;
      }
    }
  }

  .user-wrapper {
    .el-descriptions__body {
      background-color: #fafcff;
    }
  }
}

.depart-popover {
  min-width: 80px !important;
  padding: 0;
}
</style>
