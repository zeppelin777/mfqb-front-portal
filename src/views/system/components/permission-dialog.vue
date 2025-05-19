<template>
  <el-dialog
    :visible="isVisible"
    title="新增权限"
    width="30%"
    @close="$emit('update:isVisible', false)"
  >
    <el-form label-width="90px">
      <el-form-item label="权限名称：">
        <el-input
          placeholder="请输入权限名称"
          style="width: 200px"
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item label="别名：">
        <el-input
          placeholder="请输入别名:"
          v-model="form.alias"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="排序：">
        <el-input-number v-model="form.sort" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="上级类目" prop="pid">
        <treeselect
          v-model="form.parentId"
          :options="treeData"
          style="width: 250px"
          placeholder="选择上级类目"
          :normalizer="normalizer"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { add, update, detail, tree } from '@/api/permission'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'PermissionDialog',
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
      treeData: [],
      form: {
        alias: '',
        name: '',
        parentId: 0,
        sort: 0
      },
      defaultProps: {
        id: 'id',
        children: 'children',
        label: 'name'
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
        this.treeList()
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
    async treeList() {
      const res = await tree()
      if (res.code === 200) {
        this.treeData = []
        const menu = { id: 0, name: '顶级类目', children: [] }
        menu.children = res.data
        this.treeData.push(menu)
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
        alias: '',
        name: '',
        parentId: 0,
        sort: 0
      }
    }
  }
}
</script>
