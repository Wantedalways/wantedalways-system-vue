<template>
  <tree-dialog
    v-model:visible="visible"
    :title="title"
    v-model:selected-items="selectedUserItems"
    v-model:result-items="resultUsers"
    :type="'用户'"
  >
    <div class="tree-wrapper">
      <el-input
        v-model="userQueryParams"
        :prefix-icon="Search"
        placeholder="搜索用户"
        class="search"
        clearable
      />
      <el-scrollbar class="tree-scrollbar">
        <div
          v-show="userQueryVisible"
          v-loading="userSearchLoading"
          class="selected-list"
        >
          <div
            v-for="item in queryUserListData"
            :key="item.id"
            @click="handleSelectSearchUser(item)"
            class="selected-item"
          >
            <el-icon class="selected-icon"><UserFilled /></el-icon>
            <el-text class="selected-user">{{ item.realName }}</el-text>
            <el-text class="selected-depart">{{
              item.departIds_dictText
            }}</el-text>
          </div>
        </div>
        <el-tree
          v-show="!userQueryVisible"
          :data="userTreeData"
          node-key="id"
          :expand-on-click-node="false"
          @node-click="handleSelect"
          ref="userTreeRef"
          check-strictly
          lazy
          :load="handleLoad"
          :props="treeProps"
        >
          <template #default="{ data, node }">
            <el-icon class="tree-node-icon">
              <Management v-if="!data.userFlag" />
              <UserFilled v-if="data.userFlag" />
            </el-icon>
            <span>{{ data.label }}</span>
            <el-icon v-if="node.checked" class="checked-node"
              ><Select
            /></el-icon>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </tree-dialog>
</template>

<script setup lang="ts">
import { Management, Search, Select, UserFilled } from '@element-plus/icons-vue'
import TreeDialog from '@/components/treeDialog/TreeDialog.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { getUserListWithDepart, getUserTreeList } from '@/api/setting'
import { ElMessage } from 'element-plus'
import { useDebounceFn } from '@/utils/debounce'

const props = defineProps(['visible', 'resultUsers', 'title'])
const emit = defineEmits(['update:visible', 'update:resultUsers'])
const visible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})

const resultUsers = computed({
  get() {
    return props.resultUsers
  },
  set(val) {
    emit('update:resultUsers', val)
  },
})

const treeProps = {
  label: 'name',
  isLeaf: 'leaf',
}

const userQueryParams = ref('')
const userTreeData = reactive([])
const userQueryVisible = ref(false)
const userSearchLoading = ref(false)
const queryUserListData = ref([])
/**
 * 搜索用户
 */
watch(
  userQueryParams,
  useDebounceFn(async value => {
    const realName = value.trim()
    if (realName) {
      userQueryVisible.value = true
      userSearchLoading.value = true
      const result = await getUserListWithDepart(realName)
      if (result.success) {
        queryUserListData.value = result.data
        userSearchLoading.value = false
      } else {
        queryUserListData.value = []
        userSearchLoading.value = false
        ElMessage.error(result.message)
      }
    } else {
      queryUserListData.value = []
      userQueryVisible.value = false
      userSearchLoading.value = false
    }
  }),
)

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
async function handleLoad(
  node: Node,
  resolve: (data: []) => void,
  reject: () => void,
) {
  if (node.level === 0) {
    resolve([...userTreeData])
  }

  if (node.level >= 1) {
    const result = await getUserTreeList(node.data.id)
    if (result.success) {
      resolve(result.data)
      selectedUserItems.value.forEach(item => {
        if (item.search) {
          userTreeRef.value.setChecked(item, true, false)
        }
      })
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
    selectedUserItems.value = selectedUserItems.value.filter(
      item => item.id !== data.id,
    )
  } else {
    selectedUserItems.value.push(data)
  }
}

/**
 * 选择搜索后的用户
 */
function handleSelectSearchUser(data) {
  const user = {
    id: data.id,
    label: data.realName,
    leaf: true,
    name: data.realName,
    userFlag: true,
    search: true,
  }
  if (selectedUserItems.value.length === 0) {
    selectedUserItems.value.push(user)
  }
  selectedUserItems.value.forEach(item => {
    if (item.id === user.id) {
      userQueryParams.value = ''
    } else {
      selectedUserItems.value.push(user)
    }
  })
}

const userTreeRef = ref()
/**
 * 刷新选中状态
 */
watch(
  selectedUserItems,
  value => {
    if (userTreeRef.value) {
      userTreeRef.value.setCheckedKeys([])
      value.forEach(item => {
        userTreeRef.value.setChecked(item, true, false)
      })
    }
  },
  { deep: true },
)

watch(visible, value => {
  if (value) {
    if (resultUsers.value.length > 0) {
      selectedUserItems.value = [...resultUsers.value]
    }
  } else {
    userQueryParams.value = ''
    selectedUserItems.value = []
  }
})
onMounted(() => {
  getUserTree('')
})
</script>

<script lang="ts">
export default {
  name: 'UserSelectDialog',
}
</script>

<style scoped lang="scss"></style>
