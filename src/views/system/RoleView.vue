<template>
  <div class="cb-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-button icon="el-icon-plus" type="primary" @click="add()"
          >新增</el-button
        >
      </el-row>
    </el-card>
    <el-row>
      <el-col
        :xs="24"
        :sm="24"
        :md="16"
        :lg="16"
        :xl="17"
        style="margin-bottom: 10px"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
            border
            stripe
            :data="tableData"
            @current-change="handleRowChange"
            highlight-current-row
          >
            <el-table-column prop="name" label="名称" align="center" />
            <el-table-column prop="dataType" label="数据权限" align="center">
              <template slot-scope="scope">
                {{ scope.row.dataType | getDateTypeStr }}
              </template>
            </el-table-column>
            <el-table-column prop="level" label="角色级别" align="center" />
            <el-table-column label="操作" align="center">
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
            :page-sizes="[20, 50, 50]"
            :page-size="queryInfo.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-radio-group v-model="radio" @change="radioChange">
              <el-radio-button :label="1">菜单分配</el-radio-button>
              <el-radio-button :label="2">权限分配</el-radio-button>
            </el-radio-group>
            <el-button
              :disabled="!showButton"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveTree"
              >保存</el-button
            >
          </div>
          <el-tree
            ref="tree"
            :data="treeData"
            :default-checked-keys="treeSelectIds"
            :check-strictly='true'
            :props="defaultProps"
            show-checkbox
            highlight-current
            default-expand-all
            node-key="id"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7"> </el-col>
    </el-row>
    <RoleDialog
      :isVisible.sync="isVisible"
      :editId="editId"
      @updateList="getTableList"
    />
  </div>
</template>
<script>
import {
  list,
  deleteOne,
  detail,
  updateMenu,
  updatePermission
} from '@/api/role'
import { tree as menuTree } from '@/api/menu'
import { tree as permissionTree } from '@/api/permission'
import RoleDialog from './components/role-dialog.vue'
export default {
  name: 'MenuView',
  components: {
    RoleDialog
  },
  data() {
    return {
      defaultProps: { children: 'children', label: 'name' },
      total: 10,
      isVisible: false,
      editId: null,
      radio: 1,
      tableData: [],
      queryInfo: {
        current: 1,
        size: 20,
        currentId: null
      },
      showButton: false,
      treeData: [],
      menus: [],
      permissions: [],
      treeSelectIds: []
    }
  },
  async created() {
    await this.getTableList()
    await this.getMenu()
    await this.getPermission()
    this.radioChange(this.radio)
  },
  filters: {
    getDateTypeStr(dataType) {
      const text = dataType === 0 ? '全部' : dataType === 1 ? '本级' : '自定义'
      return text
    }
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
    async saveTree() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      if (this.radio === 1) {
        const res = await updateMenu({
          roleId: this.queryInfo.currentId,
          menuIds: checkedKeys
        })
        if (res.code === 200) {
          this.$message.success('更新成功')
        }
      } else {
        const res = await updatePermission({
          roleId: this.queryInfo.currentId,
          permissionIds: checkedKeys
        })
        if (res.code === 200) {
          this.$message.success('更新成功')
        }
      }
    },
    async getMenu() {
      const res = await menuTree()
      if (res.code === 200) {
        this.menus = res.data
      }
    },
    async getPermission() {
      const res = await permissionTree()
      if (res.code === 200) {
        this.permissions = res.data
      }
    },
    async getTableList() {
      const res = await list(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    radioChange(val) {
      this.radio = val
      if (val === 1) {
        this.treeData = this.menus
      } else {
        this.treeData = this.permissions
      }
      if (this.treeData && this.treeData.length > 0) {
        this.showButton = true
      }
      this.rowChange(this.queryInfo.currentId)
    },
    handleRowChange(row) {
      if (row === null) {
        return
      }
      this.queryInfo.currentId = row.id
      this.rowChange(row.id)
    },
    async rowChange(id) {
      const res = await detail({ id: id })
      if (res.code === 200 && res.data !== null) {
        if (this.radio === 1) {
          if (res.data.menuIds != null) {
            this.$refs.tree.setCheckedKeys(res.data.menuIds)
          } else {
            this.$refs.tree.setCheckedKeys([])
          }
        } else {
          if (res.data.permissionIds != null) {
            this.$refs.tree.setCheckedKeys(res.data.permissionIds)
          } else {
            this.$refs.tree.setCheckedKeys([])
          }
        }
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
