<template>
  <el-form class="account-form">
    <el-form-item>
      <el-input placeholder="用户账号/手机号" clearable :prefix-icon="User" size="large" />
    </el-form-item>
    <el-form-item>
      <el-input placeholder="密码" clearable :prefix-icon="Key" size="large" />
    </el-form-item>
    <el-row>
      <el-col :span="16">
        <el-form-item>
          <el-input placeholder="验证码" clearable :prefix-icon="Finished" size="large" />
        </el-form-item>
      </el-col>
      <el-col :span="7" :offset="1" class="captcha">
        <el-image :src="getAssets('image/login-404.svg')" fit="contain" />
      </el-col>
    </el-row>
    <el-form-item class="login-checkbox">
      <el-checkbox label="记住密码" size="large" />
      <el-checkbox label="自动登录" size="large" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="large" class="login-button">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">

import {Finished, Key, User} from "@element-plus/icons-vue";
import {getAssets} from "@/utils";
</script>

<style scoped lang="scss">
  .account-form {
    .captcha {
      padding: 3px;
    }

    .login-button {
      width: 100%;
    }
  }
</style>
