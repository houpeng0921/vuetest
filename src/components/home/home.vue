<template>
  <el-container>
    <el-header>
      <!--头部-->
      <top></top>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!--NavMenu组件-->
        <navmenu></navmenu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入top组件
import top from '../common/top.vue'
// 引入NavMenu组件
import navmenu from '../common/NavMenu.vue'

export default {
  components: {
    top,
    navmenu
  },
  // 验证token是否存在的函数越早执行越好
  beforeCreate () {
    // 验证是否存在token
    var token = window.localStorage.getItem('token')
    if (!token) {
      this.$router.push({name: 'login'})
    }
    // 给所有的axios请求设置请求头
    this.$http.defaults.headers.common['Authorization'] = token
  }
}
</script>

<style scoped>

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    /*line-height: 200px;*/
    height: 100%;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
</style>
