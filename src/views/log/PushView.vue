<template>
  <div class="push-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      <el-breadcrumb-item>API-推送日志</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-card>API-推送日志</el-card> -->
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围：">
          <el-date-picker v-model="date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
            format="yyyy-MM-dd" range-separator="至" @change="confirmDate" value-format="yyyy-MM-dd" clearable />
        </el-form-item>
        <el-form-item label="用户编号：">
          <el-input v-model="queryInfo.userId" placeholder="请输入用户编号" clearable/>
        </el-form-item>
        <el-form-item label="用户手机号：">
          <el-input v-model="queryInfo.phoneNo" placeholder="请输入用户手机号" clearable />
        </el-form-item>
        <el-form-item label="用户申请城市">
          <el-input v-model="queryInfo.cityName" placeholder="请输入申请城市" clearable />
        </el-form-item>
        <br/>
        <el-form-item label="用户推送通道：">
          <el-select
            v-model="queryInfo.channelType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户是否共享：">
          <el-select
            v-model="queryInfo.shareFlag"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in shareOptions"
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
        <el-table-column prop="userId" label="用户编号" align="center" />
        <el-table-column prop="channelCode" label="渠道编号" align="center" />
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="realName" label="真实姓名" align="center" />
        <el-table-column prop="phoneNo" label="手机号" align="center" />
        <el-table-column prop="cityName" label="城市" align="center" />
        <el-table-column prop="platformName" label="推送平台名称" align="center" />
        <el-table-column prop="platTypeStr" label="平台类型" align="center" />
        <el-table-column prop="channelTypeStr" label="渠道类型" align="center" />
        <el-table-column label="是否共享" align="center">
          <template slot-scope="scope">
            {{ scope.row.shareFlag ? '共享' : '独享' }}
          </template>
        </el-table-column>
        <el-table-column prop="stateStr" label="推送状态" align="center" />
        <el-table-column prop="errorMsg" label="返回内容" align="center" />
        <el-table-column prop="pushTime" label="推送时间" align="center" />
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
    </el-card>
  </div>
</template>
<script>
import { pushTransLogList } from '@/api/log'
export default {
  name: 'PushStatistics',
  data() {
    return {
      total: 10,
      isVisible: false,
      tableData: [],
      date: [],
      channelOptions: [
        {
          name: '实时通道',
          value: 1
        },
        {
          name: '延时通道',
          value: 2
        }
      ],
      shareOptions: [
        {
          name: '独享',
          value: 0
        },
        {
          name: '共享',
          value: 1
        }
      ],
      queryInfo: {
        current: 1,
        size: 20,
        cityName: '',
        channelType: '',
        phoneNo: '',
        loanFlag: null,
        shareFlag: '',
        userId: ''
      }
    }
  },
  mounted() {
    this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD')
    this.queryInfo.endTime = this.$moment(new Date())
      .add(1, 'days')
      .format('YYYY-MM-DD')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },

  methods: {
    async getTableList() {
      const res = await pushTransLogList(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    confirmDate(value) {
      if (value) {
        this.queryInfo.startTime = value[0]
        this.queryInfo.endTime = value[1]
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
