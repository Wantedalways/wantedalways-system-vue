<template>
  <div class="role-container">
    <el-row class="role-query-wrapper">
      <el-form inline @keyup.enter="queryRoleList" :model="roleQueryParams">
        <el-form-item label="角色类型">
          <el-select v-model="roleQueryParams.roleType" style="width: 160px" clearable placeholder="请选择" @change="queryRoleList">
            <el-option v-for="type in roleType" :key="type.value" :label="type.text" :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="roleQueryParams.roleName" placeholder="角色名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="queryRoleList">搜索</el-button>
          <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="role-table-wrapper">
      <div class="role-button-wrapper">
        <el-button type="primary" :icon="Plus" class="role-add-button" @click="addDialogVisible = true">添加</el-button>
      </div>
      <el-table
        v-loading="roleLoading"
        :data="roleResult.records"
        stripe
        highlight-current-row
        table-layout="auto"
        :header-cell-style="{'text-align': 'center'}"
        :cell-style="{'text-align': 'center'}"
        class="role-table"
        @sort-change="handleSort"
        ref="roleTable"
      >
<!--        <el-table-column type="index" label="序号" :index='index' />-->
        <el-table-column prop="roleType_dictText" label="类型" sortable="custom" />
        <el-table-column prop="roleName" label="名称" sortable="custom" />
        <el-table-column prop="roleCode" label="编码" sortable="custom" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="上级角色">
          <template #default="scope">
            {{scope.row.parentId_dictText ? scope.row.parentId_dictText : '/'}}
          </template>
        </el-table-column>
        <el-table-column prop="createBy_dictText" label="创建人" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" text type="primary">用户</el-button>
            <el-button size="small" text type="primary" @click="handleAuthorize(scope.row.id)">授权</el-button>
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
                    <el-button size="small" text type="primary" @click="openEditDialog(scope.row)">修改</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="small" text type="danger" @click="handleDeleteRole(scope.row.id, scope.row.roleName)">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="pagination-wrapper">
      <el-pagination layout="total, prev, pager, next, sizes"
                     :total="roleResult.total || 0"
                     background
                     v-model:current-page="roleQueryParams.pageNo" @update:current-page="queryRoleList"
                     v-model:page-size="roleQueryParams.pageSize" @update:page-size="queryRoleList"
      />
    </div>
  </div>
  <el-dialog v-model="addDialogVisible" title="新建角色" class="role-dialog" :show-close="false" @open="queryRoleSelectList">
    <el-form :model="roleAddParams" :rules="roleRules" hide-required-asterisk ref="addRoleFormRef" class="role-form">
      <el-form-item label="角色类型" prop="roleType" class="role-form-item">
        <el-select
          v-model="roleAddParams.roleType"
          clearable placeholder="请选择"
          @change="queryRoleSelectList(roleAddParams.roleType)"
        >
          <el-option v-for="type in roleType" :key="type.value" :label="type.text" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName" class="role-form-item">
        <el-input v-model="roleAddParams.roleName" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode" class="role-form-item">
        <el-input v-model="roleAddParams.roleCode" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="上级角色" prop="parentId" class="role-form-item">
        <el-select v-model="roleAddParams.parentId" placeholder="请选择">
          <el-option v-for="role in roleSelectList" :key="role.id" :label="role.roleName" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色描述" prop="description" class="role-form-item">
        <el-input v-model="roleAddParams.description" clearable placeholder="请简要描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleAddRole" class="role-modify-button">确认</el-button>
      <el-button @click="addDialogVisible = false" class="role-modify-button">取消</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="editDialogVisible" title="修改角色" class="role-dialog" :show-close="false" @open="queryRoleSelectList" @close="clearCache">
    <el-form :model="roleEditParams" :rules="roleRules" hide-required-asterisk ref="editRoleFormRef" class="role-form">
      <el-form-item label="角色类型" prop="roleType" class="role-form-item">
        <el-select
          v-model="roleEditParams.roleType"
          clearable placeholder="请选择"
          @change="queryRoleSelectList(roleEditParams.roleType)"
        >
          <el-option v-for="type in roleType" :key="type.value" :label="type.text" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName" class="role-form-item">
        <el-input v-model="roleEditParams.roleName" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode" class="role-form-item">
        <el-input v-model="roleEditParams.roleCode" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="上级角色" prop="parentId" class="role-form-item">
        <el-select v-model="roleEditParams.parentId" placeholder="请选择">
          <el-option v-for="role in roleSelectList" :key="role.id" :label="role.roleName" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色描述" prop="description" class="role-form-item">
        <el-input v-model="roleEditParams.description" clearable placeholder="请简要描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleEditRole" class="role-modify-button">确认</el-button>
      <el-button @click="editDialogVisible = false" class="role-modify-button">取消</el-button>
    </template>
  </el-dialog>

  <permission-drawer v-model:visible="authorizeVisible" :role-id="selectedRoleId" v-model:owned-ids="ownedPermissionIds" />
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {getDict} from "@/utils";
import {DICT_ROLE_TYPE} from "@/constant/cache";
import {ArrowDown, Plus, Refresh, Search} from "@element-plus/icons-vue";
import {
  addRole,
  deleteRole,
  editRole,
  getPermissionIdsByRole,
  getRoleList,
  getRoleSelectList,
  validateRole
} from "@/api/setting";
import {ElMessage, ElMessageBox, type FormRules} from "element-plus";
import type {Role} from "@/api/type";
import PermissionDrawer from "@/components/permission/PermissionDrawer.vue";

// 角色类型
const roleType = computed(() => getDict(DICT_ROLE_TYPE))
// 角色查询参数
const roleQueryParams = reactive({
  roleType: '',
  roleName: '',
  pageNo: 1,
  pageSize: 10,
  orderBy: '',
  order: ''
})

const roleLoading = ref(false)
const roleResult = reactive({})
/**
 * 查询角色列表
 */
async function queryRoleList() {
  roleLoading.value = true
  try {
    const result = await getRoleList(roleQueryParams)
    Object.assign(roleResult, result.data)
    roleLoading.value = false
  } catch (error) {
    ElMessage.error((error as Error).message)
  } finally {
    roleLoading.value = false
  }
}

const addDialogVisible = ref(false)
const roleAddParams = reactive({
  roleType: '',
  roleName: '',
  parentId: '',
  roleCode: '',
  description : ''
})

const roleSelectList = ref([])

/**
 * 查询角色下拉列表
 * @param roleType
 */
async function queryRoleSelectList(roleType?: string) {
  const {data} = await getRoleSelectList(roleType === undefined ? '0' : roleType)
  roleSelectList.value = data
}

/**
 * 角色名校验
 */
const validateRoleName = async (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入角色名称'));
  } else {
    if (editValidateParams.roleName === '' || editValidateParams.roleName !== roleEditParams.roleName) {
      const result = await validateRole(value, 'roleName');
      if (!result.success) {
        callback(new Error(result.message));
      } else {
        callback();
      }
    } else {
      callback();
    }
  }
}

/**
 * 角色编码校验
 */
const validateRoleCode = async (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入角色编码'));
  } else {
    if (editValidateParams.roleCode === '' || editValidateParams.roleCode !== roleEditParams.roleCode) {
      const result = await validateRole(value, 'roleCode');
      if (!result.success) {
        callback(new Error(result.message));
      } else {
        callback();
      }
    } else {
      callback();
    }
  }
}

const roleRules = reactive<FormRules<Role>>({
  roleType: [{required: true, message: '请选择角色类型', trigger: 'blur'}],
  roleName: [{validator: validateRoleName, trigger: 'blur'}],
  roleCode: [{validator: validateRoleCode, trigger: 'blur'}],
  description: [{required: true, message: '请输入角色描述', trigger: 'blur'}]
})

const addRoleFormRef = ref()

/**
 * 新增角色
 */
function handleAddRole() {
  addRoleFormRef.value.validate(async (valid) => {
    if (valid) {
      const result = await addRole(roleAddParams)
      if (result.success) {
        ElMessage.success(result.message)
        await queryRoleList()
        addDialogVisible.value = false
      } else {
        ElMessage.error(result.message)
      }
    }
  })
}

watch(addDialogVisible, (value) => {
  if (!value) {
    addRoleFormRef.value.resetFields()
  }
})

const editDialogVisible = ref(false)
const editRoleFormRef = ref()
watch(editDialogVisible, (value) => {
  if (!value) {
    editRoleFormRef.value.resetFields()
  }
})
const roleEditParams = reactive({
  id: '',
  roleType: '',
  roleName: '',
  parentId: '',
  roleCode: '',
  description: '',
})

const editValidateParams = {
  roleName: '',
  roleCode: ''
}

function openEditDialog(row) {
  roleEditParams.id = row.id
  roleEditParams.roleType = row.roleType
  roleEditParams.roleName = row.roleName
  roleEditParams.parentId = row.parentId
  roleEditParams.roleCode = row.roleCode
  roleEditParams.description = row.description

  editValidateParams.roleName = row.roleName
  editValidateParams.roleCode = row.roleCode

  editDialogVisible.value = true
}

function clearCache() {
  editValidateParams.roleName = ''
  editValidateParams.roleCode = ''
}

/**
 * 修改角色
 */
function handleEditRole() {
  editRoleFormRef.value.validate(async (valid) => {
    if (valid) {
      const result = await editRole(roleEditParams)
      if (result.success) {
        ElMessage.success(result.message)
        await queryRoleList()
        editDialogVisible.value = false
      } else {
        ElMessage.error(result.message)
      }
    }
  })
}

/**
 * 删除角色
 */
function handleDeleteRole(id: string, roleName: string) {
  ElMessageBox.confirm('确认删除角色（'+roleName+'）吗？', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    const result = await deleteRole(id)
    if (result.success) {
      ElMessage.success(result.message);
      await queryRoleList()
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {})
}

/**
 * 表格排序
 */
function handleSort(data: {column: any, prop: string, order: any }) {
  const {prop, order} = data
  if (prop.indexOf('_dictText') !== -1) {
    roleQueryParams.orderBy = prop.substring(0, prop.indexOf('_dictText'))
  } else {
    roleQueryParams.orderBy = prop
  }
  roleQueryParams.order = order === 'descending' ? 'desc' : 'asc'

  queryRoleList()
}

const roleTable = ref()
/**
 * 刷新查询
 */
function handleRefresh() {
  roleQueryParams.roleType = ''
  roleQueryParams.roleName = ''
  roleQueryParams.pageNo = 1
  roleQueryParams.pageSize = 10
  roleQueryParams.orderBy = ''
  roleQueryParams.order = ''

  // 清空排序
  roleTable.value.clearSort()
  queryRoleList()
}

// 授权列表
const authorizeVisible = ref(false)
const selectedRoleId = ref('')
const ownedPermissionIds = ref([])
/**
 * 打开授权列表
 */
async function handleAuthorize(id: string) {
  authorizeVisible.value = true
  selectedRoleId.value = id

  const result = await getPermissionIdsByRole(id)
  if (result.success) {
    ownedPermissionIds.value = result.data
  } else {
    ElMessage.error(result.message)
  }
}

onMounted(() => {
  queryRoleList()
})
</script>

<script lang="ts">
export default {
  name: "RoleSetting",
}
</script>

<style scoped lang="scss">
.role-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .role-query-wrapper {
    border-bottom: 1px solid var(--el-menu-border-color);
    margin-bottom: 10px;
  }

  .role-table-wrapper {
    flex-grow: 1;
    justify-content: flex-start;
    flex-direction: column;

    .role-button-wrapper {
      margin-bottom: 5px;

      .role-add-button {
        width: 100px;
      }
    }
  }
}

.button-more {
  margin-left: 12px;
}

.role-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 20px;

  .role-form-item {
    width: 310px;
    margin-bottom: 30px;
  }
}

.role-modify-button {
  width: 100px;
}
</style>

<style lang="scss">
.role-dialog {
  width: 700px;
  padding: 26px;
}
</style>
