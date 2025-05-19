<template>
  <div class="statistics-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>埋点统计</el-breadcrumb-item>
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
          <el-button
            icon="el-icon-download"
            size="small"
            type="primary"
            @click="download()"
            >下载</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box" style="margin-bottom: 20px">
      <el-descriptions title="信息收集" :column="6">
        <el-descriptions-item
          label="城市填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.cityPercent }}</el-descriptions-item
        >
        <!-- <el-descriptions-item
          label="房车社保公积金填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.fourElementPercent }}</el-descriptions-item
        > -->
        <el-descriptions-item
          label="有房填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.housePercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="有车填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.carPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="有公积金填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.fundPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="有社保填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.socialPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="学历填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.eduPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="职业填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.professionPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="芝麻分填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.zhimaPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="花呗填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.huabeiPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="白条填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.baitiaoPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="姓名填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.namePercent }}</el-descriptions-item
        >
        <!-- <el-descriptions-item
          label="身份证号填写率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.idCardPercent }}</el-descriptions-item
        > -->
        <el-descriptions-item
          label="是否撞库率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.checkPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="撞库成功率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.checkSuccessPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="进件率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ percentData.pushPercent }}</el-descriptions-item
        >
      </el-descriptions>
    </el-card>

    <el-card class="table-box" style="margin-bottom: 20px">
      <el-descriptions title="首页点击率" :column="6">
        <el-descriptions-item
          label="头部点击率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ h5ProductData.topPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="轮播区域点击率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ h5ProductData.lunboPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="热门点击率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ h5ProductData.hotPercent }}</el-descriptions-item
        >
        <el-descriptions-item
          label="精选点击率"
          :contentStyle="{ fontWeight: 'bold' }"
          >{{ h5ProductData.specialPercent }}</el-descriptions-item
        >
      </el-descriptions>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="userId" label="用户ID" align="center" />
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="cityFlag" label="是否填写城市" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.cityFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="houseFlag"
          label="是否填写房车社保公积金"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{
                row.houseFlag || row.carFlag || row.fundFlag || row.socialFlag
                  ? '✅'
                  : '❌'
              }}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="houseFlag" label="是否填写房产" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.houseFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="carFlag" label="是否填写车产" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.carFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fundFlag" label="是否填写公积金" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.fundFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="socialFlag" label="是否填写社保" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.socialFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="eduFlag" label="是否填写学历" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.eduFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jobFlag" label="是否填写职业" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.jobFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sesameFlag"
          label="是否填写芝麻分"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{ row.sesameFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="huabeiFlag" label="是否填写花呗" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.huabeiFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="baitiaoFlag" label="是否填写白条" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.baitiaoFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nameFlag" label="是否填写姓名" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.nameFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="idcardFlag"
          label="是否填写身份证"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{ row.idcardFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="checkFlag" label="是否撞库" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.checkFlag ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkSuccess"
          label="是否撞库成功"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{ row.checkSuccess ? '✅' : '❌' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pushFlag" label="是否进件" align="center">
          <template slot-scope="{ row }">
            <div>
              {{ row.pushFlag ? '✅' : '❌' }}
            </div>
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
  </div>
</template>

<script>
import { stepList, stepPercent,stepH5Product } from '@/api/channelStatistics'
import { removeNoUseKeys } from '@/utils'
import { color } from 'echarts'
export default {
  name: 'UserView',
  data() {
    return {
      currentPage: 1,
      total: 10,
      tableData: [],
      date: [],
      starOptions: [
        {
          name: '一星',
          value: 1
        },
        {
          name: '二星',
          value: 2
        },
        {
          name: '三星',
          value: 3
        },
        {
          name: '四星',
          value: 4
        },
        {
          name: '五星',
          value: 5
        }
      ],
      queryInfo: {
        current: 1,
        size: 20,
        source: '',
        dataStandard: '',
        startTime: '',
        endTime: ''
      },
      percentData: {},
      h5ProductData:{},
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
      const res = await stepList(removeNoUseKeys(this.queryInfo))
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }

      const percentRes = await stepPercent(removeNoUseKeys(this.queryInfo))
      if (percentRes.code === 200) {
        this.percentData = percentRes.data
      }

      const h5ProductRes = await stepH5Product(removeNoUseKeys(this.queryInfo))
      if (h5ProductRes.code === 200) {
        this.h5ProductData = h5ProductRes.data
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
