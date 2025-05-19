<template>
  <div class="user-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>API放款</el-breadcrumb-item>
      <el-breadcrumb-item>未登录用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围：">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            @change="confirmDate"
            clearable
          />
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary"  @click="getTableList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-box">
      <el-table border stripe :data="tableData" max-height="600">
        <el-table-column prop="realName" label="姓名" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="userId" label="用户编号" align="center" fixed="left"/>
        <el-table-column prop="channelCode" label="渠道编号" align="center" />
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="ctime" label="注册时间" align="center"/>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
              <el-button type="text" @click="showSms(scope.row)">短信记录查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.current"
        :page-sizes="[20, 50, 100]"
        :page-size="this.queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog :visible="showSmsLog" title="短信发送记录" @close="closeSmsLog()">
      <el-table :data="smsLogList">
          <el-table-column prop="channelName" label="渠道名称" align="center" />
          <el-table-column prop="description" label="短信描述" align="center">
            <template slot="header" slot-scope="scope">
              <span>短信描述</span>
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  (1):15分钟发送<br/>(2):1小时发送<br/>(3):3小时发送<br/>(4):1天发送-(n):发送天数
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.description }}({{ scope.$index + 1 }})</span>
              <span v-if="smsTotal > 4 && (scope.$index + 1) == 4">-({{ smsTotal - 3 }})</span>
            </template>
          </el-table-column>
          <el-table-column prop="ctime" label="发送时间" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { unloggedList, smsRecord } from '@/api/apiLoanStatistics'

export default {
name: 'userUnLoginList',
data() {
  return {
    myChart: null,
    total: 10,
    tableData: [],
    date: [],
    queryInfo: {
      current: 1,
      size: 20,
      startTime: '2022-08-01',
      endTime: '2022-08-02'
    },
    querySmsInfo: {
      current: 1,
      size: 10
    },
    smsTotal: 1,
    showSmsLog: false,
    smsLogList: [],
    chartList: [],
    userList: [],
    isShow: false

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
    const res = await unloggedList(this.queryInfo)
    if (res.code === 200) {
      this.total = res.data.total
      this.tableData = res.data.records
    }
  },
  confirmDate(value) {
    if (value) {
      this.queryInfo.startTime = this.$moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
      this.queryInfo.endTime = this.$moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
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
  },
  handleSizeChange1(val) {
    this.querySmsInfo.size = val
    this.showSms()
  },
  handleCurrentChange1(val) {
    this.querySmsInfo.current = val
    this.showSms()
  },
  async showSms(row) {
    const res = await smsRecord({ userId: row.userId, ...this.querySmsInfo })
    if (res.code === 200) {
      this.smsLogList = res.data.records.reverse().filter((item,index) => {
        if (index < 4) {
          return item
        }
        return false
      })
      this.smsTotal = res.data.total
    }
    this.showSmsLog = true
  },
  closeSmsLog() {
    this.showSmsLog=false
    this.querySmsInfo = {
      current: 1,
      size: 10
    }
  }
}
}
</script>
<style scoped lang="less">
.user-container {
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
      .el-form-item__label {
        font-size: 13px;
        width: 105px;
        white-space: nowrap;
      }
    }
  }
}
:deep(.table-box) {
  th > div {
    font-size: 13px;
  }
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
}

#echart_china {
width: 100%;
height: 500px;
background-color: #f1f3f4;
}

.china {
  width: calc(100% - 40px);
  height: 600px;
  margin: 20px;
}
</style>
