<template>
  <el-dialog
    :visible="isVisible"
    title="新增菜单"
    width="40%"
    @close="$emit('update:isVisible', false)"
  >
    <el-form label-width="90px">
      <el-form-item label="菜单名称：">
        <el-input
          placeholder="请输入菜单名称"
          style="width: 200px"
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="500"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>

      <el-form-item label="路由地址：">
        <el-input
          placeholder="请输入路由地址:"
          v-model="form.path"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="组件路径：">
        <el-input
          placeholder="请输入组件路径:"
          v-model="form.component"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="上级类目" prop="parentId">
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
import { add, update, detail, tree } from '@/api/menu'
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'PermissionDialog',
  components: {
    Treeselect,
    IconSelect
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
        component: '',
        icon: '',
        name: '',
        parentId: 0,
        path: '',
        sort: 0
      },
      defaultProps: {
        id: 'id',
        children: 'children',
        label: 'alias'
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
    // 选中图标
    selected(name) {
      this.form.icon = name
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
        component: '',
        icon: '',
        name: '',
        parentId: 0,
        path: '',
        sort: 0
      }
    }
  }
}
</script>
