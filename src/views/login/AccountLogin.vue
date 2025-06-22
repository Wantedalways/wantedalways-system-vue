<template>
  <el-form
    class="account-form"
    :model="loginInfo"
    :rules="verifyRules"
    ref="loginForm"
    @keyup.enter="handleLogin"
  >
    <el-form-item prop="account">
      <el-input
        placeholder="用户账号/手机号"
        clearable
        :prefix-icon="User"
        size="large"
        v-model="loginInfo.account"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        placeholder="密码"
        type="password"
        show-password
        clearable
        :prefix-icon="Key"
        size="large"
        v-model="loginInfo.password"
      />
    </el-form-item>
    <el-row>
      <el-col :span="16">
        <el-form-item prop="captcha">
          <el-input
            placeholder="验证码"
            clearable
            :prefix-icon="Finished"
            size="large"
            v-model="loginInfo.captcha"
          />
        </el-form-item>
      </el-col>
      <el-col :span="7" :offset="1" class="captcha">
        <el-image
          v-if="isCaptchaSuccess"
          :src="captchaImage"
          fit="contain"
          @click="handleCaptcha"
        />
        <el-image
          v-else
          :src="getAssets('image/login-404.svg')"
          fit="contain"
          @click="handleCaptcha"
        />
      </el-col>
    </el-row>
    <!--    <el-form-item class="login-checkbox">
      <el-checkbox label="记住密码" size="large" />
      <el-checkbox label="自动登录" size="large" />
    </el-form-item>-->
    <el-form-item>
      <el-button
        type="primary"
        size="large"
        class="login-button"
        @click="handleLogin"
        :loading="loading"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Finished, Key, User } from '@element-plus/icons-vue'
import { getAssets } from '@/utils'
import { onMounted, reactive, ref } from 'vue'
import { getCaptcha } from '@/api/user'
import { ElNotification, type FormRules } from 'element-plus'
import type { LoginModel } from '@/stores/type'
import useUserStore from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import storage from '@/utils/storage'
import { USER_ACCOUNT } from '@/constant/cache'

// 验证码
const isCaptchaSuccess = ref(false)
const captchaImage = ref('')
const checkKey = ref('')

/**
 * 处理验证码
 */
async function handleCaptcha() {
  loginInfo.captcha = ''
  checkKey.value = new Date().getTime().toString()
  try {
    const result = await getCaptcha(checkKey.value)
    if (result.success) {
      isCaptchaSuccess.value = true
      captchaImage.value = result.data
    } else {
      isCaptchaSuccess.value = false
      ElNotification.error({
        title: '系统提示',
        message: result.message,
      })
    }
  } catch (error) {
    isCaptchaSuccess.value = false
    console.log(error)
  }
}

interface LoginInfo {
  account: string
  password: string
  captcha: string
}
// 登录表单
const loginInfo = reactive<LoginInfo>({
  account: '',
  password: '',
  captcha: '',
})

// 登录类型（0，用户名；1，手机号）
enum LoginTypes {
  username = 0,
  phone = 1,
}

const loginType = ref(0)

/**
 * 判断用户账号或手机号
 */
const usernameOrPhone = (
  rule: unknown,
  value: string,
  callback: (res?: Error) => void,
) => {
  const regex = /^1[3-9]\d{9}$/
  if (regex.test(value)) {
    loginType.value = LoginTypes.phone
  } else {
    loginType.value = LoginTypes.username
  }
  callback()
}

// 验证规则
const verifyRules = reactive<FormRules<LoginInfo>>({
  account: [
    { required: true, message: '请输入用户账号或手机号', trigger: 'blur' },
    { validator: usernameOrPhone },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const loginForm = ref()
const loading = ref(false)
const router = useRouter()

/**
 * 处理登录
 */
function handleLogin() {
  loginForm.value.validate(async valid => {
    if (valid) {
      storage.set(USER_ACCOUNT, loginInfo.account)
      loading.value = true

      const loginModel: LoginModel = {
        type: loginType.value,
        account: loginInfo.account,
        password: loginInfo.password,
        captcha: loginInfo.captcha,
        checkKey: checkKey.value,
      }

      const userStore = useUserStore()
      try {
        await userStore.accountLogin(loginModel)

        ElNotification.success({
          title: '欢迎',
          message: '登录成功',
        })
        await router.push('/')
      } catch (error) {
        loading.value = false
        ElNotification.error({
          title: '系统提示',
          message: (error as Error).message,
        })

        await handleCaptcha()
      }
    }
  })
}

onMounted(() => {
  // 获取验证码
  handleCaptcha()
  // 填充登录信息
  loginInfo.account = storage.get(USER_ACCOUNT) as string
})
</script>

<style scoped lang="scss">
.account-form {
  .captcha {
    padding: 3px;
    cursor: pointer;
  }

  .login-button {
    margin-top: 25px;
    width: 100%;
  }
}
</style>
