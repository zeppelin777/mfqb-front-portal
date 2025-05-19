<template>
  <div class="push-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      <el-breadcrumb-item>API-回调日志</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围">
          <el-date-picker v-model="date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
            format="yyyy-MM-dd" range-separator="至" @change="confirmDate" value-format="yyyy-MM-dd" clearable />
        </el-form-item>
        <el-form-item label="渠道编号：">
          <el-input v-model="queryInfo.channelCode" placeholder="请输入渠道编号" clearable/>
        </el-form-item>
        <el-form-item label="回调平台：">
          <el-input v-model="queryInfo.platformName" placeholder="请输入回调平台名称" clearable />
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
        <el-card class="table-box">
      <el-table border stripe :data="tableData">
      <el-table-column prop="userId" label="用户编号" align="center" />
      <el-table-column prop="phoneNo" label="手机号" align="center" />
        <el-table-column prop="channelCode" label="渠道编号" align="center" />
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="platformCode" label="平台编号" align="center" />
        <el-table-column prop="platformName" label="平台名称" align="center" />
        <el-table-column prop="ctime" label="访问时间" align="center" />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[20,50,100]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { callbackLogList } from '@/api/log'
export default {
  name: 'PushStatistics',
  data() {
    return {
      total: 10,
      isVisible: false,
      tableData: [],
      date: [],
      queryInfo: {
        current: 1,
        size: 20,
        channelCode: '',
        platformName: ''
      }
    }
  },
  mounted() {
    this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD')
    this.queryInfo.endTime = this.$moment(new Date())
      .add(1, 'days')
      .format('YYYY-MM-DD')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },

  methods: {
    async getTableList() {
      const res = await callbackLogList(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    confirmDate(value) {
      if (value) {
        this.queryInfo.startTime = value[0]
        this.queryInfo.endTime = value[1]
        this.getTableList()
      } else {
        this.queryInfo.startTime = ''
        this.queryInfo.endTime = ''
        this.getTableList()
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
.push-container {
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
