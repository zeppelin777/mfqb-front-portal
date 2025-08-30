<template>
  <div class="al-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>进件日志统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <div class="form-row">
          <el-form-item label="手机号(MD5): ">
            <el-input
              v-model="queryInfo.md5Phone"
              placeholder="请输入手机号(MD5)"
            />
          </el-form-item>
          <el-form-item label="平台名称：">
            <el-input
              v-model="queryInfo.platformName"
              placeholder="请输入平台名称"
            />
          </el-form-item>
          <el-form-item label="结果：">
            <el-input v-model="queryInfo.result" placeholder="请选择结果" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="创建时间：">
            <el-date-picker
              v-model="queryInfo.queryTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <div class="btn-group-right">
            <el-form-item class="item-btn">
              <el-button icon="el-icon-search" size="small" type="primary" @click="fetchData()">
                查询
              </el-button>
            </el-form-item>
            <el-form-item class="item-btn">
              <el-button icon="el-icon-upload2" size="small" type="primary">
                导入
              </el-button>
            </el-form-item>
            <el-form-item class="item-btn">
              <el-button icon="el-icon-download" size="small" type="primary">
                导出
              </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="platformCode" label="平台代码" align="center" />
        <el-table-column prop="platformName" label="平台代码" align="center" />
        <el-table-column prop="md5Phone" label="手机号(MD5)" align="center" />
        <el-table-column prop="channelPrice" label="渠道价" align="center" />
        <el-table-column prop="ctime" label="创建时间" align="center" />
        <el-table-column prop="result" label="结果" align="center" />
        <el-table-column prop="source" label="渠道名" align="center" />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { queryLogsByCondition } from '@/api/applicationLogs'
export default {
  name: 'UserView',
  components: {},
  data() {
    return {
      value1: '',
      currentPage: 1,
      total: 10,
      isVisible: false,
      tableData: [],
      queryInfo: {
        current: 1,
        size: 20,
        phone: '',
        platformName: '',
        result: '',
        queryTime: ''
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    async fetchData() {
      await queryLogsByCondition(JSON.stringify(this.queryInfo)).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.al-container {
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
      .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .btn-group-right {
          margin-left: auto;
          display: flex;
          align-items: center;
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
