<template>
  <el-dialog v-model="visible" title="用户列表">
    <el-row class="role-query-wrapper">
      <el-form inline @keyup.enter="queryUserListWithRole" :model="userQueryParams">
        <el-form-item label="部门" @click="handleSelectDepart">
          <el-input v-model="selectedDepartsText" readonly placeholder="请选择部门" :suffix-icon="ArrowDown"></el-input>
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
    <el-row>
      <div class="role-button-wrapper">
        <el-button type="primary" :icon="Plus" class="role-add-button">新增关联</el-button>
        <el-button :icon="Plus" class="role-add-button">取消关联</el-button>
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
      >
        <el-table-column prop="departIds_dictText" label="部门" sortable="custom" />
        <el-table-column prop="realName" label="用户" sortable="custom" />
        <el-table-column prop="username" label="账号" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="handleRemove(scope.row.id)">取消关联</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="pagination-wrapper">
      <el-pagination layout="total, prev, pager, next, sizes"
                     :total="userResult.total || 0"
                     background
                     v-model:current-page="userQueryParams.pageNo" @update:current-page="queryUserListWithRole"
                     v-model:page-size="userQueryParams.pageSize" @update:page-size="queryUserListWithRole"
      />
    </div>

    <depart-select-dialog v-model:visible="departSelectVisible" v-model:result-departs="resultDeparts" />
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {ArrowDown, Plus, Refresh, Search} from "@element-plus/icons-vue";
import {getUserListByRole} from "@/api/setting";
import {ElMessage} from "element-plus";
import DepartSelectDialog from "@/components/dapart/DepartSelectDialog.vue";

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
  pageSize: 10,
  orderBy: '',
  order: ''
})
const selectedDepartsText = ref('')
const userResult = reactive([])

watch(() => props.roleId, (value) => {
  userQueryParams.roleId = value;
  queryUserListWithRole()
})
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
function handleSort(data: {column: any, prop: string, order: any }) {
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
/**
 * 刷新
 */
function handleRefresh() {
  userQueryParams.departIds = ''
  userQueryParams.username = ''
  userQueryParams.pageNo = 1
  userQueryParams.pageSize = 10
  userQueryParams.orderBy = ''
  userQueryParams.order = ''

  resultDeparts.value = []

  userTableRef.value.clearSort()
  queryUserListWithRole()
}

const departSelectVisible = ref(false)

/**
 * 取消关联（单个）
 */
function handleRemove(userId: string) {

}

/**
 * 选择部门
 */
function handleSelectDepart() {
  departSelectVisible.value = true
}

const resultDeparts = ref([])

watch(resultDeparts, (value) => {
  // console.log(value)
  if (value.length === 0) {
    selectedDepartsText.value = ''
    userQueryParams.departIds = ''
  } else if (value.length === 1) {
    selectedDepartsText.value = value[0].label
    userQueryParams.departIds = value[0].id
  } else {
    selectedDepartsText.value = value[0].label + '...等' + value.length + '个部门'
    const ids = []
    value.forEach(item => {ids.push(item.id)})
    userQueryParams.departIds = ids.toString()
  }
}, {deep: true})

watch(visible, (value) => {
  if (!value) {
    resultDeparts.value = []
  } else {
    queryUserListWithRole()
  }
})
/*const departIds = ref([])
watch(departSelectVisible, (value) => {
  if (!value) {
    if (selectedDeparts.value.length === 0) {
      selectedDepartsText.value = ''
      userQueryParams.departIds = ''
    } else if (selectedDeparts.value.length === 1) {
      selectedDepartsText.value = selectedDeparts.value[0].label
      userQueryParams.departIds = selectedDeparts.value[0].id
    } else {
      selectedDepartsText.value = selectedDeparts.value[0].label + '...等' + value.length + '个部门'
      selectedDeparts.value.forEach(item => {departIds.value.push(item.id)})
      userQueryParams.departIds = departIds.value.toString()
    }
  }
})*/

onMounted(() => {
  // queryUserListWithRole()
})
</script>

<script lang="ts">
export default {
  name: "UserDialog",
}
</script>

<style scoped lang="scss">

</style>
