<template>
  <div class="role-container">
    <el-row class="role-query-wrapper">
      <el-form inline @keyup.enter="queryRoleList" :model="roleQueryParams">
        <el-form-item label="角色类型">
          <el-select v-model="roleQueryParams.roleType" style="width: 160px" clearable placeholder="角色类型" @change="queryRoleList">
            <el-option v-for="type in roleType" :key="type.value" :label="type.text" :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="roleQueryParams.roleName" placeholder="角色名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="queryRoleList">搜索</el-button>
          <el-button :icon="Refresh">刷新</el-button>
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
        border
        table-layout="auto"
        :header-cell-style="{'text-align': 'center'}"
        :cell-style="{'text-align': 'center'}"
        class="role-table"
      >
<!--        <el-table-column type="index" label="序号" :index='index' />-->
        <el-table-column prop="roleType_dictText" label="类型" />
        <el-table-column prop="roleName" label="名称" />
        <el-table-column prop="roleCode" label="编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="上级角色">
          <template #default="scope">
            {{scope.row.parentId_dictText ? scope.row.parentId_dictText : '/'}}
          </template>
        </el-table-column>
        <el-table-column prop="createBy_dictText" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" text type="primary">用户</el-button>
            <el-button size="small" text type="primary">授权</el-button>
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
                    <el-button size="small" text type="primary">修改</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="small" text type="danger">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="pagination-wrapper">
      分页
    </div>
  </div>
  <el-dialog v-model="addDialogVisible" title="新建角色">
    <el-form :model="roleAddParams">
      <el-form-item label="角色类型">
        <el-select v-model="roleAddParams.roleType" clearable placeholder="角色类型">
          <el-option v-for="type in roleType" :key="type.value" :label="type.text" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="roleAddParams.roleName" clearable placeholder="角色名称" />
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="roleAddParams.roleCode" clearable placeholder="角色编码" />
      </el-form-item>
      <el-form-item label="上级角色">
        <el-select v-model="roleAddParams.parentId" placeholder="上级角色">

        </el-select>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleAddParams.description" clearable placeholder="角色描述" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">确认</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {getDict} from "@/utils";
import {DICT_ROLE_TYPE} from "@/constant/cache";
import {ArrowDown, Plus, Refresh, Search} from "@element-plus/icons-vue";
import {getRoleList} from "@/api/setting";
import {ElMessage} from "element-plus";

const roleType = computed(() => getDict(DICT_ROLE_TYPE))
const roleQueryParams = reactive({
  roleType: '',
  roleName: '',
  pageNo: 1,
  pageSize: 10,
})

const roleLoading = ref(false)
const roleResult = reactive({})
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
  description : '',
})

onMounted(() => {
  queryRoleList()
})
</script>

<script lang="ts">
export default {
  name: "roleSetting",
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

    .role-table {

    }
  }
}

.button-more {
  margin-left: 12px;
}
</style>
