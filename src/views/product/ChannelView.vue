<template>
  <div class="channel-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>渠道列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="渠道编号：">
          <el-input
            v-model="queryInfo.channelCode"
            placeholder="请输入渠道编号"
          />
        </el-form-item>
        <el-form-item label="渠道名称：">
          <el-input
            v-model="queryInfo.channelName"
            placeholder="请输入渠道名称"
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
        <el-table-column prop="id" label="序号" align="center" />
        <el-table-column prop="channelCode" label="渠道编号" align="center" />
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="channelUrl" label="渠道链接" align="center" />
        <el-table-column prop="priceTypeStr" label="价格类型" align="center" />
        <el-table-column prop="deductRate" label="扣量比例" align="center" />
        <el-table-column prop="price" label="单价" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否走进件" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.collectFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeCollectFlag(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="后台地址" align="center">
          <template slot-scope="scope">
            <span>地址：{{ scope.row.channelSystemUrl }}</span
            ><br />
            <span>账号：{{ scope.row.channelCode }}</span
            ><br />
            <span>密码：{{ scope.row.password }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessName" label="关联商务" align="center" />
        <el-table-column label="操作" align="center" width="190px">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              @click="update(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-delete"
              icon-color="red"
              title="确定删除吗？"
              @confirm="deleteRow(scope.row)"
            >
              <el-button
                icon="el-icon-delete"
                size="small"
                type="danger"
                slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
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

    <ChannelDialog
      :isVisible.sync="isVisible"
      :editId="editId"
      @updateList="getTableList"
    />
  </div>
</template>

<script>
import { list, deleteOne, changeState, changeCollectFlag } from '@/api/channel'
import ChannelDialog from './components/channel-dialog.vue'

export default {
  name: 'ProductListView',
  components: {
    ChannelDialog
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
        channelCode: '',
        channelName: ''
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
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
      }
    },
    async changeCollectFlag(row) {
      const res = await changeCollectFlag({
        id: row.id,
        state: row.collectFlag
      })
      if (res.code === 200) {
        this.getTableList()
      }
    },
    async getTableList() {
      this.editId = null
      const res = await list(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
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
.channel-container {
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
    .add-row {
      margin-bottom: 20px;
    }
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
