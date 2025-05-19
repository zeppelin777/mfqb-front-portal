<template>
  <div class="push-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>API放款</el-breadcrumb-item>
      <el-breadcrumb-item>放款中用户</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="渠道名称：">
          <el-input
            v-model="queryInfo.source"
            placeholder="请输入渠道名称"
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
        <el-table-column prop="userId" label="渠道名称" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="channelCode" label="渠道码" align="center" />
        <el-table-column prop="loanAmt" label="贷款金额" align="center" />
        <el-table-column prop="userType" label="用户类型" align="center" />
        <el-table-column prop="loanStatus" label="放款状态" align="center" />
        <el-table-column prop="repayStatus" label="账单状态" align="center" />
        <el-table-column prop="period" label="期数" align="center" />
        <el-table-column prop="platformName" label="产品名称" align="center" />
        <el-table-column prop="funderProvider" label="资金提供方" align="center" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
              <el-button type="text" @click="showPlans(scope.row)">查看还款计划</el-button>
          </template>
        </el-table-column>
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
    <el-dialog :visible="planVisible" title="还款计划" @close="planVisible = false">
      <el-table :data="planList">
          <el-table-column prop="userId" label="用户ID" align="center" />
          <el-table-column prop="loanAmt" label="借款金额-本金" align="center" />
          <el-table-column prop="monPay" label="月供(未加融担费)" align="center" />
          <el-table-column prop="planRate" label="利率" align="center" />
          <el-table-column prop="totalPeriod" label="总期次" align="center" />
          <el-table-column prop="period" label="当前期次" align="center" />
          <el-table-column prop="tollFee" label="应收费" align="center" />
          <el-table-column prop="actTollFee" label="实际已收费" align="center" />
          <el-table-column prop="remainTollFee" label="剩余收费" align="center" />
          <el-table-column prop="tollPayTime" label="收费时间" align="center" />
          <el-table-column prop="totalTollFee" label="总融担费" align="center" />
          <el-table-column prop="avgTollFee" label="平均每期融担费" align="center" />
          <el-table-column prop="repayYear" label="还款年份" align="center" />
          <el-table-column prop="repayMonth" label="还款月份" align="center" />
          <el-table-column prop="repayDay" label="还款天" align="center" />
          <el-table-column prop="repayDate" label="计划还款日期" align="center" />
          <el-table-column prop="dueAmt" label="当期应还金额" align="center" />
          <el-table-column prop="principalAmt" label="当期本金" align="center" />
          <el-table-column prop="interestAmt" label="当期利息" align="center" />
          <el-table-column prop="guaranteeAmt" label="当期担保费" align="center" />
          <el-table-column prop="penaltyAmt" label="当期罚息" align="center" />
          <el-table-column prop="idAmt" label="当期提前结清违约金" align="center" />
          <el-table-column prop="otherAmt" label="其他费用" align="center" />
          <el-table-column prop="reduceAmt" label="当期减免金额" align="center" />
          <el-table-column prop="actAmt" label="已还金额" align="center" />
          <el-table-column prop="actPrincipalAmt" label="已还本金" align="center" />
          <el-table-column prop="actInterestAmt" label="已还利息" align="center" />
          <el-table-column prop="actGuaranteeAmt" label="已还担保费" align="center" />
          <el-table-column prop="actPenaltyAmt" label="已还罚息" align="center" />
          <el-table-column prop="actIdAmt" label="已还违约金" align="center" />
          <el-table-column prop="actPayTime" label="还款时间" align="center" />
          <el-table-column prop="leftAmt" label="剩余待还" align="center" />
          <el-table-column prop="leftPrincipalAmt" label="剩余本金" align="center" />
          <el-table-column prop="leftInterestAmt" label="剩余利息" align="center" />
          <el-table-column prop="leftGuaranteeAmt" label="剩余担保费" align="center" />
          <el-table-column prop="leftPenaltyAmt" label="剩余罚息" align="center" />
          <el-table-column prop="leftIdAmt" label="剩余违约金" align="center" />
          <el-table-column prop="repayStatus" label="还款状态" align="center">
            <template slot-scope="scope">
              {{ getStatusName(scope.row, 1) }}
            </template>
          </el-table-column>
          <el-table-column prop="repaySubstatus" label="还款子状态" align="center">
            <template slot-scope="scope">
              {{ getStatusName(scope.row, 2) }}
            </template>
          </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { getLoaningUser, getPlans } from '@/api/apiLoanStatistics'
export default {
  name: 'ChannelLoanInfo',
  data() {
    return {
      planVisible: false,
      tableData: [],
      date: [],
      queryInfo: {
        current: 1,
        size: 20,
        source: ''
      },
      total: 1,
      planList: [],
      repayStatus: [
        { status: 'UNCLEAR', name: '未结清' },
        { status: 'CLEAR', name: '已结清' },
        { status: 'OVERDUE', name: '已逾期' }
      ],
      repaySubStatus: [
        { status: 'UNPAY', name: '未还款' },
        { status: 'PARTIAL_PAY', name: '部分还款' },
        { status: 'EARLY_CLEAR', name: '提前结清' },
        { status: 'NORNAL_CLEAR', name: '正常结清' },
        { status: 'OVERDUE_CLEAR', name: '逾期结清' }
      ]
    }
  },
  mounted() {
    this.getTableList()
  },

  methods: {
    async getTableList() {
      const res = await getLoaningUser(this.queryInfo)
      if (res.code == 200) {
          this.tableData = res.data.records
          this.total = res.data.total
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
    async showPlans(row) {
      const res = await getPlans({ userId: row.userId })
      if (res.code == 200) {
          this.planList = res.data
          this.planVisible = true
      }
    },
    getStatusName(row, type) {
      let name = ''
      if (type == 1) {
        this.repayStatus.map(item => {
          if (item.status == row.repayStatus) {
            name = item.name
          }
        })
      }
      if (type == 2) {
        this.repaySubStatus.map(item => {
          if (item.status == row.repaySubstatus) {
            name = item.name
          }
        })
      }
      return name
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
