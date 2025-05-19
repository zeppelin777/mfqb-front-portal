<template>
  <div class="push-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>API放款</el-breadcrumb-item>
      <el-breadcrumb-item>API放款统计</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围：">
          <el-date-picker v-model="date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
            format="yyyy-MM-dd" range-separator="至" @change="confirmDate" value-format="yyyy-MM-dd" clearable />
        </el-form-item>
        <el-form-item label="渠道来源：">
          <el-select
            v-model="queryInfo.source"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
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
        <el-table-column prop="strikeNum" label="撞库成功数量" align="center" />
        <el-table-column prop="applyFailNum" label="授信失败数量" align="center" />
        <el-table-column prop="applySuccessNum" label="授信成功数量" align="center" />
        <!-- <el-table-column prop="applyingNum" label="授信中数量" align="center" /> -->
        <el-table-column prop="logNum" label="登录数量" align="center" />
        <el-table-column prop="downNum" label="下载数量" align="center" />
        <el-table-column prop="orderFailNum" label="放款失败数量" align="center" />
        <el-table-column prop="orderSuccessNum" label="放款成功数量" align="center" />
        <el-table-column prop="orderingNum" label="放款中数量" align="center" />
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getLoanRecord } from '@/api/apiLoanStatistics'
export default {
  name: 'ApiLoanStatistics',
  data() {
    return {
      isVisible: false,
      tableData: [],
      date: [],
      stateOptions: [
        {
          name: '小龙钱包',
          value: 'own'
        },
        {
          name: '橙小花',
          value: 'XXR-CXH001'
        }
      ],
      queryInfo: {
        source: 'XXR-CXH001'
      }
    }
  },
  mounted() {
    this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD 00:00:00')
    this.queryInfo.endTime = this.$moment(new Date())
      .add(1, 'days')
      .format('YYYY-MM-DD 00:00:00')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },

  methods: {
    async getTableList() {
      const res = await getLoanRecord(this.queryInfo)
      if (res.code === 200) {
        this.tableData = [res.data]
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
