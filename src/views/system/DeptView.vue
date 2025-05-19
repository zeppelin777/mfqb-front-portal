<template>
  <div class="cb-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="table-box">
      <el-row class="add-row">
        <el-button icon="el-icon-plus" type="primary" @click="add()"
          >新增</el-button
        >
      </el-row>
      <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id"
        border default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="name" label="部门名称" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              @click="update(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-delete"
              icon-color="red"
              title="确定删除吗？"
              @confirm="deleteRow(scope.row)"
            >
              <el-button
                icon="el-icon-delete"
                size="small"
                type="danger"
                slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <DeptDiag
      :isVisible.sync="isVisible"
      :editId="editId"
      @updateList="getTableList"
    />
  </div>
</template>
<script>
import { list, deleteOne } from '@/api/dept'
import DeptDiag from './components/dept-dialog.vue'
export default {
  name: 'PermissionView',
  components: {
    DeptDiag
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
        this.tableData = res.data
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
