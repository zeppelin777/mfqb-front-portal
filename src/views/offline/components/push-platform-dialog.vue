<template>
  <el-dialog
    class="push-dialog-container"
    :visible="isVisible"
    title="新增"
    width="50%"
    @close="onClose"
  >
    <el-form label-width="130px">
      <el-form-item label="平台简称：">
        <el-input
          v-model="form.platformName"
          placeholder="请输入平台简称"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="公司名称：">
        <el-input
          v-model="form.companyName"
          placeholder="请输入公司名称"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="资金来源：">
        <el-input
          v-model="form.fundsSource"
          placeholder="请输入资金来源"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="客服电话：">
        <el-input
          v-model="form.consumerHotline"
          placeholder="请输入客服电话"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="所需资料：">
        <el-select
          v-model="form.requiredMaterials"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入所需资料"
          style="width: 300px"
        ></el-select>
      </el-form-item>
      <el-form-item label="申请条件：">
        <el-select
          v-model="form.applyCondition"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入申请条件"
          style="width: 300px"
        ></el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { add, update, detail } from '@/api/pushPlatform'

export default {
  name: 'PushPlatformInfoDialog',
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
        applyCondition: [],
        companyName: '',
        consumerHotline: '',
        fundsSource: '',
        platformName: '',
        requiredMaterials: []
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
  mounted() {},
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
        applyCondition: [],
        companyName: '',
        consumerHotline: '',
        fundsSource: '',
        platformName: '',
        requiredMaterials: []
      }
    }
  }
}
</script>

<style scoped lang="less">
.push-dialog-container {
  .fields-box {
    margin: 0 20px;
    // padding: 5px 25px 20px;
    border-bottom: 1px solid #eee;
  }

  .rules-box {
    margin: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    h3 {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    p {
      padding-left: 10px;
      margin: 15px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      color: #3296fa;
    }

    .rule-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      .left,
      .center,
      .right {
        flex: 1;
      }
    }

    .plus-wrap {
      margin-top: 15px;
      margin-left: 10px;
      margin-bottom: 20px;
    }
  }

  .optional-ipt {
    display: inline-block;
    margin-left: 50px;
    .el-input {
      width: 140px;
    }
    span {
      margin: 0 10px;
    }
  }

  :deep(.el-dialog__footer) {
    text-align: center;
  }
}
</style>
