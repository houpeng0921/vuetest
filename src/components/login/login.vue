<template>
  <div class="login">
    <el-form :model="loginObj" label-position="top" status-icon ref="ruleForm2" label-width="100px"
             class="demo-ruleForm">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="loginObj.username" type="text" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="loginObj.password" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="loginBtn" type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginObj: {
        username: 'admin',
        password: '123456'
      }
    }
  },
  methods: {
    async login () {
      var res = await this.$http.post('login', this.loginObj)
      var {data, meta: {msg, status}} = res.data
      if (status === 200) {
        // 保存token
        window.localStorage.setItem('token', data.token)
        this.$message({
          message: msg,
          type: 'success'
        })
        this.$router.push('/')
      } else {
        this.$message.error(msg)
      }
      /* this.$http.post('login', this.loginObj).then(res => {
          var {data, meta: {msg, status}} = res.data
          if (status === 200) {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.$router.push('/home')
          } else {
            this.$message.error(msg)
          }
        }) */
    }
  }
}
</script>

<style scoped>
  .login {
    position: relative;
  }

  .el-form {
    width: 500px;
    border-radius: 10px;
    background-color: #fff;
    padding: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    /*margin-left: -250px;*/
    transform: translate(-50%, 70%);
  }

  .loginBtn {
    width: 100%;
    font-size: 20px;
  }
</style>
