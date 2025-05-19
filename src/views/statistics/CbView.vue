<template>
  <div class="cb-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>API-回调统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="产品名称：">
          <el-input v-model="queryInfo.id" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="日期：">
          <el-input v-model="queryInfo.id" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="id" label="产品名称" align="center" />
        <el-table-column prop="id" label="推送总量" align="center" />
        <el-table-column prop="id" label="推送成功" align="center" />
        <el-table-column prop="id" label="推送失败" align="center" />
        <el-table-column prop="id" label="回调次数" align="center" />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  components: {},
  data() {
    return {
      currentPage: 1,
      total: 10,
      isVisible: false,
      tableData: [
        {
          id: 1498127107686797312,
          username: 'xql',
          status: 1
        },
        {
          id: 1455426709016678400,
          username: 'wangxp',
          status: 0
        },
        {
          id: 1447062267291897856,
          username: 'yaoting',
          status: 0
        }
      ],
      queryInfo: {
        page: 1,
        pageSize: 20,
        id: '',
        username: ''
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped lang="less">
.cb-container {
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
