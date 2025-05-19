<template>
    <div class="push-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计管理</el-breadcrumb-item>
        <el-breadcrumb-item>产品撞库成功率</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="opt-box">
        <el-form inline>
          <el-form-item label="时间范围">
            <el-date-picker v-model="date" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
               range-separator="至" @change="confirmDate" clearable />
          </el-form-item>
          <el-form-item label="渠道名称：">
            <el-input v-model="queryInfo.source" placeholder="请输入平台名称" clearable/>
          </el-form-item>
          <el-form-item class="item-btn">
            <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
      <el-card class="table-box">
        <el-table border stripe :data="tableData">
          <el-table-column prop="platformName" label="平台名称" align="center" />
          <el-table-column prop="platformCode" label="平台代码" align="center" />
          <el-table-column prop="checkPercent" label="撞库成功率" align="center" />
          <el-table-column prop="checkToltalNum" label="撞库总数" align="center" />
          <el-table-column prop="checkSuccessNum" label="撞库成功数" align="center" />
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script>
  import { fetchChannelCheckPercent } from '@/api/pushStatistics'
  import ChannelStatiscsByPushDialog from './dialog/channel-statiscs-by-push'
  export default {
    name: 'PushStatistics',
    components: {
      ChannelStatiscsByPushDialog
    },
    data() {
      return {
        total: 10,
        isChannelStatiscsVisible: false,
        tableData: [],
        date: [],
        queryInfo: {
          source: '',
        },
        platformCode: null,
        channelStatiscsQuery: {
          startTime: '',
          endTime: ''
        }
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
        const res = await fetchChannelCheckPercent(this.queryInfo)
        if (res.code === 200) {
          this.tableData = res.data || []
        }
      },
      confirmDate(value) {
        if (value) {
          this.queryInfo.startTime = this.$moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
          this.queryInfo.endTime = this.$moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
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
      },
      showChannelStatiscs(row) {
        console.log(row);
        this.platformCode = row.platformCode
        this.channelStatiscsQuery.startTime = this.queryInfo.startTime
        this.channelStatiscsQuery.endTime = this.queryInfo.endTime
        this.isChannelStatiscsVisible = true
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
  