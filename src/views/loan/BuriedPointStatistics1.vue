<template>
  <div class="statistics-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>API放款</el-breadcrumb-item>
      <el-breadcrumb-item>appH5埋点统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围">
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
        <el-form-item label="渠道名称：">
          <el-input
            v-model="queryInfo.source"
            placeholder="请输入渠道名称"
            clearable
          />
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button
            icon="el-icon-search"
            size="small"
            type="primary"
            @click="getTableList()"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box" style="margin-bottom: 20px">
      <el-descriptions title="信息收集" :column="6">
        <el-descriptions-item
          label="首页按钮进入表单率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.clickIndexFormPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="首页授信率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.clickIndexQuatoPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="人脸认证率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.faceAuthPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="填写放款信息率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.creditInfoPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="授信率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.creditPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="点击借款率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.loanPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="同意权益率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.rightsPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="进行资方绑卡率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.bindCardPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="进行平台绑卡率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.bindPlatCradPercent }}</el-descriptions-item
        >
      </el-descriptions>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="userId" label="用户ID" align="center" />
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="cityFlag" label="是否点击首页按钮进入表单" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.clickIndexFormFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="houseFlag" label="是否点击首页授信" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.clickIndexQuatoFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="huabeiFlag" label="是否人脸认证" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.faceAuthFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="carFlag" label="是否填写放款信息" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.creditInfoFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fundFlag" label="是否授信" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.creditFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="socialFlag" label="是否点击借款" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.loanFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="eduFlag" label="是否同意权益" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.rightsFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jobFlag" label="是否进行资方绑卡" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.bindCardFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sesameFlag"
          label="是否进行平台绑卡"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{ row.bindPlatCradFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="statusDesc" label="状态描述" align="center" />
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
  </div>
</template>

<script>
import { appFdStepList, appFdStepPercent } from '@/api/apiLoanStatistics'
import { removeNoUseKeys } from '@/utils'
export default {
  name: 'BuriedPointStatistics1',
  data() {
    return {
      total: 10,
      tableData: [],
      date: [],
      queryInfo: {
        page: 1,
        size: 20,
        startTime: '',
        endTime: ''
      },
      percentData: {}
    }
  },
  mounted() {
    this.queryInfo.startTime = this.$moment(new Date()).format(
      'YYYY-MM-DD 00:00:00'
    )
    this.queryInfo.endTime = this.$moment(new Date())
      .add(1, 'day')
      .format('YYYY-MM-DD 00:00:00')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },
  methods: {
    confirmDate(value) {
      if (value) {
        this.queryInfo.startTime = this.$moment(value[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.queryInfo.endTime = this.$moment(value[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.getTableList()
      } else {
        this.queryInfo.startTime = ''
        this.queryInfo.endTime = ''
        this.getTableList()
      }
    },
    async getTableList() {
      const res = await appFdStepList(removeNoUseKeys(this.queryInfo))
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }

      const percentRes = await appFdStepPercent(removeNoUseKeys(this.queryInfo))
      if (percentRes.code === 200) {
        this.percentData = percentRes.data
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
.statistics-container {
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
