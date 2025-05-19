<template>
  <div class="product-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>api渠道管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="渠道名称：">
          <el-input
            v-model="queryInfo.channelName"
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
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="channelCode" label="渠道编码" align="center" />
        <el-table-column prop="price" label="单价" align="center" />
        <el-table-column prop="model" label="模式" align="center">
          <template slot-scope="{ row }">
            <div v-if="row.model">固定价格</div>
            <div v-if="!row.model">分润</div>
          </template>
        </el-table-column>
        <el-table-column prop="percent" label="分成比例" align="center" />
        <el-table-column prop="lowPrice" label="最低价格(分润后)" align="center" width="130" />
        <el-table-column prop="lowFlag" label="最低价格开关" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.lowFlag">已开启</el-tag>
            <el-tag v-else>已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tollPercent" label="扣量比例" align="center" />
        <el-table-column prop="tollFlag" label="扣量开关" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.tollFlag">已开启</el-tag>
            <el-tag v-else>已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tollFlag" label="渠道开关" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.channelSwitch == 1">已开启</el-tag>
            <el-tag v-else>已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ctime" label="创建时间" align="center" width="160" />
        <el-table-column prop="businessName" label="关联商务" align="center" />
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.remark == 'api全流程'" type="success">{{ scope.row.remark }}</el-tag>
            <el-tag v-if="scope.row.remark == 'h5渠道'">{{ scope.row.remark }}</el-tag>
            <el-tag v-if="scope.row.remark == 'api半流程'" type="danger">{{ scope.row.remark }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              style="width: 100%; margin-bottom: 10px"
              @click="editInfo(scope.row)"
              >编辑</el-button
            >
            <el-button
              icon="el-icon-edit"
              type="primary"
              style="width: 100%; margin: 0"
              @click="showApiChannel(scope.row)"
              >查看详情</el-button
            >
            <!-- <el-button icon="el-icon-edit" type="primary" @click="update(scope.row)">查看详情</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-delete"
              icon-color="red"
              title="确定删除吗？" @confirm="deleteRow(scope.row)">
              <el-button icon="el-icon-delete" size="small" type="danger" slot="reference">删除</el-button>
            </el-popconfirm> -->
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

    <!-- :editId="editId" -->
    <apiChnnelDialog
      :isVisible.sync="isVisible"
      :editInfo="editData"
      @update="getTableList()"
    />

    <channelDetailDialog
      :isVisible.sync="detailVisible"
      :detailData="detailData"
      @update="getTableList()"
    />
  </div>
</template>

<script>
import { apiChannelList, deleteOne } from '@/api/channel'
import apiChnnelDialog from './components/apiChnnel-dialog.vue'
import channelDetailDialog from './components/channel-detailList.vue'

export default {
  name: 'UserView',
  components: {
    apiChnnelDialog,
    channelDetailDialog
  },
  data() {
    return {
      total: 10,
      isVisible: false,
      tableData: [],
      editId: null,
      queryInfo: {
        current: 1,
        size: 20,
        channelName: ''
      },
      editData: {},
      detailData: '',
      detailVisible: false
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    showApiChannel(data) {
      this.detailData = data
      this.detailVisible = true
    },
    editInfo(row) {
      this.editData = row
      this.isVisible = true
    },
    add() {
      this.editData = {}
      this.isVisible = true
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
    async getTableList() {
      const res = await apiChannelList(this.queryInfo)
      console.log(res)
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
