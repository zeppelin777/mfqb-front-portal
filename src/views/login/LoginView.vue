<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2>后台管理系统</h2>
      <el-form label-width="100px" :rules="rules" :model="form" ref="form">
        <el-form-item label="用户名：" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="form.password"
            type="password"
          />
        </el-form-item>
        <el-form-item label="验证码：" prop="verifyCode">
          <el-input placeholder="请输入验证码" v-model="form.verifyCode">
            <template #append>
              <img class="captcha" :src="imgSrc" @click="getCaptcha()" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="loginSubmit()"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { login, captcha } from '@/api/login'
import CryptoJs from 'crypto-js'
export default {
  name: 'HomeView',
  data() {
    return {
      form: {
        username: '',
        password: '',
        verifyCode: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      captchaId: '',
      imgSrc: ''
    }
  },
  async mounted() {
    this.getCaptcha()
  },
  methods: {
    async getCaptcha() {
      const res = await captcha()
      if (res.code === 200) {
        this.captchaId = res.data.captchaId
        this.imgSrc = 'data:image/png;base64,' + res.data.base64
      }
    },
    async loginSubmit() {

      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await login({
            captchaId: this.captchaId,
            userName: this.form.username,
            password: this.showEncryptAES(this.form.password),
            verifyCode: this.form.verifyCode
          })
          if (res.code === 200) {
            localStorage.setItem('currentUser', res.data.userName)
            localStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    showEncryptAES(strMsg) {
      let key = CryptoJs.enc.Utf8.parse('i4zazdvo2xxus4y6')
      let str1 = CryptoJs.AES.encrypt(strMsg, key, {
        mode: CryptoJs.mode.ECB,
        padding: CryptoJs.pad.Pkcs7
      })
      let str = str1.toString()
      return str
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b4b6b;
  .login-box {
    width: 400px;

    :deep(.el-form-item__label) {
      font-size: 13px;
    }

    h2 {
      margin: 10px 0 25px;
      text-align: center;
      font-weight: 400;
    }

    :deep(.el-input-group__append) {
      padding: 0;
      width: 70px;
      height: 32px;
      border: none;
    }

    .captcha {
      // width: 125px;
      height: 100%;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  .login-btn {
    width: 100%;
  }
}
</style>
