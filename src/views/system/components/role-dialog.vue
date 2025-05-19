<template>
  <el-dialog
    :visible="isVisible"
    title="新增角色"
    width="30%"
    @close="$emit('update:isVisible', false)"
  >
    <el-form label-width="90px">
      <el-form-item label="角色名称：">
        <el-input
          placeholder="请角色名称"
          style="width: 200px"
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item label="角色级别" :label-width="formLabelWidth">
        <el-input-number
          v-model="form.level"
          controls-position="right"
          :min="1"
          :max="10"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="数据范围" :label-width="formLabelWidth">
        <el-select
          v-model="form.dataType"
          placeholder="本级"
          @change="changeScope"
        >
          <el-option label="全部" :value="0"></el-option>
          <el-option label="本级" :value="1"></el-option>
          <el-option label="自定义" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="dataType"
        label="数据权限"
        :label-width="formLabelWidth"
      >
        <treeselect
          v-model="form.deptIds"
          :options="treeData"
          multiple
          style="width: 380px"
          placeholder="请选择"
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
import { add, update, detail } from '@/api/role'
import { tree } from '@/api/dept'
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
      treeData: [],
      formLabelWidth: '100px',
      form: {
        dataType: 0,
        deptIds: [],
        level: 0,
        name: ''
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
  computed: {
    dataType() {
      return this.form.dataType === 2
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
        dataType: 0,
        deptIds: [],
        level: 0,
        name: ''
      }
    }
  }
}
</script>
