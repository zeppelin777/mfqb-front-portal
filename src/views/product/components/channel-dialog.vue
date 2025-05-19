<template>
  <el-dialog
    class="channel-dialog"
    :visible="isVisible"
    title="新增渠道"
    width="60%"
    height="75%"
    @close="closeModel"
  >
    <el-form label-width="150px">
      <el-form-item label="渠道编号：">
        <el-input
          placeholder="请输入渠道编号"
          v-model="form.channelCode"
          style="width: 170px"
          :readonly="true"
        />
        &nbsp;&nbsp;<el-button @click="generateCode" v-if="form.id == null"
          >一键生成</el-button
        >
      </el-form-item>
      <el-form-item label="渠道名称：">
        <el-input
          placeholder="请输入渠道名称"
          v-model="form.channelName"
          style="width: 170px"
        />
      </el-form-item>
      <el-form-item label="渠道单价：">
        <el-input
          placeholder="请输入渠道单价"
          v-model="form.price"
          type="number"
          style="width: 170px"
        />
      </el-form-item>
      <el-form-item label="扣量比例(例0.3)：">
        <el-input-number
          placeholder="0.3"
          v-model="form.deductRate"
          :min="0"
          :max="1"
          type="number"
          style="width: 170px"
        />
      </el-form-item>
      <el-form-item label="结算方式类型：">
        <el-select
          v-model="form.priceType"
          placeholder="请选择"
          style="width: 170px"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否走进件：">
        <el-radio v-model="form.collectFlag" :label="true">是</el-radio>
        <el-radio v-model="form.collectFlag" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="是否审核：">
        <el-radio v-model="form.checkFlag" :label="true">是</el-radio>
        <el-radio v-model="form.checkFlag" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="是否启用：">
        <el-radio v-model="form.state" :label="true">是</el-radio>
        <el-radio v-model="form.state" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="登录账号：">
        <el-input
          placeholder="登录账号"
          v-model="form.channelCode"
          style="width: 170px"
          readonly
        />
      </el-form-item>
      <el-form-item label="登录密码：">
        <el-input
          placeholder="登录密码"
          v-model="form.password"
          style="width: 170px"
        />
      </el-form-item>
      <el-form-item label="关联产品类别：">
        <el-select v-model="form.cateIds" :multiple="true" placeholder="请选择">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="roi比例">
        <el-input
          v-model="form.roi"
          style="width: 170px"
          placeholder="roi比例"
        />
      </el-form-item>
      <el-form-item label="关联商务：">
        <el-select
          v-model="form.businessId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in businessInfoList"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
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
import { add, update, detail } from '@/api/channel'
import { categories, fetchGetBusinessInfo } from '@/api/product'
export default {
  name: 'ChannelDialog',
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
      categories: [],
      businessInfoList: [],
      typeOptions: [
        {
          name: 'uv',
          value: 1
        },
        {
          name: '注册',
          value: 2
        },
        {
          name: '进件',
          value: 3
        },
        {
          name: '借款',
          value: 4
        },
        {
          name: '下载APP',
          value: 5
        }
      ],
      form: {
        channelCode: '',
        channelName: '',
        channelUrl: '',
        collectFlag: true,
        deductRate: '',
        price: '',
        priceType: '',
        state: true,
        password: '',
        cateIds: [],
        checkFlag: false,
        roi: '',
        businessId: '',
        businessName: ''
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
        const cateRes = await categories()
        if (cateRes.code === 200) {
          this.categories = cateRes.data
        }

        const businessInfoRes = await fetchGetBusinessInfo()
        if (businessInfoRes.code == 200) {
          this.businessInfoList = businessInfoRes.data
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
    generateCode() {
      const str = Math.random().toString(36).slice(-6)
      this.form.channelCode = str
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
      this.businessInfoList.map((item) => {
        if (item.id == this.form.businessId) {
          this.form.businessName = item.userName
        }
      })
      if (this.editId) {
        this.update()
      } else {
        this.add()
      }
    },
    closeModel() {
      this.resetForm()
      this.$emit('update:isVisible', false)
    },
    onClose() {
      this.resetForm()
      this.$emit('update:isVisible', false)
      this.$emit('updateList')
    },
    resetForm() {
      this.form = {
        channelCode: '',
        channelName: '',
        channelUrl: '',
        collectFlag: true,
        deductRate: '',
        price: '',
        priceType: '',
        state: true,
        password: '',
        cateIds: [],
        checkFlag: false,
        roi: ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-dialog {
  .el-form {
    // display: flex;
    // flex-wrap: wrap;
    :deep(.el-form-item__label) {
      font-size: 13px;
    }

    :deep(.desc-item) {
      display: flex;
      width: 100%;
      .el-form-item__content {
        width: 70%;
        textarea {
          height: 120px;
        }
      }
    }
  }
}
</style>
