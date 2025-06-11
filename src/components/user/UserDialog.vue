<template>
  <el-dialog v-model="visible" title="用户列表" width="60%" class="user-role-dialog">
    <div class="user-role-container">
      <el-row class="user-query-wrapper">
        <el-form inline @keyup.enter="queryUserListWithRole" :model="userQueryParams">
          <el-form-item label="部门" @click="departSelectVisible = true">
            <el-input v-model="selectedDepartsText" readonly placeholder="请选择部门" :suffix-icon="ArrowDown" class="query-form-item"></el-input>
          </el-form-item>
          <el-form-item label="用户">
            <el-input v-model="userQueryParams.username" placeholder="用户" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="queryUserListWithRole">搜索</el-button>
            <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="user-table-wrapper">
        <div class="role-button-wrapper">
          <el-button type="primary" :icon="Plus" class="role-add-button" @click="userSelectDialogVisible = true">新增关联</el-button>
          <el-button type="info" plain :icon="CircleClose" class="role-add-button" @click="handleBatchDelete">取消关联</el-button>
        </div>
        <el-table
          v-loading="userLoading"
          :data="userResult.records"
          stripe
          highlight-current-row
          table-layout="auto"
          :header-cell-style="{'text-align': 'center'}"
          :cell-style="{'text-align': 'center'}"
          class="user-table"
          @sort-change="handleSort"
          ref="userTableRef"
          @selection-change="handleSelectUser"
          height="270"
        >
          <el-table-column type="selection" />
          <el-table-column prop="departIds_dictText" label="部门" sortable="custom" width="200"/>
          <el-table-column prop="realName" label="用户" sortable="custom"/>
          <el-table-column prop="username" label="账号"/>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" text type="danger" @click="handleRemove(scope.row.id)">取消关联</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div class="pagination-wrapper">
        <el-pagination layout="total, prev, pager, next, sizes"
                       :page-sizes="[5, 10, 20, 50, 100]"
                       :total="userResult.total || 0"
                       background
                       v-model:current-page="userQueryParams.pageNo" @update:current-page="queryUserListWithRole"
                       v-model:page-size="userQueryParams.pageSize" @update:page-size="queryUserListWithRole"
        />
      </div>
    </div>

    <depart-select-dialog v-model:visible="departSelectVisible" v-model:result-departs="resultDeparts" :title="'选择部门'" ref="departSelectRef" />

    <user-select-dialog v-model:visible="userSelectDialogVisible" v-model:result-users="resultUsers" :title="'添加关联用户'" />
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, reactive, ref, watch} from "vue";
import {ArrowDown, CircleClose, Plus, Refresh, Search} from "@element-plus/icons-vue";
import {addUsersForRole, getUserListByRole, removeUserFromRole, removeUsersFromRole} from "@/api/setting";
import {ElMessage, ElMessageBox} from "element-plus";
import DepartSelectDialog from "@/components/dapart/DepartSelectDialog.vue";
import UserSelectDialog from "@/components/user/UserSelectDialog.vue";

const props = defineProps(["visible", 'roleId']);
const emit = defineEmits(["update:visible"]);
const visible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit("update:visible", val);
  }
})

const userLoading = ref(false);
const userQueryParams = reactive({
  roleId: '',
  username: "",
  departIds: '',
  pageNo: 1,
  pageSize: 5,
  orderBy: '',
  order: ''
})
const selectedDepartsText = ref('')
const userResult = reactive([])

/**
 * 查询角色关联的用户列表
 */
async function queryUserListWithRole() {
  const result = await getUserListByRole(userQueryParams)
  if (result.success) {
    Object.assign(userResult, result.data)
  } else {
    ElMessage.error(result.message)
  }
}

/**
 * 排序
 */
function handleSort(data: { column: any, prop: string, order: any }) {
  const {prop, order} = data
  if (prop.indexOf('_dictText') !== -1) {
    userQueryParams.orderBy = prop.substring(0, prop.indexOf('_dictText'))
  } else {
    userQueryParams.orderBy = prop
  }
  userQueryParams.order = order === 'descending' ? 'desc' : 'asc'

  queryUserListWithRole()
}

const userTableRef = ref()
const departSelectRef = ref()

/**
 * 刷新
 */
function handleRefresh() {
  userQueryParams.departIds = ''
  userQueryParams.username = ''
  userQueryParams.pageNo = 1
  userQueryParams.pageSize = 5
  userQueryParams.orderBy = ''
  userQueryParams.order = ''

  resultDeparts.value = []
  departSelectRef.value.clear()

  userTableRef.value.clearSort()
  queryUserListWithRole()
}

const departSelectVisible = ref(false)

/**
 * 取消关联（单个）
 */
function handleRemove(userId: string) {
  ElMessageBox.confirm('确认删除关联用户？', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    const result = await removeUserFromRole({
      roleId: props.roleId,
      userId: userId
    })
    if (result.success) {
      ElMessage.success(result.message)
      await queryUserListWithRole()
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {})
}

const resultDeparts = ref([])

watch(resultDeparts, (value) => {
  if (value.length === 0) {
    selectedDepartsText.value = ''
    userQueryParams.departIds = ''
  } else if (value.length === 1) {
    selectedDepartsText.value = value[0].label
    userQueryParams.departIds = value[0].id
  } else {
    let label = ''
    if (value[0].label === '新华手术器械有限公司') {
      label = '新华手术器械'
    } else {
      label = value[0].label
    }
    selectedDepartsText.value = label + '...等' + value.length + '个部门'
    const ids = []
    value.forEach(item => {
      ids.push(item.id)
    })
    userQueryParams.departIds = ids.toString()
  }
}, {deep: true})

watch(visible, (value) => {
  if (!value) {
    resultDeparts.value = []
    resultUsers.value = []
    departSelectRef.value.clear()
  } else {
    userQueryParams.roleId = props.roleId;
    queryUserListWithRole()
  }
})

const userSelectDialogVisible = ref(false)
const resultUsers = ref([])
watch(resultUsers, async (value) => {
  if (value.length > 0) {
    console.log(value)
    const userIdList: string[] = []
    value.forEach(item => {
      userIdList.push(item.id)
    })
    const result = await addUsersForRole({
      roleId: props.roleId,
      userIdList: userIdList
    })
    if (result.success) {
      ElMessage.success(result.message)
      await queryUserListWithRole()
      resultUsers.value = []
    } else {
      ElMessage.error(result.message)
    }
  }
}, {deep: true})

const selectedTableIds = ref([])
/**
 * 用户选择
 */
function handleSelectUser(value) {
  selectedTableIds.value = []
  value.forEach(item => {
    selectedTableIds.value.push(item.id)
  })
}

/**
 * 批量删除
 */
async function handleBatchDelete() {
  if (selectedTableIds.value.length === 0) {
    ElMessage.warning('至少选择一名用户！')
    return
  }
  ElMessageBox.confirm('确认删除关联用户？', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    const result = await removeUsersFromRole({
      roleId: props.roleId,
      userIdList: selectedTableIds.value
    })
    if (result.success) {
      ElMessage.success(result.message)
      await queryUserListWithRole()
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {})
}
</script>

<script lang="ts">
export default {
  name: "UserDialog",
}
</script>

<style scoped lang="scss">
.user-role-dialog {

  .user-role-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: space-between;

    .user-query-wrapper {
      margin-bottom: 10px;
      border-bottom: 1px solid var(--el-menu-border-color);
    }

    .user-table-wrapper {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
  }

}
</style>

<style lang="scss">
.user-role-dialog {
  height: 480px;
  display: flex;
  flex-direction: column;

  .el-dialog__body {
    flex-grow: 1;
    margin-top: 10px;
  }
}
</style>
