<template>
    <div class="crm-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>线下管理</el-breadcrumb-item>
        <el-breadcrumb-item>推送平台信息管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="table-box">
        <el-row class="add-row">
          <el-button icon="el-icon-plus" type="primary" @click="add()"
            >新增</el-button
          >
        </el-row>
        <el-table border stripe :data="tableData">
          <el-table-column prop="id" label="编号" align="center" />
          <el-table-column prop="platformName" label="平台名称" align="center" />
          <el-table-column prop="companyName" label="公司名称" align="center" />
          <el-table-column prop="fundsSource" label="资金来源" align="center" />
          <el-table-column prop="consumerHotline" label="客服电话" align="center" />
          <el-table-column label="申请条件" align="center">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.applyCondition" :key="index">{{item}}</p>
            </template>
          </el-table-column>
          <el-table-column label="所需资料" align="center">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.requiredMaterials" :key="index">{{item}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="ctime" label="创建时间" align="center" />
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                size="small"
                type="success"
                @click="update(scope.row)"
                >编辑</el-button
              >
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="deleteRow(scope.row)"
              >
                <el-button icon="el-icon-delete" type="danger" slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.current"
          :page-sizes="[20, 50, 100]"
          :page-size="queryInfo.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
      <PushPlatformInfoDialog
        :isVisible.sync="isVisible"
        :editId="editId"
        @update="getTableList()"
      />
    </div>
</template>
<script>
import PushPlatformInfoDialog from './components/push-platform-dialog.vue'

import { list, deleteOne } from '@/api/pushPlatform'
export default {
  name: 'PushPlatformView',
  components: {
    PushPlatformInfoDialog
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
    async getTableList() {
      const res = await list(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
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
.crm-container {
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
    .add-row {
      margin-bottom: 20px;
    }
  }

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
