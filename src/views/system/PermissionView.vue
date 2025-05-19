<template>
  <div class="cb-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="table-box">
      <el-row class="add-row">
        <el-button icon="el-icon-plus" type="primary" @click="add()">新增</el-button>
      </el-row>
      <el-table border stripe :data="tableData">
        <el-table-column prop="alias" label="别名" align="center" />
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" @click="update(scope.row)">编辑</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-delete"
              icon-color="red"
              title="确定删除吗？" @confirm="deleteRow(scope.row)">
              <el-button icon="el-icon-delete" size="small" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[20, 50, 50]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <PermissionDialog :isVisible.sync="isVisible" :editId="editId" @updateList="getTableList"/>
  </div>
</template>
<script>
import { list, deleteOne } from '@/api/permission'
import PermissionDialog from './components/permission-dialog.vue'
export default {
  name: 'PermissionView',
  components: {
    PermissionDialog
  },
  data() {
    return {
      total: 10,
      isVisible: false,
      editId: null,
      tableData: [],
      queryInfo: {
        current: 1,
        size: 20
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
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
    async getTableList() {
      const res = await list(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    handleSizeChange(val) {
      this.queryInfo.size = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.queryInfo.current = val
      this.getTableList()
    }
  }
}
</script>

<style scoped lang="less">
.statistics-container {
  .opt-box {
    margin-bottom: 20px;
    :deep(.el-card__body) {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-btn {
        display: inline-block;
        margin-left: 25px;
      }
      .el-form-item {
        margin-bottom: 0;
        .el-form-item__label {
          font-size: 13px;
          width: 90px;
          white-space: nowrap;
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
