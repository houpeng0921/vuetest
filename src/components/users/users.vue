<template>
  <el-card>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索区域-->
    <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="showadd = true">添加用户</el-button>
    <!--表格区域
      :data - 绑定数据源
      表格中的property是从data中取的属性
    -->
    <el-table :border="true" ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column property="username" label="姓名" width="120">
      </el-table-column>
      <el-table-column property="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column property="mobile" label="电话">
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <!--{{ scope.row.mg_state }}-->
          <el-switch @change="changeStatus(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)" type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button @click="setRole(scope.row)" type="success" icon="el-icon-check" plain size="mini"></el-button>
          <el-button @click="del(scope.row.id)" type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <!--
    layout - 组件显示的结构
    -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--新增面板-->
    <!--
    el-dialog 对话框组件
    title 标题
    visible.sync 控制元素显示与隐藏
    -->
    <el-dialog title="添加用户" :visible.sync="showadd">
      <el-form label-position="right" :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showadd = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑面板-->
    <el-dialog title="编辑用户" :visible.sync="showEdit">
      <el-form :model="editForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="postEdit(editForm.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配角色面板-->
    <el-dialog title="分配角色" :visible.sync="showRole">
      <el-form :model="roleForm">
        <el-form-item label="当前用户" :label-width="formLabelWidth">
          <label>{{roleForm.username}}</label>
        </el-form-item>
        <el-form-item label="请选择角色" :label-width="formLabelWidth">
          <el-select v-model="roleForm.rid" placeholder="请选择">
            <el-option
              disabled
              label="请选择"
              :value="-1">
            </el-option>
            <!--:key 唯一标识-->
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRole = false">取 消</el-button>
        <el-button type="primary" @click="postRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>

</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      options: [],
      pagenum: 1,
      pagesize: 4,
      pagesizes: [2, 4, 6, 8],
      total: 20,
      query: '',
      showadd: false,
      showEdit: false,
      showRole: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      roleForm: {
        id: '',
        username: '',
        rid: ''
      },
      formLabelWidth: '110px'
    }
  },
  methods: {
    async getAllData () {
      var res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log(res)
      var {data: {users, total}, meta: {msg, status}} = res.data
      if (status === 200) {
        this.tableData = users
        // 将总数据量赋值给total
        this.total = total
      }
    },
    // 页数变化
    sizeChange (val) {
      // console.log('sizeChange')
      // val 为改变后的大小
      // console.log(val)
      this.pagesize = val
      this.getAllData()
    },
    // 当前页变化
    currentChange (val) {
      // console.log('currentChange')
      // console.log(val)
      this.pagenum = val
      this.getAllData()
    },
    search () {
      this.getAllData()
      this.query = ''
    },
    // 清空表单
    clear () {
      for (var item in this.form) {
        this.form[item] = ''
      }
    },
    // 添加用户
    async add () {
      var res = await this.$http.post('users', this.form)
      // console.log(res)
      var {data, meta: {msg, status}} = res.data
      if (status === 201) {
        this.form = data
        this.$message({
          message: msg,
          type: 'success'
        })
        this.getAllData()
      } else {
        this.$message.error(msg)
      }
      this.showadd = false
      this.clear()
    },
    // 删除用户
    del (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var res = await this.$http.delete(`users/${id}`)
        var {data, meta: {msg, status}} = res.data
        this.$message({
          type: 'success',
          message: 'msg'
        })
        this.pagenum = 1
        this.getAllData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'msg'
        })
      })
    },
    // 编辑用户
    async edit (id) {
      this.showEdit = true
      var res = await this.$http.get(`users/${id}`)
      var {data, meta: {msg, status}} = res.data
      this.editForm = data
    },
    // 提交修改
    async postEdit (id) {
      var res = await this.$http.put(`users/${id}`, {
        mobile: this.editForm.mobile,
        email: this.editForm.email
      })
      var {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message({
          message: 'msg',
          type: 'success'
        })
        this.getAllData()
      } else {
        this.$message.error(msg)
      }
      this.showEdit = false
    },
    // 修改角色状态按钮
    async changeStatus (row) {
      var res = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      var {data, meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message({
          type: 'success',
          message: msg
        })
        this.getAllData()
      } else {
        this.$message.error(msg)
      }
    },
    // 获取所有角色
    async getAllRoles () {
      var res = await this.$http.get('roles')
      var {data, meta: {msg, status}} = res.data
      // console.log(data)
      if (status === 200) {
        this.options = data
      }
    },
    // 角色分配
    async setRole (row) {
      this.showRole = true
      /*this.showRole = true
      // 发送请求到服务器，得到所有角色数据
      this.getAllRoles()
      // console.log(row)
      this.roleForm = row
      console.log(this.roleForm)
      var res = await this.$http.get(`users/${row.id}`)
      // console.log(res)
      var {data: {rid}, meta: {msg, status}} = res.data
      // console.log(res.data.data)
      // 根据角色id发送请求
      var res1 = await this.$http.get(`roles/${res.data.data.rid}`)
      console.log(res1)
      var {data, meta: {msg, status}} = res1.data
      console.log(res1.data)
      if (res1.data.data === null) {
        res1.data.rid = -1
      } else {
        this.data = res1.data.data.roleName
      }*/
      // this.data = roleName
      // 发送请求到服务器，得到所有数据
      this.getAllRoles()
      this.roleForm.username = row.username
      this.roleForm.id = row.id
      // 得到当前用户的角色id
      var res = await this.$http.get(`users/${row.id}`)
      var {data, meta: {msg, status}} = res.data
      if (status === 200) {
        this.roleForm.rid = data.rid
      }
    },
    // 修改角色分配
    async postRole() {
      // 通过axios提交
      var res = await this.$http.put(`users/${this.roleForm.id}/role`, {
        rid: this.roleForm.rid
      })
      var {msg, status} = res.data.meta
      if (status === 200) {
        this.$message({
          type: 'success',
          message: msg
        })
      } else {
        this.$message.error(msg)
      }
      this.showRole = false
    }
  },
  created () {
    this.getAllData()
  }
}
</script>

<style scoped>
  .input-with-select {
    width: 300px;
    margin-top: 15px;
  }
</style>
