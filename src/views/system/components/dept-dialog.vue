<template>
  <el-dialog
    :visible="isVisible"
    title="新增部门"
    width="30%"
    @close="$emit('update:isVisible', false)"
  >
    <el-form label-width="90px">
      <el-form-item label="部门名称：">
        <el-input
          placeholder="请输入部门名称"
          style="width: 200px"
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item label="上级类目">
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
import { add, update, detail, list } from '@/api/dept'
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
        name: '',
        parentId: 0
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
      const res = await list()
      if (res.code === 200) {
        this.treeData = res.data
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
        name: '',
        parentId: 0
      }
    }
  }
}
</script>
