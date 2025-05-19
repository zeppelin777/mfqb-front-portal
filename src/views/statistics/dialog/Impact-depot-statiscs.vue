<template>
  <el-dialog title='撞库详情' :visible='isVisible' width="60%" height="75%" @close="$emit('update:isVisible', false)">
    <el-table border stripe :data="tableData">
      <el-table-column prop="channelName" label="渠道名称" align="center" />
      <el-table-column prop="channelCode" label="渠道码" align="center" />
      <el-table-column prop="platformName" label="产品名称" align="center" />
      <el-table-column prop="platformCode" label="产品码" align="center" />
      <el-table-column prop="checkToltalNum" label="现阶段撞库总数" align="center" />
      <el-table-column prop="checkSuccessNum" label="现阶段撞库成功数" align="center" />
      <el-table-column prop="sqcheckToltalNum" label="环比撞库总数" align="center" />
      <el-table-column prop="sqcheckSuccessNum" label="环比撞库成功数" align="center" />
    </el-table>
  </el-dialog>
</template>

<script>

import { getCheckCount } from '@/api/pushStatistics'

export default {
  name: 'ImpactDepotStatiscsDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    channelName: {
      type: String,
      default: ''
    },
    platformName: {
      type: String,
      default: ''
    },
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      queryInfo: {
        channelName: '',
        platformName: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  watch: {
    isVisible: async function (newVal, oldVal) {
      if (this.isVisible) {
        this.getTableList()
      }
    }
  },
  methods: {
    async getTableList() {
      // console.log(this.channelName);
      this.queryInfo.channelName = this.channelName
      this.queryInfo.platformName = this.platformName
      this.queryInfo.startTime = this.startTime
      this.queryInfo.endTime = this.endTime
      const res = await getCheckCount(this.queryInfo)
      if (res.code === 200) {
        // this.total = res.data.total
        this.tableData = res.data
      }
    }
  }
}
</script>

<style scoped>

</style>
