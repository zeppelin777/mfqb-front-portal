<template>
  <div class="statistics-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>H5渠道统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            @change="confirmDate"
            clearable
          />
        </el-form-item>
        <el-form-item label="渠道编号：">
          <el-input v-model="queryInfo.channelCode" placeholder="请输入渠道编号" clearable/>
        </el-form-item>
        <el-form-item label="渠道编号：">
          <el-input v-model="queryInfo.channelName" placeholder="请输入渠道名称" clearable/>
        </el-form-item>
        <el-form-item label="价格类型：">
          <el-select
            v-model="queryInfo.priceType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in priceTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button >
          <el-button icon="el-icon-download" size="small" type="primary" @click="download()">下载</el-button >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData" max-height="600">
        <el-table-column fixed prop="channelCode" label="渠道编号" align="center" />
        <el-table-column fixed prop="channelName" label="渠道名称" align="center" show-overflow-tooltip />
        <el-table-column prop="priceTypeStr" label="渠道类型" align="center" />
        <el-table-column prop="price" label="单价" align="center" width="70" />
        <el-table-column prop="channelPv" label="pv" align="center" width="70" />
        <el-table-column prop="channelUv" label="uv" align="center" width="120">
          <template slot="header" slot-scope="scope">
            <span>uv</span>
            <el-tooltip class="item" effect="dark" content="(今日UV-昨日UV)/昨日UV * 100" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span>{{ row.channelUv }}</span>
            <span :style="{color: ((row.channelUv - row.sqChannelUv) / (row.sqChannelUv == 0? 1:row.sqChannelUv) * 100).toFixed(2) > 0 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold', fontSize: '14px'}">
              ({{ ((row.channelUv - row.sqChannelUv) / (row.sqChannelUv == 0? 1:row.sqChannelUv) * 100).toFixed(2)  }}%)
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="registerNum" label="注册登录/注册率" align="center" width="150">
          <template slot="header" slot-scope="scope">
            <span>注册登录/注册率</span>
            <el-tooltip class="item" effect="dark" content="今日注册率-昨日注册率" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span>{{ row.registerNum }}</span>
            <span>/{{ (row.registerPercent * 100).toFixed(2) }}%</span>
            <span :style="{color: computeNum(row.registerPercent,row.sqRegisterPercent) > 0 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold', fontSize: '14px'}">
              ({{ computeNum(row.registerPercent,row.sqRegisterPercent) }}%)
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="collectNum" label="留资/留资率/成本单价" align="center" width="220">
          <template slot="header" slot-scope="scope">
            <span>留资/留资率/成本单价</span>
            <el-tooltip class="item" effect="dark" content="今日留资率-昨日留资率" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span>
              <span>{{ row.collectNum }}</span>/
              <span>{{ (row.collectPercent * 100).toFixed(2) }}%</span>
              <span :style="{color: computeNum(row.collectPercent,row.sqCollectPercent) > 0 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold', fontSize: '14px'}">
                ({{ computeNum(row.collectPercent,row.sqCollectPercent) }}%)
              </span>
            </span>
            <span>/{{ (((row.totalConst && row.collectNum) ? String((row.totalConst / row.collectNum).toFixed(2)) : 0) - ((row.sqTotalConst && row.sqCollectNum) ? String((row.sqTotalConst / row.sqCollectNum).toFixed(2)) : 0)).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalApiNum" label="推送总数/推送率/推送成功数/推送成功率" align="center" width="300">
          <template slot="header" slot-scope="scope">
            <span>推送总数/推送率/推送成功数/推送成功率</span>
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">
                推送率(推送总数/留资数)：今日推送率-昨日推送率
                <br/>
                推送成功率(推送成功数/推送总数)：今日推送成功率-昨日推送成功率
              </div>
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span>
              <span>{{ row.totalApiNum }}</span>
              <span>/{{ ((row.totalApiNum && row.collectNum) ? String(((row.totalApiNum / row.collectNum) * 100).toFixed(2)) : '0.00') }}%</span>
              <span :style="{color: computeNum(((row.totalApiNum && row.collectNum) ? String(row.totalApiNum / row.collectNum) : 0),((row.sqTotalApiNum && row.sqCollectNum) ? String(row.sqTotalApiNum / row.sqCollectNum) : 0)) > 0 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold', fontSize: '14px'}">
                ({{ computeNum(((row.totalApiNum && row.collectNum) ? String(row.totalApiNum / row.collectNum) : 0),((row.sqTotalApiNum && row.sqCollectNum) ? String(row.sqTotalApiNum / row.sqCollectNum) : 0)) }}%)
              </span>
            </span>
            <span>
              <span>/{{ row.apiPushNum }}</span>
              <span>/{{ ((row.totalApiNum && row.apiPushNum) ? String(((row.apiPushNum / row.totalApiNum) * 100).toFixed(2)) : '0.00') }}%</span>
              <span :style="{color: computeNum(((row.totalApiNum && row.apiPushNum) ? String(row.apiPushNum / row.totalApiNum) : 0), ((row.sqTotalApiNum && row.sqApiPushNum) ? String(row.sqApiPushNum / row.sqTotalApiNum) : 0)) > 0 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold', fontSize: '14px'}">
                ({{ computeNum(((row.totalApiNum && row.apiPushNum) ? String(row.apiPushNum / row.totalApiNum) : 0), ((row.sqTotalApiNum && row.sqApiPushNum) ? String(row.sqApiPushNum / row.sqTotalApiNum) : 0)) }}%)
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="totalApiNum" label="推送单价" align="center" width="120">
          <template slot="header" slot-scope="scope">
            <span>推送单价</span>
            <el-tooltip class="item" effect="dark" content="推送单价(推送营收/推送成功数)：今日单价-昨日单价" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span>
              <span>{{ (row.apiPushIncome && row.apiPushNum) ? String((row.apiPushIncome / row.apiPushNum).toFixed(2)) : 0 }}</span>
              <span :style="{color: (((row.apiPushIncome && row.apiPushNum) ? String((row.apiPushIncome / row.apiPushNum)) : 0) - ((row.sqApiPushIncome && row.sqApiPushNum) ? String((row.sqApiPushIncome / row.sqApiPushNum)) : 0)) > 0 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold', fontSize: '14px'}">
                ({{ (((row.apiPushIncome && row.apiPushNum) ? String((row.apiPushIncome / row.apiPushNum)) : 0) - ((row.sqApiPushIncome && row.sqApiPushNum) ? String((row.sqApiPushIncome / row.sqApiPushNum)) : 0)).toFixed(2) }})
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="apiPushIncome" label="推送营收" align="center">
          <template slot-scope="{row}">
            <span>{{ row.apiPushIncome }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productUv" label="产品uv" align="center">
          <template slot-scope="{row}">
            <span>
              <span>{{ row.productUv }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="productIncome" label="产品营收" align="center">
          <template slot-scope="{row}">
            <span>{{ row.productIncome }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalConst" label="总成本" align="center">
          <template slot-scope="{row}">
            <span>{{ row.totalConst }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalIncome" label="总营收" align="center">
          <template slot-scope="{row}">
            <span>{{ row.totalIncome }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="channelUvConst" label="渠道uv成本" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.channelUvConst }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="uvTotalPrice" label="渠道uv产值" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.uvTotalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roi" label="roi" align="center" width="150">
          <template slot="header" slot-scope="scope">
            <span>roi</span>
            <el-tooltip class="item" effect="dark" content="roi环比：(今日roi-昨日roi)/昨日roi" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span>{{ row.roi }}</span>
            <span :style="{color: (((row.roi - (row.sqRoi? row.sqRoi: row.roi)) / ((row.sqRoi? row.sqRoi: row.roi) == 0 ? 1 : (row.sqRoi? row.sqRoi: row.roi))) * 100) > 0 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold', fontSize: '14px'}">
              ({{ (((row.roi - (row.sqRoi? row.sqRoi: row.roi)) / ((row.sqRoi? row.sqRoi: row.roi) == 0 ? 1 : (row.sqRoi? row.sqRoi: row.roi))) * 100).toFixed(2) }}%)
            </span>
          </template>
        </el-table-column>



        <!-- <el-table-column prop="totalPush" label="渠道api采量" align="center" />
        <el-table-column prop="callback" label="渠道api回调" align="center" />
        <el-table-column prop="fakeChannelUv" label="渠道uv" align="center" />
        <el-table-column prop="fakeRegisterNum" label="注册登录渠道" align="center" />
        <el-table-column prop="fakeCollectNum" label="渠道进件" align="center" />
        <el-table-column prop="registerPercent" label="注册转化" align="center" />
        <el-table-column prop="collectPercent" label="进件转化" align="center" />
        <el-table-column prop="productPv" label="产品pv" align="center" />
        <el-table-column prop="apiCallbackNum" label="api回调数" align="center" />
        <el-table-column prop="apiCallbackIncome" label="api回调收入" align="center" />
        <el-table-column prop="crmNum" label="crm推送" align="center" />
        <el-table-column prop="crmIncome" label="crm收入" align="center" />
        <el-table-column prop="uvConst" label="uv成本" align="center" /> -->
        <el-table-column label="操作" align="center" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" @click="showPushStatiscs(scope.row)">推送统计</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[10,20, 50, 50]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <PushStatiscsBychannelDialog :isVisible.sync="isShowPushStatiscsVisible"
                                 :channelCode="pushStatiscsQuery.channelCode"
                                 :startTime="pushStatiscsQuery.startTime"
                                 :endTime="pushStatiscsQuery.endTime"
    />
  </div>
</template>

<script>
import { list, download } from '@/api/channelStatistics'
import PushStatiscsBychannelDialog from './dialog/push-statiscs-by-channel'
export default {
  name: 'UserView',
  components: {
    PushStatiscsBychannelDialog
  },
  data() {
    return {
      currentPage: 1,
      total: 10,
      isShowPushStatiscsVisible: false,
      tableData: [],
      date: [],
      priceTypeOptions: [
        {
          name: 'uv',
          value: 1
        },
        {
          name: '注册',
          value: 2
        },
        {
          name: '进件',
          value: 3
        }
      ],
      queryInfo: {
        current: 1,
        size: 20,
        channelCode: '',
        channelName: '',
        priceType: '',
        startTime: '',
        endTime: ''
      },
      pushStatiscsQuery: {
        channelCode: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  mounted() {
    this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD 00:00:00')
    this.queryInfo.endTime = this.$moment(new Date()).add(1,'day')
      .format('YYYY-MM-DD 00:00:00')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },
  methods: {
    computeNum(newNum, oldNum) {
      return ((newNum * 100) - (oldNum * 100)).toFixed(2)
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
    async getTableList() {
      const res = await list(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
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
    showPushStatiscs(row) {
      this.pushStatiscsQuery.channelCode = row.channelCode
      this.pushStatiscsQuery.startTime = this.queryInfo.startTime
      this.pushStatiscsQuery.endTime = this.queryInfo.endTime
      this.isShowPushStatiscsVisible = true
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
