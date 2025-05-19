<template>
  <el-dialog
    :visible="isVisible"
    :title="form.id ? '编辑api全流程渠道信息' : '新增api全流程渠道信息'"
    width="30%"
    @close="$emit('update:isVisible', false)"
  >
    <el-form v-model="form" label-width="140px">
      <el-form-item label="渠道名称：">
        <el-input
          placeholder="渠道名称"
          style="width: 200px"
          v-model="form.channelName"
        />
      </el-form-item>
      <el-form-item label="渠道编码：">
        <el-input
          placeholder="渠道编码"
          style="width: 200px"
          v-model="form.channelCode"
        />
      </el-form-item>
      <el-form-item label="渠道类型：">
        <el-select
          v-model="form.channelType"
          placeholder="请选择渠道类型："
          style="width: 200px"
        >
          <el-option
            v-for="item in channelTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单价：">
        <el-input
          placeholder="单价"
          style="width: 200px"
          v-model="form.price"
        />
      </el-form-item>
      <el-form-item label="模式：">
        <el-radio-group v-model="form.model">
          <el-radio :label="true">固定价格</el-radio>
          <el-radio :label="false">分润</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分成比例：">
        <el-input
          placeholder="分成比例"
          style="width: 200px"
          v-model="form.percent"
        />
      </el-form-item>
      <el-form-item label="最低价格开关：">
        <el-switch v-model="form.lowFlag" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item label="渠道开关">
        <el-switch v-model="form.channelSwitch" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item label="最低价格(分润后)：">
        <el-input-number :disabled="!form.lowFlag" placeholder="最低价格" style="width: 200px;" v-model="form.lowPrice" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="扣量开关：">
        <el-switch v-model="form.tollFlag" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item label="扣量比例：">
        <el-input-number :disabled="!form.tollFlag" style="width: 200px" v-model="form.tollPercent" :precision="2" :step="0.01" :min="0" :max="1"></el-input-number>
      </el-form-item>
      <el-form-item label="关联商务：">
        <el-select
          v-model="form.businessId"
          placeholder="请选择"
          style="width: 200px"
        >
          <el-option
            v-for="item in businessInfoList"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回调地址：">
        <el-input
          placeholder="回调地址"
          style="width: 200px"
          v-model="form.callBackUrl"
        />
      </el-form-item>
      <el-form-item label="回跳地址：">
        <el-input
          placeholder="回跳地址"
          style="width: 200px"
          v-model="form.knockOnUrl"
        />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          placeholder="备注"
          style="width: 200px"
          v-model="form.remark"
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
import { apiChannelAdd } from '@/api/channel'
import { fetchGetBusinessInfo } from '@/api/product'
import { min } from 'moment';
export default {
  name: 'CateDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    editInfo: {
      type: Object,
      default: {}
    }
    // editId: {
    //   type: Number,
    //   default: null
    // }
  },
  data() {
    return {
      businessInfoList:[],
      channelTypeList: [
        { id: 1, name: '全流程' },
        { id: 2, name: '半流程' },
        { id: 3, name: 'UV' },
        { id: 4, name: '其他' }
      ],
      form: {
        channelName: '',
        channelCode: '',
        channelType: '',
        price: '',
        model: '',
        percent: '',
        lowFlag: false,
        channelSwitch: 1,
        lowPrice: 0,
        tollFlag: false,
        tollPercent: 1,
        businessId: '',
        businessName: '',
        callBackUrl: '',
        knockOnUrl: '',
        remark: ''
      }
    }
  },
  watch: {
    isVisible: async function (newVal, oldVal) {
      if (this.isVisible) {
        const businessInfoRes = await fetchGetBusinessInfo()
        if (businessInfoRes.code == 200) {
          this.businessInfoList = businessInfoRes.data
        }
      }
    },
    editInfo: async function (newVal, oldVal) {
      this.form = newVal
    }
  },
  methods: {
    async add() {
      const res = await apiChannelAdd(this.form)
      if (res.code === 200) {
        this.onClose()
      } else {
        this.$message.error(res.message)
      }
    },
    async update() {
      let formData = {
        id: this.form.id,
        channelName: this.form.channelName,
        channelCode: this.form.channelCode,
        price: this.form.price,
        model: this.form.model,
        percent: this.form.percent,
        businessId: this.form.businessId,
        businessName: this.form.businessName,
        remark: this.form.remark,
        lowFlag: this.form.lowFlag,
        lowPrice: this.form.lowPrice,
        tollFlag: this.form.tollFlag,
        tollPercent: this.form.tollPercent,
        channelSwitch: this.form.channelSwitch,
        callBackUrl: this.form.callBackUrl,
        knockOnUrl: this.form.knockOnUrl,
      }
      const res = await apiChannelAdd(formData)
      if (res.code === 200) {
        this.onClose()
        this.$message.success('编辑成功～')
      } else {
        this.$message.error(res.message)
      }
    },
    submit() {
      console.log(this.editId)
      this.businessInfoList.map((item) => {
        if (item.id == this.form.businessId) {
          this.form.businessName = item.userName
        }
      })
      if (this.editInfo.id) {
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
