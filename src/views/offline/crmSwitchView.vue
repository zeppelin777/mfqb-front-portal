<template>
  <div class="crm-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>线下管理</el-breadcrumb-item>
      <el-breadcrumb-item>CRM渠道开关</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="渠道名称：">
          <el-input v-model="queryInfo.channelName" placeholder="请输入渠道名称" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getTableList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="switchFlag" label="开关" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.switchFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateSwitchById(scope.row)"
            />
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
  </div>
</template>

<script>

import {
  switchList,
  updateSwitchById
} from '@/api/crmSwitch'
export default {
  name: 'CrmSwitchView',
  data() {
    return {
      total: 0,
      tableData: [],
      queryInfo: {
        current: 1,
        size: 20,
        channelName: ''
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    async getTableList() {
      const res = await switchList(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    async updateSwitchById(row) {
      const res = await updateSwitchById({ id: row.id, switchFlag: row.switchFlag })
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
