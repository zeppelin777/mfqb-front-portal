<template>
    <div class="statistics-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计管理</el-breadcrumb-item>
        <el-breadcrumb-item>渠道撞库统计</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="opt-box">
        <el-form inline>
          <el-form-item label="日期">
            <el-date-picker
              v-model="queryInfo.checkDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              clearable
            />
          </el-form-item>
          <el-form-item label="渠道名称：">
            <el-input v-model="queryInfo.channelName" placeholder="请输入渠道名称" clearable/>
          </el-form-item>
          <el-form-item label="渠道码：">
            <el-input v-model="queryInfo.channelCode" placeholder="请输入渠道码" clearable/>
          </el-form-item>
          <el-form-item label="撞库数：">
            <el-input v-model="queryInfo.checkCount" placeholder="请输入撞库数" clearable/>
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
          <el-table-column prop="checkCount" label="撞库数" align="center" />
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script>
  import { getChannelCheckCount } from '@/api/channelCollStatistics'
import { removeNoUseKeys } from '@/utils';
  export default {
    name: 'CollisionView',
    data() {
      return {
        tableData: [],
        queryInfo: {
          channelName: '',
          channelCode: '',
          checkCount: '',
          checkDate: ''
        },
      }
    },
    mounted() {
      this.queryInfo.checkDate = this.$moment(new Date()).format('YYYY-MM-DD')
      this.getTableList()
    },
    methods: {
      async getTableList() {
        const res = await getChannelCheckCount(removeNoUseKeys(this.queryInfo))
        if (res.code === 200) {
          this.tableData = res.data
        }
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
  