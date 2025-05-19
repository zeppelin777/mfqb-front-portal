<template>
  <el-dialog
    :visible="isVisible"
    title="新增用户"
    width="30%"
    @close="$emit('update:isVisible', false)"
  >
    <el-form label-width="90px">
      <el-form-item label="用户名：">
        <el-input
          placeholder="请输入用户名"
          style="width: 200px"
          v-model="form.userName"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="editId === null">
        <el-input v-model="form.password" placeholder="请输入密码" width="150"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" :label-width="formLabelWidth">
        <treeselect
          v-model="form.deptId"
          :options="depts"
          style="width: 380px"
          placeholder="请选择部门"
          :normalizer="normalizer"
        />
      </el-form-item>
      <el-form-item label="所属角色" >
        <el-select v-model="form.roleId" placeholder="请选择角色">
            <el-option
                  v-for="item in roles"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { add, update, detail } from '@/api/adminuser'
import { tree as deptTree } from '@/api/dept'
import { all as roleAll } from '@/api/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'RoleDialog',
  components: {
    Treeselect
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    editId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      depts: [],
      roles: [],
      level: 3,
      formLabelWidth: '100px',
      form: {
        deptId: null,
        password: '',
        roleId: '',
        userName: ''
      }
    }
  },
  watch: {
    isVisible: async function (newVal, oldVal) {
      if (this.isVisible) {
        if (this.editId) {
          const res = await detail({ id: this.editId })
          if (res.code === 200) {
            this.form = res.data
          }
        }
        this.getData()
      }
    }
  },
  methods: {
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    async getData() {
      let res = await deptTree()
      if (res.code === 200) {
        this.depts = res.data
      }
      res = await roleAll()
      if (res.code === 200) {
        this.roles = res.data
      }
    },
    async add() {
      const res = await add(this.form)
      if (res.code === 200) {
        this.onClose()
      } else {
        this.$message.error(res.message)
      }
    },
    async update() {
      this.form.id = this.editId
      const res = await update(this.form)
      if (res.code === 200) {
        this.onClose()
      } else {
        this.$message.error(res.message)
      }
    },
    changeScope(val) {
      if (val !== 2) {
        this.form.deptIds = []
      }
    },
    submit() {
      if (this.editId) {
        this.update()
      } else {
        this.add()
      }
    },
    onClose() {
      this.resetForm()
      this.$emit('update:isVisible', false)
      this.$emit('updateList')
    },
    resetForm() {
      this.form = {
        deptId: 0,
        password: '',
        roleId: 0,
        userName: ''
      }
    }
  }
}
</script>
