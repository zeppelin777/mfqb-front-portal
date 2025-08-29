<template>
  <div class="push-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
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
        <el-form-item label="平台名称：">
          <el-input
            v-model="queryInfo.platformName"
            placeholder="请输入平台名称"
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
          <el-button
            icon="el-icon-download"
            size="small"
            type="primary"
            @click="download()"
            >下载</el-button
          >

          <el-button
            icon="el-icon-download"
            size="small"
            type="primary"
            @click="addChanpin()"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column
          prop="platformName"
          label="平台名称"
          align="center"
          width="100"
        />
        <el-table-column prop="platformCode" label="平台代码" align="center" />
        <el-table-column prop="type" label="产品类型" align="center">
          <template slot-scope="{ row }">
            <template v-for="item in optionTypes">
              <div v-if="row.type === item.id">{{ item.label }}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="requestUrl" label="请求地址" align="center" />
        <el-table-column prop="extendCode" label="渠道号" align="center" />
        <!-- <el-table-column prop="priority" label="优先级" align="center" /> -->
        <el-table-column prop="zkUrl" label="撞库地址" align="center" />
        <el-table-column prop="jjUrl" label="进件地址" align="center" />
        <el-table-column label="余额" align="center" width="80">
          <template slot-scope="{ row }">
            {{ parseFloat(((row.balance || 0) - (row.cost || 0)).toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column prop="dailyLimit" label="每日限额" align="center" width="80" />
        <el-table-column prop="price" label="单价" align="center" width="80" />
        <el-table-column prop="uvNum" label="uv" align="center" width="80" />
        <el-table-column prop="totalPrice" label="产品总产值" align="center" width="80" />
        <el-table-column prop="uvProduction" label="uv产值" align="center" width="80" />
        <el-table-column
          prop="priceState"
          label="价格状态"
          align="center"
          width="80"
        >
          <template slot-scope="{ row }">
            <div v-if="row.priceState">分润前</div>
            <div v-if="!row.priceState">分润后</div>
          </template>
        </el-table-column>
        <el-table-column prop="model" label="模式" align="center" width="80">
          <template slot-scope="{ row }">
            <div v-if="row.model">固定价格</div>
            <div v-if="!row.model">分润</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="percent"
          label="分成比例"
          align="center"
          width="80"
        />
        <el-table-column prop="deleteFlag" label="开关" align="center" width="120">
          <template slot-scope="scope">
            <el-switch
              active-text="开"
              inactive-text="关"
              v-model="scope.row.deleteFlag == false"
              @change="(e) => changeDeleteFlag(e, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="ctime" label="创建时间" align="center" /> -->
        <el-table-column label="操作" align="center" width="190px">
          <template slot-scope="scope">
            <div style="display: flex; flex-direction: column">
              <el-button
                icon="el-icon-edit"
                type="primary"
                @click="changePriority(scope.row)"
                >修改</el-button
              >
              <el-button
                style="margin-top: 10px; margin-left: 0"
                type="primary"
                @click="openSwitchInfo(scope.row)"
                >查看开关信息</el-button
              >

              <el-button
                style="margin-top: 10px; margin-left: 0"
                type="primary"
                @click="chargeMoney(scope.row)"
              >充值</el-button
              >

              <el-popconfirm
                title="确认删除吗？"
                icon-color="red"
                @confirm="deleteChanpin(scope.row)"
              >
                <el-button
                  slot="reference"
                  style="margin-top: 10px; margin-left: 0; width: 100%"
                  type="primary"
                  >删除</el-button
                >
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="修改优先级" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" inline>
        <el-form-item label="优先级">
          <el-input v-model="form.priority"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="submitDialog">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="充值" :visible.sync="chargeFormVisible" width="30%">
      <div style="display: flex; justify-content: center;">
        <el-form :model="form" inline>
          <el-form-item label="金额">
            <el-input v-model="form.money"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChargeMoney">取 消</el-button>
        <el-button type="primary" @click="submitCharge">确 定</el-button>
      </div>
    </el-dialog>

    <ChanpinSwitchInfo
      :isVisible.sync="showSwitchInfo"
      :platformId="String(switchInfo.platformId)"
      :platformName="switchInfo.platformName"
    />

    <el-dialog
      :visible.sync="addShow"
      :title="addInfo.id ? '编辑产品' : '新增产品'"
      :before-close="cancelAdd"
    >
      <div class="add">
        <el-form
          ref="addform"
          style="width: 100%"
          :model="addInfo"
          label-position="right"
          label-width="88px"
          size="medium"
        >
          <el-form-item prop="platformCode" label="产品码">
            <el-input :disabled="addInfo.id? true : false" v-model="addInfo.platformCode" />
          </el-form-item>
          <el-form-item prop="platformName" label="产品名称">
            <el-input :disabled="addInfo.id? true : false" v-model="addInfo.platformName" />
          </el-form-item>
          <el-form-item prop="type" label="产品类型">
            <el-select :disabled="addInfo.id? true : false" v-model="addInfo.type" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in optionTypes"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="platType" label="平台类型">
            <!-- <el-input v-model="addInfo.platType" /> -->
            <el-radio-group :disabled="addInfo.id? true : false" v-model="addInfo.platType">
              <el-radio :label="1">推送</el-radio>
              <el-radio :label="2">抢单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="requestUrl" label="请求地址">
            <el-input :disabled="addInfo.id? true : false" v-model="addInfo.requestUrl" />
          </el-form-item>
          <el-form-item prop="appSecret" label="密钥">
            <el-input :disabled="addInfo.id? true : false" v-model="addInfo.appSecret" />
          </el-form-item>
          <el-form-item prop="appKey" label="Key">
            <el-input :disabled="addInfo.id? true : false" v-model="addInfo.appKey" />
          </el-form-item>
          <el-form-item prop="extendCode" label="渠道码">
            <el-input :disabled="addInfo.id? true : false" v-model="addInfo.extendCode" />
          </el-form-item>
          <el-form-item prop="deleteFlag" label="是否删除">
            <!-- <el-input v-model="addInfo.deleteFlag" /> -->
            <el-radio-group :disabled="addInfo.id? true : false" v-model="addInfo.deleteFlag">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="priority" label="产品排名">
            <el-input :disabled="addInfo.id? true : false" v-model="addInfo.priority" />
          </el-form-item>
          <el-form-item prop="zkUrl" label="撞库地址">
            <el-input :disabled="addInfo.id? true : false" v-model="addInfo.zkUrl" />
          </el-form-item>
          <el-form-item prop="jjUrl" label="进件地址">
            <el-input :disabled="addInfo.id? true : false" v-model="addInfo.jjUrl" />
          </el-form-item>
          <el-form-item prop="price" label="价格">
            <el-input v-model="addInfo.price" />
          </el-form-item>
          <el-form-item prop="priceState" label="价格状态">
            <el-radio-group v-model="addInfo.priceState">
              <el-radio :label="true">分润前</el-radio>
              <el-radio :label="false">分润后</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="model" label="模式">
            <el-radio-group v-model="addInfo.model">
              <el-radio :label="true">固定价格</el-radio>
              <el-radio :label="false">分润</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="percent" label="分成比例">
            <el-input v-model="addInfo.percent" />
          </el-form-item>
          <el-form-item prop="dailyLimit" label="每日限额">
            <el-input v-model="addInfo.dailyLimit" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="cancelAdd">取消</el-button>
        <el-button v-if="!addInfo.id" type="primary" @click="submitAdd"
          >确认</el-button
        >
        <el-button v-if="addInfo.id" type="primary" @click="submitUpdate"
          >编辑</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  chanpinlist,
  chanpinUpdatePlat,
  updateFlag,
  deleteChanpin,
  addChanpinTo,
  updateChanpinTo, chargeBalance
} from '@/api/qudao'
import ChanpinSwitchInfo from './dialog/chanpin-switch-info.vue'
export default {
  name: 'ChanpinStatistics',
  components: {
    ChanpinSwitchInfo
  },
  data() {
    return {
      total: 10,
      isChannelStatiscsVisible: false,
      tableData: [],
      date: [],
      queryInfo: {
        current: 1,
        size: 20,
        platformName: '',
        ruleName: ''
      },
      platformCode: null,
      channelStatiscsQuery: {
        startTime: '',
        endTime: ''
      },
      form: {
        priority: '',
        money: ''
      },
      dialogFormVisible: false,
      chargeFormVisible: false,
      changeRow: {},
      showSwitchInfo: false,
      switchInfo: {
        platformId: null,
        platformName: ''
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
      }],
      addInfo: {
        id: null,
        platformCode: '',
        platformName: '',
        type:'',
        platType: '',
        requestUrl: '',
        appSecret: '',
        appKey: '',
        extendCode: '',
        deleteFlag: 1,
        priority: '',
        zkUrl: '',
        jjUrl: '',
        price: '',
        priceState: '',
        model: '',
        percent: '',
        dailyLimit: -1
      },
      addShow: false
    }
  },
  mounted() {
    this.queryInfo.startTime = this.$moment(new Date()).format(
      'YYYY-MM-DD 00:00:00'
    )
    this.queryInfo.endTime = this.$moment(new Date())
      .add(1, 'days')
      .format('YYYY-MM-DD 00:00:00')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },

  methods: {
    initAddInfo() {
      this.addInfo = {
        id: null,
        platformCode: '',
        platformName: '',
        platType: '',
        requestUrl: '',
        appSecret: '',
        appKey: '',
        extendCode: '',
        deleteFlag: 1,
        priority: '',
        zkUrl: '',
        jjUrl: '',
        price: ''
      }
    },
    cancelAdd() {
      this.$refs['addform'].resetFields()
      this.initAddInfo()
      this.addShow = false
    },
    submitAdd() {
      this.$refs['addform'].validate(async (err, data) => {
        console.log(err, data)
        console.log(this.addInfo)
        const res = await addChanpinTo(this.addInfo)
        if (res.code === 200) {
          this.$message.success('新增成功～')
          this.getTableList()
          this.addShow = false
          this.$refs['addform'].resetFields()
          this.initAddInfo()
        }
      })
    },
    submitUpdate() {
      this.$refs['addform'].validate(async (err, data) => {
        let updateInfo = {
          id: this.addInfo.id,
          price: this.addInfo.price,
          priceState: this.addInfo.priceState,
          model: this.addInfo.model,
          percent: this.addInfo.percent,
          dailyLimit: this.addInfo.dailyLimit
        }
        const res = await updateChanpinTo(updateInfo)
        if (res.code === 200) {
          this.$message.success('编辑成功～')
          this.getTableList()
          this.addShow = false
          this.$refs['addform'].resetFields()
          this.initAddInfo()
        }
      })
    },
    async changeDeleteFlag(e, row) {
      console.log(e)
      let data = {
        id: row.id,
        deleteFlag: !row.deleteFlag
      }
      const res = await updateFlag(data)
      if (res.code == 200) {
        this.$message.success('修改成功～')
        this.getTableList()
      }
    },
    async getTableList() {
      const res = await chanpinlist(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    async submitDialog() {
      if (this.form.priority == '') {
        this.$message.error('请输入优先级')
        return
      }
      let params = {
        id: this.changeRow.id,
        ...this.form
      }
      const res = await chanpinUpdatePlat(params)
      console.log(res)
      if (res.code == 200) {
        this.$message.success('修改成功')
        this.getTableList()
        this.dialogFormVisible = false
        this.form = {
          priority: ''
        }
        this.changeRow = {}
      }
    },
    async submitCharge() {
      if (this.form.money == '') {
        this.$message.error('请输入金额')
        return
      }
      let params = {
        id: this.changeRow.id,
        ...this.form
      }
      const res = await chargeBalance(params)
      console.log(res)
      if (res.code == 200) {
        this.$message.success('修改成功')
        this.getTableList()
        this.chargeFormVisible = false
        this.form = {
          money: ''
        }
        this.changeRow = {}
      }
    },
    cancelDialog() {
      this.dialogFormVisible = false
      this.changeRow = {}
    },
    changePriority(row) {
      this.changeRow = row
      this.addInfo = row
      // this.dialogFormVisible = true
      this.addShow = true
    },
    chargeMoney(row) {
      this.chargeFormVisible = true
      this.changeRow = row
    },
    cancelChargeMoney() {
      this.chargeFormVisible = false
      this.form = {
        money: ''
      }
      this.changeRow = {}
    },
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
    handleSizeChange(val) {
      this.queryInfo.size = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.queryInfo.current = val
      this.getTableList()
    },
    showChannelStatiscs(row) {
      console.log(row)
      this.platformCode = row.platformCode
      this.channelStatiscsQuery.startTime = this.queryInfo.startTime
      this.channelStatiscsQuery.endTime = this.queryInfo.endTime
      this.isChannelStatiscsVisible = true
    },
    openSwitchInfo(row) {
      this.showSwitchInfo = true
      this.switchInfo.platformId = row.id
      this.switchInfo.platformName = row.platformName
    },
    async deleteChanpin(row) {
      let params = {
        id: row.id
      }

      const res = await deleteChanpin(params)
      if (res.code === 200) {
        this.$message.success('删除成功～')
        this.getTableList()
      }
    },

    addChanpin() {
      this.addShow = true
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
<style lang="less" scoped>
.add {
  width: 70%;
  margin: auto;
}
</style>
