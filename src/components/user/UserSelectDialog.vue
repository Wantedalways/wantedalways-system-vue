<template>
  <tree-dialog v-model:visible="visible"
               :title="title"
               v-model:selected-items="selectedUserItems"
               v-model:result-items="resultUsers"
               :type="'用户'"
  >
    <div class="tree-wrapper">
      <el-input v-model="userQueryParams" :prefix-icon="Search" placeholder="搜索用户" class="search"></el-input>
      <el-scrollbar class="tree-scrollbar" >
        <el-tree :data="userTreeData"
                 node-key="id"
                 :expand-on-click-node="false"
                 @node-click="handleSelect"
                 ref="userTreeRef"
                 check-strictly
                 :filter-node-method="treeFilter"
                 lazy
                 :load="handleLoad"
                 :props="treeProps"
        >
          <template #default="{data, node}">
            <el-icon class="tree-node-icon">
              <Management v-if="!data.userFlag" />
              <UserFilled v-if="data.userFlag" />
            </el-icon>
            <span>{{data.label}}</span>
            <el-icon v-if="node.checked" class="checked-node"><Select /></el-icon>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </tree-dialog>
</template>

<script setup lang="ts">

import {Management, Search, Select, UserFilled} from "@element-plus/icons-vue";
import TreeDialog from "@/components/treeDialog/TreeDialog.vue";
import {computed, onMounted, reactive, ref, toRaw, toRef, watch} from "vue";
import {getUserTreeList} from "@/api/setting";
import {ElMessage} from "element-plus";
import user from "@/stores/modules/user";

const props = defineProps(["visible", 'resultUsers', 'title']);
const emit = defineEmits(["update:visible", 'update:resultUsers']);
const visible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit("update:visible", val);
  }
})

const resultUsers = computed({
  get() {
    return props.resultUsers;
  },
  set(val) {
    emit("update:resultUsers", val);
  }
})

const treeProps = {
  label: 'name',
  isLeaf: 'leaf'
}

const userQueryParams = ref('')
const userTreeData = reactive([])

/**
 * 获取用户树
 */
async function getUserTree(parentId: string) {
  const result = await getUserTreeList(parentId)
  if (result.success) {
    Object.assign(userTreeData, result.data)
  } else {
    ElMessage.error(result.message)
  }
}

/**
 * 懒加载
 */
async function handleLoad(node: Node, resolve: (data: []) => void, reject: () => void) {
  if (node.level === 0) {
    resolve([...userTreeData]);
  }

  if (node.level >= 1) {
    const result = await getUserTreeList(node.data.id)
    if (result.success) {
      resolve(result.data)
    } else {
      ElMessage.error(result.message)
      reject()
    }
  }
}

const selectedUserItems = ref([])

/**
 * 选择用户
 */
function handleSelect(data) {
  if (!data.userFlag) {
    return
  }
  if (selectedUserItems.value.includes(data)) {
    selectedUserItems.value = selectedUserItems.value.filter(item => item.id !== data.id)
  } else {
    selectedUserItems.value.push(data)
  }
}

const userTreeRef = ref()
/**
 * 刷新选中状态
 */
watch(selectedUserItems, (value) => {
  userTreeRef.value.setCheckedKeys([])
  value.forEach(item => {
    userTreeRef.value.setChecked(item, true, false)
  })
}, {deep: true})

/**
 * 搜索
 */
function treeFilter(value: string, data) {
  if (!value) {
    return true
  }
  return data.label.includes(value)
}

watch(userQueryParams, (value) => {
  userTreeRef.value.filter(value)
})

watch(visible, (value) => {
  if (value) {
    if (resultUsers.value.length > 0) {
      selectedUserItems.value = [...resultUsers.value];
    }
  } else {
    selectedUserItems.value = []
  }
})
onMounted(() => {
  getUserTree('')
})
</script>

<script lang="ts">
export default {
  name: "UserSelectDialog",
}
</script>

<style scoped lang="scss">

</style>
