<template>
    <div class="statistics-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计管理</el-breadcrumb-item>
        <el-breadcrumb-item>产品星级统计</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="opt-box">
        <el-form inline>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="date"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              range-separator="至"
              @change="confirmDate"
              value-format="yyyy-MM-dd"
              clearable
            />
          </el-form-item>
          <el-form-item label="产品名称：">
            <el-input v-model="queryInfo.platformName" placeholder="请输入产品名称" clearable/>
          </el-form-item>
          <!-- <el-form-item label="查询类型：">
            <el-select
              v-model="queryInfo.queryType"
              placeholder="请选择">
              <el-option
                v-for="item in queryTypeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item class="item-btn">
            <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
      <el-card class="table-box">
        <el-table border stripe :data="tableData">
          <el-table-column prop="platformName" label="产品名称" align="center" />
          <el-table-column prop="platformCode" label="产品编码" align="center" />
          <el-table-column prop="type" label="产品类型" align="center">
            <template slot-scope="{ row }">
              <template v-for="item in optionTypes">
                <div v-if="row.type == item.id">{{ item.label }}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="优质率" align="center">
            <template slot-scope="{ row }">
              {{ sumPercent(row.threePercent + row.fourPercent + row.fivePercent) }}%
            </template>
          </el-table-column>
          <el-table-column label="零星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.zeroStarNum }}/{{ sumPercent(scope.row.zeroPercent) }}%</span>
              <el-button v-if="scope.row.zeroStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 0)">查看渠道</el-button>
            </template>
          </el-table-column>
          <el-table-column label="一星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.oneStarNum }}/{{ sumPercent(scope.row.onePercent) }}%</span>
              <el-button v-if="scope.row.oneStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 1)">查看渠道</el-button>
            </template>
          </el-table-column>
          <el-table-column label="二星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.twoStarNum }}/{{ sumPercent(scope.row.twoPercent) }}%</span>
              <el-button v-if="scope.row.twoStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 2)">查看渠道</el-button>
            </template>
          </el-table-column>
          <el-table-column label="三星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.threeStarNum }}/{{ sumPercent(scope.row.threePercent) }}%</span>
              <el-button v-if="scope.row.threeStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 3)">查看渠道</el-button>
            </template>
          </el-table-column>
          <el-table-column label="四星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.fourStarNum }}/{{ sumPercent(scope.row.fourPercent) }}%</span>
              <el-button v-if="scope.row.fourStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 4)">查看渠道</el-button>
            </template>
          </el-table-column>
          <el-table-column label="五星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.fiveStarNum }}/{{ sumPercent(scope.row.fivePercent) }}%</span>
              <el-button v-if="scope.row.fiveStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 5)">查看渠道</el-button>
            </template>
          </el-table-column>
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

      <el-dialog :visible="channelVisible" :title="title" @close="colseVisible()">
        <el-table :data="channelList":key="new Date().getTime()">
            <el-table-column prop="channelName" label="渠道名称" align="center" />
            <el-table-column prop="num" label="数量" align="center" />
            <el-table-column align="center">
              <template slot="header">
                <span>渠道{{ star }}星占比</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row.channelStarPercent }}%
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span>{{ star }}星百分比</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row.platStarPercent }}%
              </template>
            </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryChannel.current"
          :page-sizes="[10,20, 50, 50]"
          :page-size="queryChannel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="channelTotal">
        </el-pagination>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { getPlatStarList, getChannelStarDetail } from '@/api/channelStatistics'
  export default {
    name: 'UserView',
    data() {
      return {
        total: 0,
        isShowPushStatiscsVisible: false,
        tableData: [],
        date: [],
        queryTypeOptions: [
          {
            name: 'h5',
            value: 'h5'
          },
          {
            name: 'api',
            value: 'api'
          }
        ],
        optionTypes: [{
          id: 1,
          label: '半流程撞库授权'
        }, {
          id: 2,
          label: '半流程进件授权'
        }, {
          id: 3,
          label: '全流程'
        }, {
          id: 4,
          label: 'CRM'
        }],
        queryInfo: {
          current: 1,
          size: 20,
          platformName: '',
          startTime: '',
          endTime: ''
        },
        title: '',
        channelVisible: false,
        channelList: [],
        queryChannel: {
          current: 1,
          size: 20
        },
        channelTotal: 0,
        star: ''
      }
    },
    mounted() {
      this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD 00:00:00')
      this.queryInfo.endTime = this.$moment(new Date())
        .add(1, 'days')
        .format('YYYY-MM-DD HH:mm:ss')
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
        const res = await getPlatStarList(this.queryInfo)
        if (res.code === 200) {
          this.total = res.data.total
          this.tableData = res.data.records
        }
      },

      sumPercent(num) {
        const count = num * 100
        return Number.isInteger(count)?count: count.toFixed(0)
      },

      async getPlatStarDetail(row, star) {
        switch (star) {
          case 0:
            this.title = row.platformName + '-零星用户渠道详情'
            this.star = '零'
            break;
          case 1:
            this.title = row.platformName + '-一星用户渠道详情'
            this.star = '一'
            break;
          case 2:
            this.title = row.platformName + '-二星用户渠道详情'
            this.star = '二'
            break;
          case 3:
            this.title = row.platformName + '-三星用户渠道详情'
            this.star = '三'
            break;
          case 4:
            this.title = row.platformName + '-四星用户渠道详情'
            this.star = '四'
            break;
          case 5:
            this.title = row.platformName + '-五星用户渠道详情'
            this.star = '五'
            break;
        }
        const params = {
          ...this.queryChannel,
          platformCode: row.platformCode,
          startTime: this.queryInfo.startTime,
          endTime: this.queryInfo.endTime,
          star,
          queryType: this.queryInfo.queryType
        }
        const res = await getChannelStarDetail(params)
        if (res.code === 200) {
          console.log(res)
          this.channelList = res.data.records
          this.channelTotal = res.data.total
          this.channelVisible = true
        }
      },

      colseVisible() {
        this.queryChannel = {
          current: 1,
          size: 20
        }
        this.channelVisible = false
      },
      
      handleSizeChange(val) {
        this.queryInfo.size = val
        this.getTableList()
      },
      handleCurrentChange(val) {
        this.queryInfo.current = val
        this.getTableList()
      },

      handleSizeChange1(val) {
        this.queryChannel.size = val
        // this.getTableList()
      },
      handleCurrentChange1(val) {
        this.queryChannel.current = val
        // this.getTableList()
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
  