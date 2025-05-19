<template>
    <div class="user-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>进件用户</el-breadcrumb-item>
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
          <el-form-item>
            <el-cascader
             placeholder="请选择地区"
             :options="areaDatas"
             :props="{emitPath: false,multiple:true}"
             v-model="queryInfo.cityCode"
             >
             </el-cascader>
          </el-form-item>
          <el-form-item label="教育：">
            <el-select
              v-model="queryInfo.edu"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in educations"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="芝麻分：">
            <el-select
              v-model="queryInfo.zhima"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in zhimas"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="微粒贷：">
            <el-select
              v-model="queryInfo.tencentLoan"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in wlds"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="职业：">
            <el-select
              v-model="queryInfo.careerIdentity"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in occupations"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="逾期：">
            <el-select
              v-model="queryInfo.creditRecord"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in overdues"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="信用卡额度：">
            <el-select
              v-model="queryInfo.creditCardAmount"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in credits"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="京东白条：">
            <el-select
              v-model="queryInfo.baitiao"
              clearable
              placeholder="请选择" >
              <el-option
                v-for="item in baitiaos"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="蚂蚁花呗：">
            <el-select
              v-model="queryInfo.huabei"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in ants"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="社保：">
            <el-select
              v-model="queryInfo.socialSecurity"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in socials"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公积金：">
            <el-select
              v-model="queryInfo.providentFund"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in funds"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="商业保险：">
            <el-select
              v-model="queryInfo.insurance"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in insurances"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="房产：">
            <el-select
              v-model="queryInfo.house"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in houses"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车产：">
            <el-select
              v-model="queryInfo.car"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in cars"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否推送：">
            <el-select
              v-model="queryInfo.pushState"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in pushStateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="queryInfo.phoneNo" placeholder="请输入手机号" clearable/>
          </el-form-item>
          <!-- <el-form-item label="来源渠道代码：">
            <el-input
              v-model="queryInfo.channelCode"
              placeholder="请输入渠道代码"
              clearable
            />
          </el-form-item> -->
          <!-- <el-form-item label="来源渠道名称：">
            <el-input
              v-model="queryInfo.channelName"
              placeholder="请输入渠道名称"
              clearable
            />
          </el-form-item> -->
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
      <el-card class="table-box">
        <el-table border stripe :data="tableData" max-height="400">
          <el-table-column prop="userId" label="用户编号" align="center" fixed="left"/>
          <el-table-column prop="channelCode" label="渠道编号" align="center" />
          <el-table-column prop="channelName" label="渠道名称" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" width="110" />
          <el-table-column prop="realName" label="姓名" align="center" />
          <!-- <el-table-column prop="idCard" label="身份证" align="center" width="140" /> -->
          <el-table-column prop="monthlyIncome" label="月收入" align="center" />
          <el-table-column prop="cityName" label="城市" align="center" />
          <el-table-column prop="edu" label="教育程度" align="center" width="100" />
          <el-table-column prop="zhima" label="芝麻分" align="center" />
          <!-- <el-table-column prop="tencentLoan" label="微粒贷" align="center" /> -->
          <el-table-column prop="careerIdentity" label="职业" align="center" width="120" show-overflow-tooltip />
          <!-- <el-table-column prop="creditRecord" label="是否逾期" align="center" /> -->
          <!-- <el-table-column prop="creditCardAmount" label="信用卡额度" align="center" /> -->
          <el-table-column prop="baitiao" label="京东白条" align="center" />
          <el-table-column prop="huabei" label="蚂蚁花呗" align="center" />
          <el-table-column prop="socialSecurity" label="社保" align="center" width="120" show-overflow-tooltip />
          <el-table-column prop="providentFund" label="公积金" align="center" width="120" show-overflow-tooltip />
          <el-table-column prop="house" label="房产" align="center" />
          <el-table-column prop="car" label="车产" align="center" />
          <!-- <el-table-column prop="companyName" label="公司" align="center"/> -->
          <el-table-column prop="loanDate" label="进件时间" align="center" width="150px" fixed="right"/>
          <el-table-column label="推送状态" align="center" width="80px" fixed="right">
            <template slot-scope="scope">
              {{ scope.row.pushState ? '已推送': '未推送' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="120px">
            <template slot-scope="scope">
                <el-button @click="showPush(scope.row)">推送查看</el-button>
              <el-button @click="repush(scope.row)">重新推送</el-button>
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
      <el-dialog :visible="showPushLog" title="推送记录" @close="showPushLog=false">
        <el-table :data="pushLogList">
            <el-table-column prop="requestId" label="推送编号" align="center" />
            <el-table-column prop="platformName" label="推送编号" align="center" />
            <el-table-column prop="platTypeStr" label="平台类型" align="center" />
            <el-table-column prop="price" label="推送价格" align="center" />
            <el-table-column prop="stateStr" label="推送状态" align="center" />
            <el-table-column prop="pushTime" label="推送日期" align="center" />
        </el-table>
      </el-dialog>
    </div>
</template>
<script>
import { list, transLogList, push } from '@/api/loaninfo'
import areaData from '@/api/area'
export default {
  name: 'UserView',
  data() {
    return {
      total: 10,
      areaDatas: [],
      tableData: [],
      date: [],
      ants: ['无额度', '2000以下', '2000-10000', '大于10000'],
      cars: ['无车产', '有车产'],
      credits: ['无', '3000以下', '3千到1万', '1万到3万', '3万以上'],
      educations: ['初中及以下', '高中', '中专', '大专', '本科', '研究生及以上'],
      funds: ['无公积金', '缴纳未满6个月', '缴纳6个月以上'],
      houses: ['无房产', '有房产'],
      insurances: ['无', '投保人寿且投保两年以下', '投保人寿且投保两年以上'],
      baitiaos: ['无额度', '2000以下', '2000-10000', '大于10000'],
      occupations: ['上班族', '公务员或事业单位','私营业主（有营业执照）' ,'个体户（无营业执照）' ,'其他职业'],
      overdues: ['是', '否'],
      zhimas: ['600分以下', '600-650', '650-700', '700分以上'],
      socials: ['无社保',  '缴纳未满6个月' , '缴纳6个月以上'],
      wlds: [
        '500~3000',
        '3000~6000',
        '6000~10000',
        '10000~30000',
        '30000~100000',
        '>100000',
        '无'
      ],
      pushStateOptions: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      queryInfo: {
        current: 1,
        size: 20,
        userId: '',
        startTime: '2022-08-01',
        endTime: '2022-08-02',
        channelCode: 'ud3kbf',
        channelName: '',
        cityCode: [],
        baitiao: '',
        car: '',
        careerIdentity: '',
        creditCardAmount: '',
        creditRecord: '',
        edu: '',
        house: '',
        huabei: '',
        insurance: '',
        monthlyIncome: '',
        providentFund: '',
        socialSecurity: '',
        tencentLoan: '',
        zhima: '',
        pushState: ''
      },
      showPushLog: false,
      pushLogList: []
    }
  },
  mounted() {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser == 'xiaochengxu') {
      this.queryInfo.channelCode = 'hli6nf'
    }
    this.areaDatas = areaData.slice()
    this.areaDatas.shift()
    this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD 00:00:00')
    this.queryInfo.endTime = this.$moment(new Date())
      .add(1, 'days')
      .format('YYYY-MM-DD 00:00:00')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },
  methods: {
    async getTableList() {
      const res = await list(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.pageInfo.total
        this.tableData = res.data.pageInfo.records
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
    async showPush(row) {
      this.pushLogList = []
      const res = await transLogList({ userId: row.userId })
      if (res.code === 200) {
        this.pushLogList = res.data
      }
      this.showPushLog = true
    },
    async repush(row) {
      await push({ userId: row.userId })
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
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
