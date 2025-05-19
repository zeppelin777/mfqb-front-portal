<template>
  <div class="crm-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>线下管理</el-breadcrumb-item>
      <el-breadcrumb-item>API-CRM管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="crm名称：">
          <el-input v-model="queryInfo.crmName" placeholder="请输入用户名" clearable/>
        </el-form-item>
        <el-form-item>
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
        <el-table-column prop="id" label="编号" align="center" />
        <el-table-column prop="crmName" label="名称" align="center" />
        <el-table-column prop="companyName" label="关联公司" align="center" />
        <el-table-column label="是否共享" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.shareFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeShareFlag(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" align="center" />
        <el-table-column label="推送状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changePushState(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="是否延迟推送" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.delayFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeDelayFlag(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalConsumeTimes"
          label="总消耗次数"
          align="center"
        />
        <el-table-column
          prop="totalConsumeAmount"
          label="总消耗金额"
          align="center"
        />
        <el-table-column prop="ctime" label="创建时间" align="center" />
        <el-table-column label="操作" width="190" align="center">
          <template slot-scope="scope">
            <div style="display: flex; flex-direction: column">
              <el-button
                icon="el-icon-edit"
                type="primary"
                @click="update(scope.row)"
                >修改</el-button
              >
              <el-button
                style="margin-top: 10px; margin-left: 0"
                type="primary"
                @click="openSwitchInfo(scope.row)"
                >查看开关信息</el-button
              >
              <el-popconfirm
                title="确认删除吗？"
                icon-color="red"
                @confirm="deleteRow(scope.row)"
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
        :page-sizes="[20, 50, 100]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <CrmDialog
      :isVisible.sync="isVisible"
      :editId="editId"
      @update="getTableList()"
    />
    <CrmSwitchDialog
      :isVisible.sync="showSwitchInfo"
      :crmPlatformId="switchInfo.crmPlatformId"
      :crmPlatformName="switchInfo.crmPlatformName"
    />
    <el-dialog
      title="提示"
      :visible.sync="chargeVisible"
      width="30%"
      @close="closeChrage"
      >
      <el-form>
        <el-form-item label="充值金额：">
          <el-input-number v-model="chargeForm.chargeAmount" style="width: 180px" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeChrage">取 消</el-button>
        <el-button type="primary" @click="submitCharge">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CrmDialog from './components/crm-dialog.vue'
import CrmSwitchDialog from './components/crm-switch-info.vue'

import {
  list,
  deleteOne,
  changeLoginState,
  changePushState,
  changeShareFlag,
  changeDelayFlag,
  charge
} from '@/api/crm'
export default {
  name: 'CrmView',
  components: {
    CrmDialog,
    CrmSwitchDialog
  },
  data() {
    return {
      total: 10,
      isVisible: false,
      editId: null,
      tableData: [],
      queryInfo: {
        current: 1,
        size: 20,
        crmName: ''
      },
      chargeVisible: false,
      showSwitchInfo: false,
      switchInfo: {
        crmPlatformId: null,
        crmPlatformName: ''
      },
      chargeForm: {
        crmId: '',
        chargeAmount: ''
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
    openSwitchInfo(row) {
      this.showSwitchInfo = true
      this.switchInfo.crmPlatformId = row.id
      this.switchInfo.crmPlatformName = row.crmName
    },
    async changePushState(row) {
      const res = await changePushState({ id: row.id, state: row.state })
      if (res.code === 200) {
        this.getTableList()
      } else {
        this.$message.error(res.message)
      }
    },
    async changeLoginState(row) {
      const res = await changeLoginState({ id: row.id, state: row.locked })
      if (res.code === 200) {
        this.getTableList()
      } else {
        this.$message.error(res.message)
      }
    },
    async changeShareFlag(row) {
      const res = await changeShareFlag({ id: row.id, state: row.shareFlag })
      if (res.code === 200) {
        this.getTableList()
      } else {
        this.$message.error(res.message)
      }
    },
    async changeDelayFlag(row) {
      const res = await changeDelayFlag({ id: row.id, state: row.delayFlag })
      if (res.code === 200) {
        this.getTableList()
      } else {
        this.$message.error(res.message)
      }
    },
    charge(row) {
      this.chargeForm.crmId = row.id
      this.chargeVisible = true
    },
    handleSizeChange(val) {
      this.queryInfo.size = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.queryInfo.current = val
      this.getTableList()
    },
    closeChrage() {
      this.chargeForm = {
        crmId: '',
        chargeAmount: ''
      }
      this.chargeVisible = false
    },
    async submitCharge() {
      const res = await charge(this.chargeForm)
      if (res.code === 200) {
        this.closeChrage()
        this.getTableList()
      } else {
        this.$message.error(res.message)
      }
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
      .item-btn {
        display: inline-block;
        margin-left: 25px;
      }
      .el-form-item {
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
