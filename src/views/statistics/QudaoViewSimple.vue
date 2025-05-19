<template>
    <div class="push-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计管理</el-breadcrumb-item>
        <el-breadcrumb-item>API-推送统计</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="opt-box">
        <el-form inline>
          <el-form-item label="时间范围">
            <el-date-picker v-model="date" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" @change="confirmDate" clearable />
          </el-form-item>
          <el-form-item label="渠道名称：">
            <el-input v-model="queryInfo.channelName" placeholder="请输入渠道名称" clearable/>
          </el-form-item>
          <el-form-item class="item-btn">
            <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
            <el-button icon="el-icon-download" size="small" type="primary" @click="download()">下载</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
      <el-card class="table-box">
        <el-table border stripe :data="tableData">
          <!-- <el-table-column prop="ruleId" label="规则编号" align="center" />
          <el-table-column prop="ruleName" label="规则名称" align="center" />
          <el-table-column prop="platformName" label="所属平台" align="center" />
          <el-table-column prop="totalApiNum" label="推送总量" align="center" />
          <el-table-column prop="successNum" label="成功数量" align="center" />
          <el-table-column prop="failureNum" label="失败数量" align="center" />
          <el-table-column prop="callbackNum" label="回调数" align="center" />
          <el-table-column label="操作" align="center" width="190px">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" type="primary" @click="showChannelStatiscs(scope.row)">渠道统计</el-button>
            </template>
          </el-table-column> -->
          <el-table-column prop="channelName" label="渠道名称" align="center" />
          <el-table-column prop="pushTotalNum" label="推送总数" align="center" />
          <el-table-column prop="successNum" label="成功数量" align="center" />
          <el-table-column prop="failureNum" label="失败数量" align="center" />
          <el-table-column prop="successRate" label="成功率" align="center" >
            <template slot-scope="{row}">
              <div>{{ row.successRate }}%</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="totalProductPrice" label="产品总金额" align="center">
            <template slot-scope="{row}">
              <div>{{ row.totalProductPrice }}</div>
            </template>
          </el-table-column> -->
          <el-table-column prop="totalChannelPrice" label="渠道总金额" align="center" >
            <template slot-scope="{row}">
              <div>{{ row.totalChannelPrice }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center" width="190px">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" type="primary" @click="showQudaoStatiscs(scope.row)">查看详情</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.current"
          :page-sizes="[10,20,50,100]"
          :page-size="queryInfo.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
      <PushStatiscsByQudaoDialog :isVisible.sync="isQudaoStatiscsVisible"
                                   :source="qudaoName"
                                   :startTime="channelStatiscsQuery.startTime"
                                   :endTime="channelStatiscsQuery.endTime"/>
    </div>
  </template>
  
  <script>
  import { list,apiDownload } from '@/api/qudao'
  import PushStatiscsByQudaoDialog from './dialog/push-statiscs-by-qudao'
  export default {
    name: 'QudaoStatistics',
    components: {
      PushStatiscsByQudaoDialog
    },
    data() {
      return {
        total: 10,
        isQudaoStatiscsVisible: false,
        tableData: [],
        date: [],
        queryInfo: {
          current: 1,
          size: 20,
          platformName: '',
          ruleName: ''
        },
        qudaoName: null,
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
        const res = await list(this.queryInfo)
        if (res.code === 200) {
          this.total = res.data.total
          this.tableData = res.data.records
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
      async download() {
        await apiDownload(this.queryInfo)
      },
      handleSizeChange(val) {
        this.queryInfo.size = val
        this.getTableList()
      },
      handleCurrentChange(val) {
        this.queryInfo.current = val
        this.getTableList()
      },
      showQudaoStatiscs(row) {
        console.log(row);
        this.qudaoName = row.channelName
        this.channelStatiscsQuery.startTime = this.queryInfo.startTime
        this.channelStatiscsQuery.endTime = this.queryInfo.endTime
        this.isQudaoStatiscsVisible = true
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
  