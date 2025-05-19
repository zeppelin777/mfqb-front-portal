<template>
  <el-dialog title='推送产品统计' :visible='isVisible' width="60%" height="75%" @close="$emit('update:isVisible', false)">
    <el-table border stripe :data="tableData">
      <el-table-column prop="source" label="数据来源" align="center" />
      <el-table-column prop="platformName" label="平台名称" align="center" />
      <el-table-column prop="pushTotalNum" label="推送总数" align="center" />
      <el-table-column prop="successNum" label="成功数量" align="center" />
      <el-table-column prop="failureNum" label="失败数量" align="center" />
      <el-table-column prop="successRate" label="成功率" align="center">
        <template slot-scope="scope">
            <div>{{scope.row.successRate}}%</div>
          </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="总金额" align="center" />
      <!-- <el-table-column prop="total" label="总计" align="center" /> -->
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.current"
      :page-sizes="[20,50,100]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-dialog>
</template>

<script>
import { listByPush } from '@/api/channelStatistics'

export default {
  name: 'ChannelStatiscsByPushDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    platformCode: {
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
      total: 0,
      tableData: [],
      queryInfo: {
        current: 1,
        size: 20,
        platformCode: '',
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
      console.log(this.$props);
      this.queryInfo.platformCode = this.$props.platformCode
      this.queryInfo.startTime = this.startTime
      this.queryInfo.endTime = this.endTime
      const res = await listByPush(this.queryInfo)
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
    }
  }
}
</script>

<style scoped>

</style>
