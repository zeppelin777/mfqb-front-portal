<template>
  <div class="push-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>API放款</el-breadcrumb-item>
      <el-breadcrumb-item>放款产品统计</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围：">
          <el-date-picker v-model="date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
            format="yyyy-MM-dd" range-separator="至" @change="confirmDate" value-format="yyyy-MM-dd" clearable />
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input
            v-model="queryInfo.product"
            placeholder="请输入产品名称"
            clearable
          />
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="productName" label="产品名称" align="center" /> 
        <el-table-column prop="productCode" label="产品码" align="center" />
        <el-table-column prop="strikeSuccessNum" label="撞库成功数量" align="center" />
        <el-table-column prop="creditSuccessNum" label="授信成功数量" align="center" />
        <el-table-column prop="loanNum" label="放款数量" align="center" />
        <el-table-column prop="itemAvg" label="件均" align="center" />
        <el-table-column prop="loanAmt" label="放款金额" align="center" />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[10, 20, 50, 50]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-card style="margin-top: 20px;">
        <div>半流程放款产品</div>
      </el-card>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围：">
          <el-date-picker v-model="date1" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
            format="yyyy-MM-dd" range-separator="至" @change="confirmDate1" value-format="yyyy-MM-dd" clearable />
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input
            v-model="queryInfo1.product"
            placeholder="请输入产品名称"
            clearable
          />
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList1()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-box">
      <el-table border stripe :data="tableData1">
        <el-table-column prop="platformName" label="产品名称" align="center" /> 
        <el-table-column prop="platformCode" label="产品码" align="center" />
        <el-table-column prop="successNum" label="授信成功数" align="center" />
        <el-table-column prop="showNum" label="展示数" align="center" />
        <!-- <el-table-column prop="clickNum" label="点击数" align="center" /> -->
        <el-table-column prop="totalPrice" label="金额" align="center" />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="queryInfo1.current"
        :page-sizes="[10, 20, 50, 50]"
        :page-size="queryInfo1.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total1"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getProductLoanInfo, getHalfProductStatistics } from '@/api/apiLoanStatistics'
export default {
  name: 'ProductLoanInfo',
  data() {
    return {
      tableData: [],
      tableData1: [],
      date: [],
      date1: [],
      queryInfo: {
        current: 1,
        size: 20,
        startTime: '',
        endTime: '',
        product: ''
      },
      queryInfo1: {
        current: 1,
        size: 20,
        startTime: '',
        endTime: '',
        product: ''
      },
      total: 1,
      total1: 1
    }
  },
  mounted() {
    this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD 00:00:00')
    this.queryInfo.endTime = this.$moment(new Date())
      .add(1, 'days')
      .format('YYYY-MM-DD 00:00:00')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
    this.queryInfo1.startTime = this.$moment(new Date()).format('YYYY-MM-DD 00:00:00')
    this.queryInfo1.endTime = this.$moment(new Date())
      .add(1, 'days')
      .format('YYYY-MM-DD 00:00:00')
    this.date1 = [this.queryInfo1.startTime, this.queryInfo1.endTime]
    this.getTableList1()
  },

  methods: {
    async getTableList() {
      const res = await getProductLoanInfo(this.queryInfo)
      if (res.code == 200) {
          this.tableData = res.data.records
          this.total = res.data.total
      }
    },
    async getTableList1() {
      const res = await getHalfProductStatistics(this.queryInfo1)
      if (res.code == 200) {
          this.tableData1 = res.data.records
          this.total1 = res.data.total
      }
    },
    confirmDate(value) {
      if (value) {
        this.queryInfo.startTime = value[0]
        this.queryInfo.endTime = value[1]
        this.queryInfo.startTime = this.$moment(value[0]).format('YYYY-MM-DD 00:00:00')
        this.queryInfo.endTime = this.$moment(value[1]).format('YYYY-MM-DD 00:00:00')
        this.getTableList()
      } else {
        this.queryInfo.startTime = ''
        this.queryInfo.endTime = ''
        this.getTableList()
      }
    },
    confirmDate1(value) {
      if (value) {
        this.queryInfo1.startTime = value[0]
        this.queryInfo1.endTime = value[1]
        this.queryInfo1.startTime = this.$moment(value[0]).format('YYYY-MM-DD 00:00:00')
        this.queryInfo1.endTime = this.$moment(value[1]).format('YYYY-MM-DD 00:00:00')
        this.getTableList1()
      } else {
        this.queryInfo1.startTime = ''
        this.queryInfo1.endTime = ''
        this.getTableList1()
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
    handleSizeChange1(val) {
      this.queryInfo1.size = val
      this.getTableList1()
    },
    handleCurrentChange1(val) {
      this.queryInfo1.current = val
      this.getTableList1()
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
