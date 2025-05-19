<template>
  <div class="product-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围">
          <el-date-picker v-model="date" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" @change="confirmDate" clearable />
        </el-form-item>
        <el-form-item label="产品编号：">
          <el-input v-model="queryInfo.productCode" placeholder="请输入产品编号" clearable/>
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input v-model="queryInfo.productName" placeholder="请输入产品名称" clearable/>
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
          <el-button icon="el-icon-download" size="small" type="primary" @click="download()">下载</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData" max-height="600">
        <el-table-column prop="productName" label="产品名称" align="center" />
        <el-table-column prop="typeAndPrice" label="合作模式" align="center" />
        <el-table-column prop="pv" label="pv" align="center" />
        <el-table-column prop="uv" label="uv" align="center" />
        <el-table-column prop="newNum" label="首次点击" align="center" />
        <el-table-column label="金额" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.typeAndPrice !== 'cpa'">
              <span>{{ (scope.row.typeAndPrice.split('/')[1]) * scope.row.uv }}</span>
            </template>
            <template v-else>
              <span>0</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[10,20, 50, 100]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { list, download } from '@/api/productStatistics'
export default {
  name: 'UserView',
  components: {},
  data() {
    return {
      total: 10,
      isVisible: false,
      tableData: [],
      date: [],
      queryInfo: {
        current: 1,
        size: 20,
        productCode: '',
        productName: '',
        startTime: '',
        endTime: ''
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
      const res = await list(this.queryInfo)
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
    }
  }
}
</script>
<style scoped lang="less">
.product-container {
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
