<template>
    <div class="statistics-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计管理</el-breadcrumb-item>
        <el-breadcrumb-item>crm星级统计</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="opt-box">
        <el-form inline>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="date"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
              @change="confirmDate"
              clearable
            />
          </el-form-item>
          <el-form-item label="渠道名称：">
            <el-input v-model="queryInfo.channelName" placeholder="请输入渠道名称" clearable/>
          </el-form-item>
          <!-- <el-form-item label="用户星级：">
            <el-select
              v-model="queryInfo.dataStandard"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in starOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item class="item-btn">
            <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button >
            <el-button icon="el-icon-download" size="small" type="primary" @click="download()">下载</el-button >
          </el-form-item>
        </el-form>
      </el-card>
  
      <el-card class="table-box">
        <el-table border stripe :data="tableData">
          <el-table-column prop="channelName" label="渠道名称" align="center" />
          <el-table-column prop="totalPushNum" label="总推送数" align="center" />
          <el-table-column prop="intentionNum" label="有意向人数" align="center" />
          <el-table-column prop="addNum" label="添加人数" align="center" />
          <el-table-column prop="oneStarNum" label="一星用户" align="center" />
          <el-table-column prop="twoStarNum" label="二星用户" align="center" />
          <el-table-column prop="threeStarNum" label="三星用户" align="center" />
          <el-table-column prop="fourStarNum" label="四星用户" align="center" />
          <el-table-column prop="fiveStarNum" label="五星用户" align="center" />
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.current"
          :page-sizes="[10,20, 50, 50]"
          :page-size="queryInfo.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <PushStatiscsBychannelDialog :isVisible.sync="isShowPushStatiscsVisible"
                                   :channelCode="pushStatiscsQuery.channelCode"
                                   :startTime="pushStatiscsQuery.startTime"
                                   :endTime="pushStatiscsQuery.endTime"
      />
    </div>
  </template>
  
  <script>
  import { selectStarStatistics } from '@/api/channelStatistics'
  import PushStatiscsBychannelDialog from './dialog/push-statiscs-by-channel'
import { removeNoUseKeys } from '@/utils';
  export default {
    name: 'UserView',
    components: {
      PushStatiscsBychannelDialog
    },
    data() {
      return {
        currentPage: 1,
        total: 10,
        isShowPushStatiscsVisible: false,
        tableData: [],
        date: [],
        starOptions: [
          {
            name: '一星',
            value: 1
          },
          {
            name: '二星',
            value: 2
          },
          {
            name: '三星',
            value: 3
          },
          {
            name: '四星',
            value: 4
          },
          {
            name: '五星',
            value: 5
          }
        ],
        queryInfo: {
          current: 1,
          size: 20,
          channelName: '',
          dataStandard: '',
          startTime: '',
          endTime: ''
        },
        pushStatiscsQuery: {
          channelCode: '',
          startTime: '',
          endTime: ''
        }
      }
    },
    mounted() {
      this.queryInfo.startTime = this.$moment(new Date())
      .subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
      this.queryInfo.endTime = this.$moment(new Date()).add(1,'day')
        .format('YYYY-MM-DD 00:00:00')
      this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
      this.getTableList()
    },
    methods: {
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
      async getTableList() {
        const res = await selectStarStatistics(removeNoUseKeys(this.queryInfo))
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
      },
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
  