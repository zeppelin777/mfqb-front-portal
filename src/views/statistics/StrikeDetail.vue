<template>
  <div class="crm-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>撞库详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="撞库时间：">
          <!-- <el-date-picker v-model="date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
            format="yyyy-MM-dd" range-separator="至" @change="confirmDate" value-format="yyyy-MM-dd" clearable /> -->
          <el-time-picker
            is-range
            v-model="date"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            @change="confirmDate" />
        </el-form-item>
        <el-form-item label="渠道名称：">
          <el-input v-model="queryInfo.channelName" placeholder="请输入渠道名称" clearable/>
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input v-model="queryInfo.platformName" placeholder="请输入产品名称" clearable/>
        </el-form-item>
        <el-form-item label="phoneMd5：">
          <el-input v-model="queryInfo.phoneMd5" placeholder="请输入phoneMd5" clearable/>
        </el-form-item>
        <el-form-item label="撞库结果：">
          <el-select
            v-model="queryInfo.successFlag"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="platformName" label="产品名称" align="center" />
        <el-table-column prop="phoneMd5" label="phoneMd5" align="center" />
        <el-table-column prop="successFlag" label="撞库结果" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.successFlag == 0">撞库失败</span>
            <span v-if="scope.row.successFlag == 1">撞库成功</span>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="撞库返回信息" align="center" />
        <el-table-column prop="ctime" label="撞库时间" align="center">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.ctime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[10,20,50,100]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { strikeDetail } from '@/api/productStatistics'
export default {
  name: 'StrikeDetail',
  data() {
    return {
      total: 10,
      isVisible: false,
      tableData: [],
      date: [],
      queryInfo: {
        current: 1,
        size: 50,
        channelName: '',
        phoneMd5: '',
        platformName: '',
        successFlag: ''
      },
      options: [{
        id: 0,
        value: '撞库失败'
      },
      {
        id: 1,
        value: '撞库成功'
      }]
    }
  },
  mounted() {
    this.queryInfo.endTime = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    this.queryInfo.startTime = this.$moment(new Date()).subtract(10,'minutes')
      .format('YYYY-MM-DD HH:mm:ss')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },

  methods: {
    formatTime (time) {
      return this.$moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    async getTableList() {
      const res = await strikeDetail(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    confirmDate(value) {
      console.log(value)
      if (value) {
        this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD') + ' ' + value[0]
        this.queryInfo.endTime = this.$moment(new Date()).format('YYYY-MM-DD') + ' ' + value[1]
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
    }
  }
}
</script>

<style scoped lang="less">
.crm-container {
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
