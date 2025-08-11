<template>
  <div class="push-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>API-推送统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围">
          <el-date-picker v-model="date" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
             range-separator="至" @change="confirmDate" clearable />
        </el-form-item>
        <el-form-item label="平台名称：">
          <el-input v-model="queryInfo.platformName" placeholder="请输入平台名称" clearable/>
        </el-form-item>
        <el-form-item label="规则名称：">
          <el-input v-model="queryInfo.ruleName" placeholder="请输入规则名称" clearable />
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
          <el-button icon="el-icon-download" size="small" type="primary" @click="download()">下载</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData" max-height="600">
        <el-table-column prop="platformName" label="平台名称" align="center" />
        <el-table-column prop="platformCode" label="平台代码" sortable align="center" width="100" />
        <el-table-column prop="platformType" label="产品类型" align="center">
        <template slot-scope="{ row }">
            <template v-for="item in optionTypes">
              <div v-if="row.platformType === item.id">{{ item.label }}</div>
            </template>
          </template>
      </el-table-column>
      <el-table-column label="撞库数" align="center" width="150px">
            <template slot="header" slot-scope="scope">
              <span>撞库数</span>
              <el-tooltip class="item" effect="dark" content="(今日撞库数-昨日撞库数)/昨日撞库数 * 100%" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{row}">
              <div>
                <span>{{ row.checkToltalNum }}</span>
                <span :style="{color: sumRatio(row, 1) > 0 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold', fontSize: '14px'}">
                  ({{ sumRatio(row, 1) }}%)
                </span>
                <span>
                  <i v-if="sumRatio(row, 1) > 0" class="el-icon-top" style="color: #e74c3c;font-weight: bold;font-size: 14px;"></i>
                  <i v-else class="el-icon-bottom" style="color: #2ecc71;font-weight: bold;font-size: 14px;"></i>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="撞库成功数/成功率" align="center" width="160px">
            <template slot="header" slot-scope="scope">
              <span>撞库成功数/成功率</span>
              <el-tooltip class="item" effect="dark" content="((今日撞库成功数/今日撞库总数)-(昨日撞库成功数/昨日撞库总数)) * 100%" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{row}">
              <div>
                <span>{{ row.checkSuccessNum }}</span>
                <span>/{{ row.checkToltalNum === 0? 0 :((row.checkSuccessNum/row.checkToltalNum)*100).toFixed(2) }}%</span>
                <span :style="{color: sumRatio(row, 2) > 0 ? '#e74c3c' : '#2ecc71',  fontWeight: 'bold', fontSize: '14px'}">
                  ({{ sumRatio(row, 2) }}%)
                </span>
                <span>
                  <i v-if="sumRatio(row, 2) > 0" class="el-icon-top" style="color: #e74c3c;font-weight: bold;font-size: 14px;"></i>
                  <i v-else class="el-icon-bottom" style="color: #2ecc71;font-weight: bold;font-size: 14px;"></i>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="产品均价" align="center" width="150">
            <template slot-scope="{row}">
              <span>{{ (row.totalProductPrice/row.successNum).toFixed(2) }}</span>
              <span :style="{color: ((row.totalProductPrice/row.successNum) - (row.sqtotalProductPrice/row.sqsuccessNum)).toFixed(2) > 0 ? '#e74c3c' : '#2ecc71',  fontWeight: 'bold', fontSize: '14px'}">
                ({{ ((row.totalProductPrice/row.successNum) - (row.sqtotalProductPrice/row.sqsuccessNum)).toFixed(2) }})
              </span>
              <span>
                  <i v-if="((row.totalProductPrice/row.successNum) - (row.sqtotalProductPrice/row.sqsuccessNum)).toFixed(2) > 0" class="el-icon-top" style="color: #e74c3c;font-weight: bold;font-size: 14px;"></i>
                  <i v-else class="el-icon-bottom" style="color: #2ecc71;font-weight: bold;font-size: 14px;"></i>
                </span>
            </template>
          </el-table-column>
        <el-table-column prop="pushTotalNum" label="推送总数" sortable align="center" width="100" />
        <el-table-column prop="successNum" label="成功数量" align="center" />
        <el-table-column prop="failureNum" label="失败数量" align="center" />
        <el-table-column prop="successRate" label="成功率" align="center" >
          <template slot-scope="{row}">
            <div>{{ row.successRate }}%</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="checkPercent" label="撞库通过率" align="center" /> -->
        <el-table-column prop="totalProductPrice" label="产品总金额" align="center">
          <template slot-scope="{row}">
            <div>{{ row.totalProductPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="uvNum" label="uv" align="center" />
        <el-table-column prop="totalPrice" label="产品总产值" align="center" />
        <el-table-column prop="uvProduction" label="uv产值" align="center" />
        <el-table-column label="操作" align="center" width="140px">
          <template slot-scope="scope">
            <el-button type="text" @click="showImpactDepotStatiscs(scope.row)">撞库详情</el-button>
            <el-button type="text" @click="showChannelStatiscs(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[100, 500, 1000]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <ChannelStatiscsByPushDialog :isVisible.sync="isChannelStatiscsVisible"
                                 :platformCode="platformCode"
                                 :startTime="channelStatiscsQuery.startTime"
                                 :endTime="channelStatiscsQuery.endTime"/>
    <ImpactDepotStatiscsDialog :isVisible.sync="isImpactDepotStatiscsVisible"
                                   :platformName="platformName"
                                   :startTime="channelStatiscsQuery.startTime"
                                   :endTime="channelStatiscsQuery.endTime"/>
  </div>
</template>

<script>
import { download, list } from '@/api/pushStatistics'
import ChannelStatiscsByPushDialog from './dialog/channel-statiscs-by-push'
import ImpactDepotStatiscsDialog from './dialog/Impact-depot-statiscs'

export default {
  name: 'PushStatistics',
  components: {
    ChannelStatiscsByPushDialog,
    ImpactDepotStatiscsDialog
  },
  data() {
    return {
      total: 10,
      isChannelStatiscsVisible: false,
      isImpactDepotStatiscsVisible: false,
      tableData: [],
      date: [],
      queryInfo: {
        current: 1,
        size: 100,
        platformName: '',
        ruleName: ''
      },
      platformCode: null,
      platformName: null,
      channelStatiscsQuery: {
        startTime: '',
        endTime: ''
      },
      optionTypes: [{
        id: 1,
        label: '半流程撞库授权'
      }, {
        id: 2,
        label: '半流程进件授权'
      }, {
        id: 3,
        label: '全流程'
      }, {
        id: 4,
        label: '其他流程'
      }]
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
    sumRatio(row, type) {
      let ratio = 0
      if (type === 1) {
        ratio = (row.checkToltalNum - row.sqcheckToltalNum)/(row.sqcheckToltalNum === 0? 1: row.sqcheckToltalNum) * 100
      }
      if (type === 2) {
        const newSum = row.checkToltalNum === 0 ? 0 : (row.checkSuccessNum/row.checkToltalNum)
        const oldSum = row.sqcheckToltalNum === 0 ? 0 : (row.sqcheckSuccessNum/row.sqcheckToltalNum)
        // ratio = ((newSum - oldSum)/(oldSum === 0? 1: oldSum))*100
        ratio = (newSum - oldSum)*100
      }
      return Number.isInteger(ratio)?ratio: ratio.toFixed(2)
    },
    async getTableList() {
      const res = await list(this.queryInfo);
      if (res.code === 200) {
        this.total = res.data.total;
        this.tableData = this.processRecords(res.data.records);
      }
    },

    processRecords(records) {
      const result = [];
      const codeMap = {};

      // 遍历 records，按 platformCode 分组
      records.forEach(record => {
        if (!codeMap[record.platformCode]) {
          codeMap[record.platformCode] = {
            base: null, // 基础数据
            h5: null,   // 带 (H5) 的数据
            total: null // 带 (总) 的数据
          };
        }

        const group = codeMap[record.platformCode];

        if (record.platformName.endsWith('(h5)')) {
          group.h5 = record; // 存储带 (H5) 的数据
        } else {
          group.base = record; // 存储基础数据
        }
      });

      // 生成最终的三行数据
      for (const key in codeMap) {
        const group = codeMap[key];
        const base = group.base;
        const h5 = group.h5;
// 打印 h5 的值
        console.log('h5:', h5);
        console.log('base:', base);


        // 基础数据
        if (base) {
          result.push({ ...base });
        }

        // 带 (H5) 的数据
        if (h5) {
          result.push({ ...h5 });
        }

        // 带 (总) 的数据
        if (base && h5) {
          const totalRecord = {
            ...base,
            platformName: base.platformName + '(总)',
            pushTotalNum: base.pushTotalNum + h5.pushTotalNum,
            successNum: base.successNum + h5.successNum,
            failureNum: base.failureNum + h5.failureNum,
            totalProductPrice: (parseFloat(base.totalProductPrice) + parseFloat(h5.totalProductPrice)).toFixed(2).replace(/\.?0+$/, ''),
            successRate: ((base.successNum + h5.successNum) / (base.pushTotalNum + h5.pushTotalNum) * 100).toFixed(0)
          };
          result.push(totalRecord);
        }
      }

      return result;
    },
    confirmDate(value) {
      if (value) {
        this.queryInfo.startTime = this.$moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
        this.queryInfo.endTime = this.$moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
        this.getTableList()
      } else {
        this.queryInfo.startTime = ''
        this.queryInfo.endTime = ''
        this.getTableList()
      }
    },
    async download() {
      await download(this.queryInfo)
    },
    handleSizeChange(val) {
      this.queryInfo.size = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.queryInfo.current = val
      this.getTableList()
    },
    showChannelStatiscs(row) {
      console.log(row);
      this.platformCode = row.platformCode
      this.channelStatiscsQuery.startTime = this.queryInfo.startTime
      this.channelStatiscsQuery.endTime = this.queryInfo.endTime
      this.isChannelStatiscsVisible = true
    },
    showImpactDepotStatiscs(row) {
        // console.log(row.platformName.split('(')[0]);
      // 如果平台名称以"(掩码)"结尾，则不进行split操作
        if (row.platformName.endsWith('(掩码)')) {
          this.platformName = row.platformName;
        } else {
          this.platformName = row.platformName.split('(')[0];
        }
        this.channelStatiscsQuery.startTime = this.queryInfo.startTime
        this.channelStatiscsQuery.endTime = this.queryInfo.endTime
        this.isImpactDepotStatiscsVisible = true
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
