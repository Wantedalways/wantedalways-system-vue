<template>
  <div>
    <el-row class="permission-query-wrapper">
      <el-form inline :model="permissionQueryParams" @submit.prevent>
        <el-form-item label="权限名称">
          <el-input v-model="permissionQueryParams.name" placeholder="权限名称" clearable
                    @keyup.enter="queryPermissionList"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="queryPermissionList">搜索</el-button>
          <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="permission-table-wrapper">
      <div class="permission-button-wrapper">
        <el-button type="primary" :icon="Plus" class="role-add-button" @click="addDialogVisible = true">添加</el-button>
      </div>
      <el-table
        v-loading="permissionLoading"
        :data="permissionResult.data"
        stripe
        highlight-current-row
        table-layout="auto"
        :header-cell-style="{'text-align': 'center'}"
        :cell-style="{'text-align': 'center'}"
        class="permission-table"
        ref="permissionTableRef"
        row-key="id"
      >
        <el-table-column prop="name" label="权限名称"/>
        <el-table-column prop="code" label="编码"/>
        <el-table-column prop="icon" label="图标"/>
        <el-table-column prop="url" label="路径"/>
        <el-table-column prop="component" label="组件"/>
        <el-table-column prop="sort" label="排序"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="handleEditParams(scope.row)">修改</el-button>
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
                    <el-button size="small" text type="primary" @click="handleAddChild(scope.row)">添加下级</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="small" text type="danger" @click="handleDelete(scope.row)">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>

  <el-dialog v-model="addDialogVisible" title="新增权限" @open="getPermissionSelectList">
    <el-form :model="addParams" :rules="rules" hide-required-asterisk ref="addFormRef">
      <el-form-item label="所属系统" prop="serviceId">
        <el-select v-model="addParams.serviceId">
          <el-option label="集成管理系统" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="type">
        <el-radio-group v-model="addParams.type">
          <el-radio-button label="一级权限" value="0"/>
          <el-radio-button label="子权限" value="1"/>
          <el-radio-button label="按钮权限" value="2"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上级权限" prop="parentId" v-if="addParams.type !== '0'">
        <el-tree-select v-model="addParams.parentId" :data="permissionSelectList" check-strictly/>
      </el-form-item>
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="addParams.name"/>
      </el-form-item>
      <el-form-item label="权限编码" prop="code">
        <el-input v-model="addParams.code"/>
      </el-form-item>
      <el-form-item label="访问路径" prop="url">
        <el-input v-model="addParams.url"/>
      </el-form-item>
      <el-form-item label="前端组件" prop="component">
        <el-input v-model="addParams.component"/>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="addParams.icon" :prefix-icon="addParams.icon" readonly>
          <template #suffix>
            <el-button :icon="CircleClose" v-if="addParams.icon" @click="addParams.icon = ''"/>
          </template>
          <template #append>
            <el-button :icon="MoreFilled" @click="iconPickerVisible = true"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="addParams.sort"/>
      </el-form-item>
      <el-form-item label="路由权限" prop="route">
        <el-switch v-model="addParams.route"/>
      </el-form-item>
      <el-form-item label="缓存" prop="cache">
        <el-switch v-model="addParams.cache"/>
      </el-form-item>
      <el-form-item label="隐藏" prop="hidden">
        <el-switch v-model="addParams.hidden"/>
      </el-form-item>
      <el-form-item label="固定标签" prop="affix">
        <el-switch v-model="addParams.affix"/>
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-switch v-model="addParams.status" active-value="1" inactive-value="0"/>
      </el-form-item>
      <el-form-item label="末端节点" prop="leaf">
        <el-switch v-model="addParams.leaf"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addDialogVisible = false" class="role-modify-button">取消</el-button>
      <el-button type="primary" @click="handleAddPermission" class="role-modify-button">确认</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="editDialogVisible" title="修改权限" @open="getPermissionSelectList">
    <el-form :model="editParams" :rules="rules" hide-required-asterisk ref="editFormRef">
      <el-form-item label="所属系统" prop="serviceId">
        <el-select v-model="editParams.serviceId">
          <el-option label="集成管理系统" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="type">
        <el-radio-group v-model="editParams.type">
          <el-radio-button label="一级权限" value="0"/>
          <el-radio-button label="子权限" value="1"/>
          <el-radio-button label="按钮权限" value="2"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上级权限" prop="parentId" v-show="editParams.type !== '0'">
        <el-tree-select v-model="editParams.parentId" :data="permissionSelectList" check-strictly/>
      </el-form-item>
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="editParams.name"/>
      </el-form-item>
      <el-form-item label="权限编码" prop="code">
        <el-input v-model="editParams.code"/>
      </el-form-item>
      <el-form-item label="访问路径" prop="url">
        <el-input v-model="editParams.url"/>
      </el-form-item>
      <el-form-item label="前端组件" prop="component">
        <el-input v-model="editParams.component"/>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="editParams.icon" :prefix-icon="editParams.icon" readonly>
          <template #suffix>
            <el-button :icon="CircleClose" v-if="editParams.icon" @click="editParams.value.icon = ''"/>
          </template>
          <template #append>
            <el-button :icon="MoreFilled" @click="iconPickerVisible = true"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="editParams.sort"/>
      </el-form-item>
      <el-form-item label="路由权限" prop="route">
        <el-switch v-model="editParams.route"/>
      </el-form-item>
      <el-form-item label="缓存" prop="cache">
        <el-switch v-model="editParams.cache"/>
      </el-form-item>
      <el-form-item label="隐藏" prop="hidden">
        <el-switch v-model="editParams.hidden"/>
      </el-form-item>
      <el-form-item label="固定标签" prop="affix">
        <el-switch v-model="editParams.affix"/>
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-switch v-model="editParams.status" active-value="1" inactive-value="0"/>
      </el-form-item>
      <el-form-item label="末端节点" prop="leaf">
        <el-switch v-model="editParams.leaf"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false" class="role-modify-button">取消</el-button>
      <el-button type="primary" @click="handleEditPermission" class="role-modify-button">确认</el-button>
    </template>
  </el-dialog>

  <icon-picker v-model:visible="iconPickerVisible" v-model:model-value="addParams.icon"/>
</template>

<script setup lang="ts">

import {ArrowDown, CircleClose, MoreFilled, Plus, Refresh, Search} from "@element-plus/icons-vue";
import {onActivated, reactive, ref, watch, watchEffect} from "vue";
import {
  addPermission,
  deletePermission,
  editPermission,
  getAllPermissionAsTree,
  getPermissionListAsTree,
  validatePermission
} from "@/api/setting";
import {ElMessage, ElMessageBox, ElTreeSelect, type FormRules} from "element-plus";
import {useDebounceFn} from "@/utils/debounce";
import type {Permission} from "@/api/type";
import IconPicker from "@/components/icon/IconPicker.vue";

const permissionQueryParams = reactive({
  serviceId: '1',
  name: ''
})
const permissionLoading = ref(false);
const permissionResult = reactive({})

/**
 * 查询权限列表
 */
const queryPermissionList = useDebounceFn(async () => {
  permissionLoading.value = true
  const result = await getPermissionListAsTree(permissionQueryParams.serviceId, permissionQueryParams.name)
  if (result.success) {
    Object.assign(permissionResult, result)
  } else {
    ElMessage.error(result.message)
  }
  permissionLoading.value = false
}, 300)

/**
 * 刷新
 */
const handleRefresh = useDebounceFn(() => {
  permissionQueryParams.serviceId = ''
  permissionQueryParams.name = ''

  queryPermissionList()
})

const addFormRef = ref()
/**
 * 添加权限
 */
const handleAddPermission = useDebounceFn(() => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      const result = await addPermission(addParams.value)
      if (result.success) {
        ElMessage.success(result.message)
        queryPermissionList()
        addDialogVisible.value = false
      } else {
        ElMessage.error(result.message)
      }
    }
  })
})

const addDialogVisible = ref(false);
const addParams = ref({
  serviceId: '',
  parentId: '',
  type: '0',
  name: "",
  code: "",
  url: '',
  component: "",
  icon: '',
  sort: '',
  route: true,
  cache: true,
  hidden: false,
  affix: false,
  status: '1',
  leaf: true
})

const editParams = ref({
  id: '',
  serviceId: '',
  parentId: '',
  type: '0',
  name: "",
  code: "",
  url: '',
  component: "",
  icon: '',
  sort: '',
  route: true,
  cache: true,
  hidden: false,
  affix: false,
  status: '1',
  leaf: true
})

const editValidateParams = {
  name: '',
  code: '',
  url: '',
  component: '',
  sort: ''
}

watchEffect(() => {
  addParams.value.leaf = addParams.value.type !== '0'
  editParams.value.leaf = editParams.value.type !== '0'
})

const iconPickerVisible = ref(false);

const rules = reactive<FormRules<Permission>>({
  serviceId: [{required: true, message: '请选择所属系统', trigger: 'blur'}],
  parentId: [{required: true, message: '请选择所属系统', trigger: 'blur'}],
  name: [{validator: validateName, trigger: 'blur'}],
  code: [{validator: validateCode, trigger: 'blur'}],
  url: [{validator: validateUrl, trigger: 'blur'}],
  component: [{validator: validateComponent, trigger: 'blur'}],
  sort: [{validator: validateSort, trigger: 'blur'}]
})

async function validateName(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入权限名称'));
  } else {
    if (editValidateParams.name === '' || editValidateParams.name !== editParams.value.name) {
      const result = await validatePermission(value, 'name');
      if (!result.success) {
        callback(new Error(result.message));
      } else {
        callback();
      }
    } else {
      callback()
    }
  }
}

async function validateCode(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入权限编码'));
  } else {
    if (editValidateParams.code === '' || editValidateParams.code !== editParams.value.code) {
      const result = await validatePermission(value, 'code');
      if (!result.success) {
        callback(new Error(result.message));
      } else {
        callback();
      }
    } else {
      callback()
    }
  }
}

async function validateUrl(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入访问路径'));
  } else {
    if (editValidateParams.url === '' || editValidateParams.url !== editParams.value.url) {
      const result = await validatePermission(value, 'url');
      if (!result.success) {
        callback(new Error(result.message));
      } else {
        callback();
      }
    } else {
      callback()
    }
  }
}

async function validateComponent(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入前端组件'));
  } else {
    if (editValidateParams.component === '' || editValidateParams.component !== editParams.value.component) {
      const result = await validatePermission(value, 'component');
      if (!result.success) {
        callback(new Error(result.message));
      } else {
        callback();
      }
    } else {
      callback()
    }
  }
}

async function validateSort(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入前端组件'));
  } else {
    if (editValidateParams.sort === '' || editValidateParams.sort !== editParams.value.sort) {
      const result = await validatePermission(value, 'sort');
      if (!result.success) {
        callback(new Error(result.message));
      } else {
        callback();
      }
    } else {
      callback()
    }
  }
}

const permissionSelectList = ref([])

async function getPermissionSelectList() {
  const result = await getAllPermissionAsTree()
  if (result.success) {
    permissionSelectList.value = result.data.treeList
  } else {
    ElMessage.error(result.message)
  }
}

const editDialogVisible = ref(false)
function handleEditParams(data: any) {
  editParams.value = {
    id: data.id,
    serviceId: data.item.serviceId.toString(),
    parentId: data.parentId,
    type: data.item.type.toString(),
    name: data.name,
    code: data.code,
    url: data.url,
    component: data.component,
    icon: data.icon,
    sort: data.sort,
    route: data.item.route,
    cache: data.item.cache,
    hidden: data.item.hidden,
    affix: data.item.affix,
    status: data.item.status.toString(),
    leaf: data.item.leaf
  }

  editDialogVisible.value = true
}
const editFormRef = ref()
/**
 * 修改权限
 */
const handleEditPermission = useDebounceFn(() => {
  editFormRef.value.validate(async valid => {
    if (valid) {
      const result = await editPermission(editParams.value)
      if (result.success) {
        ElMessage.success(result.message)
        queryPermissionList()
        editDialogVisible.value = false
      } else {
        ElMessage.error(result.message)
      }
    }
  })
})

/**
 * 添加下级权限
 */
function handleAddChild(data: any) {
  addParams.value.serviceId = data.item.serviceId.toString();
  addParams.value.parentId = data.id
  addParams.value.type = '1'

  addDialogVisible.value = true
}

watch(addDialogVisible, (value) => {
  if (!value) {
    addParams.value = {
      serviceId: '',
      parentId: '',
      type: '0',
      name: "",
      code: "",
      url: '',
      component: "",
      icon: '',
      sort: '',
      route: true,
      cache: true,
      hidden: false,
      affix: false,
      status: '1',
      leaf: true
    }
  }
})

const handleDelete = useDebounceFn((data) => {
  ElMessageBox.confirm('确认删除该权限（' + data.name + '）？', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    const result = await deletePermission(data.id)
    if (result.success) {
      ElMessage.success(result.message);
      queryPermissionList()
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {})
})

onActivated(() => {
  queryPermissionList()
})
</script>

<script lang="ts">
export default {
  name: "PermissionSetting",
}
</script>

<style scoped lang="scss">

</style>
