<template>
  <div class="statistics-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form ref="form" :model="form" :inline="true">
        <el-form-item label="时间：">
          <el-date-picker
            v-model="form.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchForm('form')">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box" header="API渠道">
      <el-table border stripe :data="tableData1">
        <el-table-column prop="pushTotalNum" label="推送总数" align="center" />
        <el-table-column prop="successNum" label="成功数量" align="center" />
        <el-table-column prop="successRate" label="成功率" align="center" />
        <el-table-column prop="failureNum" label="失败数量" align="center" />
        <el-table-column
          prop="totalChannelPrice"
          label="渠道总金额"
          align="center"
        />
        <el-table-column
          prop="totalProductPrice"
          label="产品总金额"
          align="center"
        />
      </el-table>
    </el-card>

    <el-card class="table-box" header="H5渠道" style="margin-top: 20px">
      <el-table border stripe :data="tableData2">
        <el-table-column
          prop="channelPv"
          label="pv"
          align="center"
        />
        <el-table-column
          prop="channelUv"
          label="uv"
          align="center"
        />
        <el-table-column prop="registerNum" label="注册登录" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.registerNum }}</div>
            <div style="margin-left: 10px">
              ({{ ((scope.row.registerNum / scope.row.channelUv) * 100).toFixed(2) }}%)
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="collectNum"
          label="留资/成本单价"
          align="center"
        >
          <template slot-scope="scope">
            <span>
              <span>{{ scope.row.collectNum }}</span>
              <span> ({{ ((scope.row.collectNum / scope.row.registerNum) * 100).toFixed(2) }}%)</span>
              /
            </span>
            <span>{{
              scope.row.totalConst && scope.row.collectNum
                ? String(
                    (scope.row.totalConst / scope.row.collectNum).toFixed(2)
                  )
                : 0
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalApiNum"
          label="推送总数/推送成功数/推送单价"
          align="center"
        >
          <template slot-scope="scope">
            <span>
              <span>{{ scope.row.totalApiNum }}</span>
              <span>
                ({{
                  scope.row.totalApiNum && scope.row.collectNum
                    ? String(
                        (
                          (scope.row.totalApiNum / scope.row.collectNum) *
                          100
                        ).toFixed(2)
                      )
                    : 0
                }}%)</span
              >
              /
            </span>
            <span>
              <span>{{ scope.row.apiPushNum }}</span>
              <span>
                ({{
                  scope.row.totalApiNum && scope.row.apiPushNum
                    ? String(
                        (
                          (scope.row.apiPushNum / scope.row.totalApiNum) *
                          100
                        ).toFixed(2)
                      )
                    : 0
                }}%)</span
              >
              /
            </span>
            <span>
              <span>{{
                scope.row.apiPushIncome && scope.row.apiPushNum
                  ? String(
                      (scope.row.apiPushIncome / scope.row.apiPushNum).toFixed(
                        2
                      )
                    )
                  : 0
              }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="apiPushIncome" label="推送营收" align="center" />
        <el-table-column prop="productUv" label="产品uv" align="center">
          <template slot-scope="scope">
            <span>
              <span>{{ scope.row.productUv }}</span>
              <span>
                ({{
                  scope.row.productUv && scope.row.collectNum
                    ? String(
                        (
                          (scope.row.productUv / scope.row.collectNum) *
                          100
                        ).toFixed(2)
                      )
                    : 0
                }}%)</span
              >
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="productIncome" label="产品营收" align="center" />
        <el-table-column prop="totalConst" label="总成本" align="center" />
        <el-table-column prop="totalConst" label="总ROI" align="center">
          <template slot-scope="scope">
            <span>{{ ((scope.row.apiPushIncome + scope.row.productIncome) / scope.row.totalConst).toFixed(2) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card>
      <el-form ref="form" :model="form" :inline="true">
        <el-form-item label="时间：">
          <el-date-picker
            v-model="echartTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate1"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchEcharts()">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="display: flex;">
        <div class="echart" ref="echartData"></div>
        <div class="echart" ref="echartData1"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { fetchApiTotal, fetchH5ChannelTotal, apiTotalAnalysis, h5ChannelAnalysis } from '@/api/home'
import * as echarts from 'echarts'
export default {
  name: 'UserView',
  data() {
    return {
      form: {
        time: [
          this.$moment().format('YYYY-MM-DD 00:00:00'),
          this.$moment().add(1, 'day').format('YYYY-MM-DD 00:00:00')
        ]
      },
      tableData1: [],
      tableData2: [],
      echartTime: [
        this.$moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'),
        this.$moment().format('YYYY-MM-DD 00:00:00')
      ],
      dataList: [],
      dataList1: []
    }
  },
  mounted() {
    this.searchForm()
    this.searchEcharts()
  },
  methods: {
    initData() {
      let myChart = echarts.init(this.$refs.echartData)
      var option = {
        title: {
          text: 'API渠道'
        },
        color: ['#5470c6', '#91cc75', '#fac858'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['渠道总金额', '产品总金额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dataList.map(item => item.countDate)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '渠道总金额',
            type: 'line',
            data: this.dataList.map(item => item.totalChannelPrice)
          },
          {
            name: '产品总金额',
            type: 'line',
            data: this.dataList.map(item => item.totalProductPrice)
          }
        ]
      };
      myChart.setOption(option);
    },
    initData1() {
      let myChart1 = echarts.init(this.$refs.echartData1)
      var option = {
        title: {
          text: 'H5渠道'
        },
        color: ['#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['总营收', '总成本', '总ROI']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dataList1.map(item => item.countTime)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '总成本',
            type: 'line',
            data: this.dataList1.map(item => item.totalConst)
          },
          {
            name: '总营收',
            type: 'line',
            data: this.dataList1.map(item => item.totalIncome)
          },
          {
            name: '总ROI',
            type: 'line',
            data: this.dataList1.map(item => item.roi)
          }
        ]
      };
      myChart1.setOption(option);
    },
    changeDate(e){
        console.log(e);
        this.form.time = [this.$moment(e[0]).format('YYYY-MM-DD 00:00:00'),this.$moment(e[1]).format('YYYY-MM-DD 00:00:00')]
    },
    changeDate1(e){
        console.log(e);
        this.echartTime = [this.$moment(e[0]).format('YYYY-MM-DD 00:00:00'),this.$moment(e[1]).format('YYYY-MM-DD 00:00:00')]
    },
    searchForm() {
      let data = {
        startTime: this.form.time[0],
        endTime: this.form.time[1]
      }

      this.getApiTotal(data)
      this.getH5ChannelTotal(data)
    },
    searchEcharts() {
      let data = {
        startTime: this.echartTime[0],
        endTime: this.echartTime[1]
      }
      this.getApiTotalAnalysis(data)
      this.getH5ChannelAnalysis(data)
    },
    getApiTotal(data) {
      fetchApiTotal(data).then((res) => {
        if (res) {
          console.log(res)
          this.tableData1 = res.data.records
        }
      })
    },
    getH5ChannelTotal(data) {
      fetchH5ChannelTotal(data).then((res) => {
        if (res) {
          console.log(res)
          this.tableData2 = res.data.records
        }
      })
    },
    getApiTotalAnalysis(data) {
      apiTotalAnalysis(data).then((res) => {
        if (res) {
          console.log(res)
          this.dataList = res.data
          this.initData()
        }
      })
    },
    getH5ChannelAnalysis(data) {
      h5ChannelAnalysis(data).then((res) => {
        if (res) {
          console.log(res)
          this.dataList1 = res.data
          this.initData1()
        }
      })
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
    margin-bottom: 20px;
    th > div {
      font-size: 13px;
    }
  }

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}

.echart {
    width: calc(100% - 40px);
    height: 600px;
    margin: 20px;
}
</style>
