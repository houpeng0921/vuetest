<template>
  <el-row>
    <el-col :span="4">
      <div class="grid-content bg-purple">LOGO</div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple-light">电商后台管理系统</div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple" style="text-align: right">
        <a href="#" @click.prevent="logOut">退出</a>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    logOut () {
      this.$confirm('此操作将退出, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除token
        window.localStorage.removeItem('token')
        // 跳转到登录页
        this.$router.push({name: 'login'})
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '退出失败'
        })
      })
    }
  }
}
</script>

<style scoped>
  .bg-purple-light {
    color: #fff;
    font-size: 24px;
  }

  .bg-purple a {
    color: orange;
  }
</style>
