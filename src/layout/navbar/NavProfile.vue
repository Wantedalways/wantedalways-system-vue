<template>
  <el-dropdown placement="bottom-start">
    <el-icon class="avatar">
      <UserFilled />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/">
          <el-dropdown-item :icon="HomeFilled">首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item :icon="Edit">修改密码</el-dropdown-item>
        <el-dropdown-item
          :icon="SwitchButton"
          divided
          style="color: brown"
          @click="handleLogout"
          >退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
111911
<script setup lang="ts">
import {Edit, HomeFilled, SwitchButton, UserFilled,} from '@element-plus/icons-vue'
import useUserStore from '@/stores/modules/user'
import {useRouter} from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

async function handleLogout() {
  await userStore.logout()
  await router.push('/login')
}
</script>

<style scoped lang="scss">
.avatar {
  font-size: 24px;
  cursor: pointer;
}
</style>

<style lang="scss"></style>
