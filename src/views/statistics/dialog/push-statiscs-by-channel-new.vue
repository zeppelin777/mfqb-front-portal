<template>
    <el-dialog title='推送产品统计' :visible='isVisible' width="60%" height="75%" @close="$emit('update:isVisible', false)">
      <el-table border stripe :data="tableData">
        <el-table-column prop="platformName" label="机构名称" align="center" />
        <el-table-column prop="pushTotal" label="推送总数/成功数/平均单价" align="center">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.pushTotal }}</span> /
              <span>{{ scope.row.successNum }}</span> /
              <span>{{ scope.row.avgPrice }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="营收" align="center" />
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
  
  import { pushStatisticsByChannel } from '@/api/pushStatistics'
  
  export default {
    name: 'PushStatiscsBychannelDialog',
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      channelCode: {
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
          channelCode: '',
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
        this.queryInfo.channelCode = this.channelCode
        this.queryInfo.startTime = this.startTime
        this.queryInfo.endTime = this.endTime
        const res = await pushStatisticsByChannel(this.queryInfo)
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
  