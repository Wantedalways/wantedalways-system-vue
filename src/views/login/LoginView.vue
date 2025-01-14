<template>
  <el-container class="container">
    <el-main class="main">
      <el-image :src="getAssets('image/login-background.svg')" class="login-image" />
      <div class="form">
        <div class="form-header">
          <a href="/">
            <el-image :src="getAssets('image/logo.png')" class="logo"/>
            <span class="title">手术器械</span>
          </a>
          <div class="desc">手术器械OA平台</div>
        </div>
        <div class="form-main">
          <el-tabs stretch class="form-tab">
            <el-tab-pane label="密码登录">
              <account-login />
            </el-tab-pane>
            <el-tab-pane label="扫码登录" disabled>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-main>
    <el-footer class="footer">
      <el-link type="info" target="_blank" :underline="false" class="link">Copyright &copy; 2025 Wantedalways</el-link>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
  import {getAssets} from "@/utils";
  import AccountLogin from "@/views/login/AccountLogin.vue";
</script>

<style scoped lang="scss">
  .container {
    height: 100%;
    background-size: auto;
    justify-content: center;
    background: #EBEEF5 url(@/assets/image/background.svg) no-repeat;
    background-size: cover;

    .main {
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      .login-image {
        width: 40%;
      }

      .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 350px;

        .form-header {
          text-align: center;
          margin-bottom: 50px;

          .logo {
            height: 70px;
            vertical-align: bottom;
          }

          .title {
            position: relative;
            bottom: 10px;
            font-weight: 600;
            font-size: 20px;
            color: $loginTitleColor;
          }

          .desc {
            font-size: 15px;
            font-weight: 300;
            color: $loginTitleColor;
            margin-top: 10px;
          }
        }
      }
    }

    .footer {
      text-align: center;

      .link {
        font-size: 12px;
      }
    }
  }
</style>
