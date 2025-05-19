<template>
  <div class="manager-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="用户名：">
          <el-input
            v-model="queryInfo.userName"
            clearable
            placeholder="请输入要查询的用户名"
          />
        </el-form-item>
        <el-button
          icon="el-icon-search"
          size="small"
          type="primary"
          @click="getTableList()"
        >
          搜索
        </el-button>
      </el-form>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="add">
        新增
      </el-button>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="userName" label="用户名" align="center" />
        <el-table-column prop="roleName" label="角色" align="center" />
        <el-table-column prop="deptName" label="部门" align="center" />
        <el-table-column prop="locked" label="禁用登录" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.locked"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeLocked(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="320">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              size="small"
              type="success"
              @click="changePwd(scope.row)"
            >
              修改密码
            </el-button>
            <el-button
              icon="el-icon-edit"
              size="small"
              type="success"
              @click="update(scope.row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="取消"
              cancel-button-text="确定"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="deleteRow(scope.row)"
              style="margin-left: 10px;"
            >
              <el-button icon="el-icon-delete" type="danger" slot="reference">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.current"
        :page-sizes="[20, 50, 100]"
        :page-size="this.queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog :visible="isUpdatePwd" @close="onClose()" title="更新密码">
      <el-form :rules="rules" :model="form" ref="form">
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form inline align="center">
          <el-button
            icon="el-icon-edit"
            size="small"
            type="success"
            @click="onClose()"
          >
            取消
          </el-button>
          <el-button
            icon="el-icon-edit"
            size="small"
            type="success"
            @click="updatePassword()"
          >
            确认
          </el-button>
        </el-form>
      </el-form>
    </el-dialog>
    <ManageDialog
      :isVisible.sync="isVisible"
      :editId="editId"
      @updateList="getTableList"
    />
  </div>
</template>
<script>
import { list, locked, deleteOne, updatePassword } from '@/api/adminuser'
import ManageDialog from './components/manage-dialog.vue'
export default {
  name: 'ManagerView',
  components: {
    ManageDialog
  },
  data() {
    return {
      total: 10,
      tableData: [],
      isVisible: false,
      isUpdatePwd: false,
      editId: null,
      queryInfo: {
        current: 1,
        size: 20,
        userName: ''
      },
      form: {
        id: null,
        password: ''
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    async getTableList() {
      const res = await list(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    async changeLocked(row) {
      const res = await locked({ id: row.id, state: row.locked })
      if (res.code === 200) {
        this.getTableList()
      }
    },

    onClose() {
      this.isUpdatePwd = false
      this.restForm()
    },
    restForm() {
      this.form = {
        id: null,
        password: ''
      }
    },

    handleSizeChange(val) {
      this.queryInfo.size = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.queryInfo.current = val
      this.getTableList()
    },
    add() {
      this.isVisible = true
      this.editId = null
    },
    update(row) {
      this.isVisible = true
      this.editId = row.id
    },
    async deleteRow(row) {
      const res = await deleteOne({ id: row.id })
      if (res.code === 200) {
        this.getTableList()
      } else {
        this.$message.error(res.message)
      }
    },
    changePwd(row) {
      this.isUpdatePwd = true
      this.form.id = row.id
    },
    async updatePassword() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await updatePassword(this.form)
          if (res.code === 200) {
            this.onClose()
            this.getTableList()
          } else {
            this.$message.error(res.$message)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.manager-container {
  .opt-box {
    margin-bottom: 20px;

    :deep(.el-card__body) {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;

        .el-form-item__label {
          font-size: 13px;
        }
      }
    }
  }

  :deep(.table-box) {
    th > div {
      font-size: 13px;
    }
  }

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
