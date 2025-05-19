<template>
  <div class="info-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form ref="form" :model="form" :inline="true">
        <el-form-item label="时间：">
          <el-date-picker
            v-model="form.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchForm('form')">查询</el-button>
        </el-form-item>
      </el-form>

      <div id="box1" style="width: 100%"></div>
      <div id="box2" style="width: 100%"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {
  barChart,
  pieChart,
  fetchApiTotal,
  fetchH5ChannelTotal
} from '@/api/home'
export default {
  name: 'InfoView',
  data() {
    return {
      form: {
        time: [
          this.$moment().format('YYYY-MM-DD 00:00:00'),
          this.$moment().add(1, 'day').format('YYYY-MM-DD 00:00:00')
        ]
      }
    }
  },
  mounted() {
    this.loadPie()
    this.loadBar()
  },
  methods: {

    async loadPie() {
      const res = await pieChart()
      const toDayChart = echarts.init(document.getElementById('box1'))
      // 绘制图表
      toDayChart.setOption({
        title: {
          text: '今日数据统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            data: res.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    async loadBar() {
      const res = await barChart()
      const toDayChart = echarts.init(document.getElementById('box2'))
      const data = res.data
      toDayChart.setOption({
        title: {
          text: '今日渠道数据',
          y: 'bottom',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        xAxis: {
          type: 'category',
          data: data.channelNames
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '渠道pv',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: data.channelPvs
          },
          {
            name: '渠道uv',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: data.channelUvs
          },
          {
            name: '进件数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: data.loanNums
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="less">
.info-container {
  #box1 {
    width: 1000px;
    height: 500px;
  }
  #box2 {
    width: 1000px;
    height: 500px;
  }
}
</style>
