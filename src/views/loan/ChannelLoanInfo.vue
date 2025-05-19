<template>
  <div class="push-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>API放款</el-breadcrumb-item>
      <el-breadcrumb-item>放款渠道统计</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围：">
          <el-date-picker v-model="date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
            format="yyyy-MM-dd" range-separator="至" @change="confirmDate" value-format="yyyy-MM-dd" clearable />
        </el-form-item>
        <el-form-item label="渠道名称：">
          <el-input
            v-model="queryInfo.source"
            placeholder="请输入渠道名称"
            clearable
          />
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="channelName" label="渠道名称" align="center" /> 
        <el-table-column prop="channelCode" label="渠道码" align="center" />
        <el-table-column prop="strikeSuccessNum" label="撞库成功数量" align="center" />
        <el-table-column prop="creditNum" label="授信数" align="center" />
        <el-table-column prop="creditSuccessNum" label="授信成功数量" align="center" />
        <el-table-column prop="loanNum" label="放款数量" align="center" />
        <el-table-column prop="downLoadNum" label="下载数量" align="center" />
        <el-table-column prop="loanAmt" label="放款金额" align="center" />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[10, 20, 50, 50]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getChannelLoanInfo } from '@/api/apiLoanStatistics'
export default {
  name: 'ChannelLoanInfo',
  data() {
    return {
      tableData: [],
      date: [],
      queryInfo: {
        current: 1,
        size: 20,
        startTime: '',
        endTime: '',
        source: ''
      },
      total: 1
    }
  },
  mounted() {
    this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD 00:00:00')
    this.queryInfo.endTime = this.$moment(new Date())
      .add(1, 'days')
      .format('YYYY-MM-DD 00:00:00')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },

  methods: {
    async getTableList() {
      const res = await getChannelLoanInfo(this.queryInfo)
      if (res.code == 200) {
          this.tableData = res.data.records
          this.total = res.data.total
      }
    },
    confirmDate(value) {
      if (value) {
        this.queryInfo.startTime = value[0]
        this.queryInfo.endTime = value[1]
        this.queryInfo.startTime = this.$moment(value[0]).format('YYYY-MM-DD 00:00:00')
        this.queryInfo.endTime = this.$moment(value[1]).format('YYYY-MM-DD 00:00:00')
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
