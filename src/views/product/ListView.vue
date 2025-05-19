<template>
  <div class="product-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="产品名称：">
          <el-input v-model="queryInfo.productName" placeholder="请输入产品名称" clearable/>
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-box">
      <el-row class="add-row">
        <el-button icon="el-icon-plus" type="primary" @click="add()">新增</el-button>
      </el-row>
      <el-table border stripe :data="tableData">
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="productCode" label="产品编号" align="center" />
        <el-table-column prop="productName" label="产品名称" align="center" />
        <el-table-column prop="desc" label="产品备注" align="center" />
        <el-table-column label="产品logo" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.logoUrl" width="75" height="75"/>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center" />
        <el-table-column label="是否推荐" align="center" >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.recommendFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="recommendFlag(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否上下架" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" @click="update(scope.row)">编辑</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-delete"
              icon-color="red"
              title="确定删除吗？" @confirm="deleteRow(scope.row)">
              <el-button icon="el-icon-delete" size="small" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
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

    <ProductDialog :isVisible.sync="isVisible" :editId="editId" @updateList="getTableList"/>
  </div>
</template>

<script>
import { list, deleteOne, changeState, recommendFlag } from '@/api/product'
import ProductDialog from './components/product-dialog.vue'

export default {
  name: 'ProductListView',
  components: {
    ProductDialog
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
        cateId: '',
        productCode: '',
        productName: '',
        state: ''
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
    async recommendFlag(row) {
      const res = await recommendFlag({ id: row.id, state: row.recommendFlag })
      if (res.code === 200) {
        this.getTableList()
      }
    },
    async getTableList() {
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
