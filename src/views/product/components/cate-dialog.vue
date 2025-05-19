<template>
  <el-dialog :visible="isVisible" title="新增类别" width="30%" @close="$emit('update:isVisible', false)">
    <el-form label-width="90px">
      <el-form-item label="产品类别：">
        <el-input placeholder="请输入产品类别" style="width: 200px" v-model="form.categoryName"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { add, update, detail } from '@/api/category'
export default {
  name: 'CateDialog',
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
      form: {
        categoryName: ''
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
      }
    }
  },
  methods: {
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
      console.log(this.editId)
      if (this.editId) {
        this.update()
      } else {
        this.add()
      }
    },
    onClose() {
      this.resetForm()
      this.$emit('update:isVisible', false)
      this.$emit('update')
    },
    resetForm() {
      this.form = {
        categoryName: ''
      }
    }
  }
}
</script>
