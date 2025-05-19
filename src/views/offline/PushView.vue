<template>
  <div class="crm-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>线下管理</el-breadcrumb-item>
      <el-breadcrumb-item>API-推送管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="机构名称：">
          <el-input
            v-model="queryInfo.platformName"
            style="width: 190px"
            size="small"
            placeholder="请输入机构名称"
          />
        </el-form-item>
        <el-form-item label="规则名称：">
          <el-input
            v-model="queryInfo.ruleName"
            style="width: 190px"
            size="small"
            placeholder="请输入规则名称"
          />
        </el-form-item>
        <el-form-item label="推送类型：">
          <el-select v-model="queryInfo.platformType" style="width: 190px" clearable>
            <el-option v-for="option in typeOptions"
            :key="option.value"
            :label="option.name"
            :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="btn-item">
          <el-button icon="el-icon-search" type="primary" @click="getTableList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-row class="add-row">
        <el-button icon="el-icon-plus" type="primary" @click="add()"
          >新增</el-button
        >
      </el-row>
      <el-table border stripe :data="tableData">
        <el-table-column prop="id" label="规则序号" align="center" />
        <el-table-column prop="ruleName" label="规则名称" align="center" />
        <el-table-column label="推送类型" align="center">
          <template slot-scope="scope">
            <span> {{ scope.row.platformType==1?'推送' :'抢单' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platformName" label="平台名称" align="center" />
        <el-table-column prop="limitAmount" label="推送数量" align="center" />
        <el-table-column prop="price" label="单价" align="center" />
        <el-table-column label="推送状态" align="center">
           <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="180px">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              size="small"
              type="success"
              @click="update(scope.row)"
              >编辑</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="deleteRow(scope.row)"
            >
              <el-button icon="el-icon-delete" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[20, 50, 100]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <PushDialog :isVisible.sync="isVisible"
      :editId="editId"
      @update="getTableList()"/>
  </div>
</template>

<script>
import PushDialog from './components/push-dialog.vue'
import {
  list,
  deleteOne,
  changeState
} from '@/api/pushRule'
export default {
  name: 'PushView',
  components: {
    PushDialog
  },
  data() {
    return {
      total: 10,
      isVisible: false,
      editId: null,
      typeOptions: [
        {
          name: '推送',
          value: 1
        },
        {
          name: '抢单',
          value: 2
        }
      ],
      tableData: [],
      queryInfo: {
        current: 1,
        size: 20,
        crmName: '',
        ruleName: '',
        platformName: '',
        platformType: ''
      }
    }
  },
  mounted() {
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
    add() {
      this.isVisible = true
      this.editId = null
    },
    update(row) {
      this.isVisible = true
      this.editId = row.id
    },
    async deleteRow(row) {
      const res = await deleteOne({ id: row.id })
      if (res.code === 200) {
        this.getTableList()
      } else {
        this.$message.error(res.message)
      }
    },

    async changeState(row) {
      const res = await changeState({ id: row.id, state: row.state })
      if (res.code === 200) {
        this.getTableList()
      } else {
        this.$message.error(res.message)
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
.crm-container {
  .opt-box {
    margin-bottom: 20px;
    :deep(.el-card__body) {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn-item {
        margin-left: 30px;
      }
      .el-form-item {
        margin-bottom: 0;
        .el-form-item__label {
          font-size: 13px;
        }
      }
    }
  }

  :deep(.table-box) {
    th > div {
      font-size: 13px;
    }

    .add-row {
      margin-bottom: 20px;
    }
  }

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
