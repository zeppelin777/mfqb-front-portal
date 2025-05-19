<template>
  <el-dialog
    class="prod-dialog"
    title="添加产品"
    :visible="isVisible"
    width="60%"
    height="75%"
    @close="
      () => {
        resetForm()
        $emit('update:isVisible', false)
      }
    "
  >
    <el-form label-width="130px">
      <div class="left">
        <el-form-item label="类型：">
          <el-radio v-model="form.type" :label="1">uv</el-radio>
          <el-radio v-model="form.type" :label="2">联登</el-radio>
        </el-form-item>
        <el-form-item label="产品编号：">
          <el-input
            style="width: 150px"
            placeholder="请输入产品编号"
            v-model="form.productCode"
            :readonly="form.type == 1 ? true : false"
          />
          &nbsp;&nbsp;<el-button
            @click="generateCode"
            v-if="form.id == null && form.type != 2"
            >一键生成</el-button
          >
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input
            style="width: 300px"
            placeholder="请输入产品名称"
            v-model="form.productName"
          />
        </el-form-item>
        <el-form-item label="产品备注：">
          <el-input
            style="width: 300px"
            placeholder="请输入产品备注"
            v-model="form.desc"
          />
        </el-form-item>
        <el-form-item label="申请人数：">
          <el-input-number
            style="width: 150px"
            placeholder="请输入申请人数"
            v-model="form.applyNum"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number
            style="width: 150px"
            placeholder="请输入排序序号"
            v-model="form.sort"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="借款金额范围(元)：" class="money-item">
          <el-input
            style="width: 130px"
            v-model="form.minPrincipal"
            type="number"
          />
          <span>至</span>
          <el-input
            style="width: 130px"
            v-model="form.maxPrincipal"
            type="number"
          />
        </el-form-item>
        <el-form-item label="限量：">
          <el-input-number v-model="form.limitAmount" :min="-1" />
          <span style="color: red">*(-1不限量)</span>
        </el-form-item>
        <el-form-item label="产品地址：">
          <el-input
            placeholder="请输入产品地址"
            v-model="form.productUrl"
            type="url"
          />
        </el-form-item>
        <el-form-item label="是否推荐：">
          <el-radio v-model="form.recommendFlag" :label="true">是</el-radio>
          <el-radio v-model="form.recommendFlag" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否上架：">
          <el-radio v-model="form.state" :label="true">是</el-radio>
          <el-radio v-model="form.state" :label="false">否</el-radio>
        </el-form-item>
        <template v-if="form.type == 2">
          <el-form-item label="注册地址：">
            <el-input
              placeholder="请输入注册地址"
              v-model="form.zcUrl"
              type="url"
            />
          </el-form-item>
          <el-form-item label="域名：">
            <el-input placeholder="请输入域名" v-model="form.url" type="url" />
          </el-form-item>
          <el-form-item label="联登撞库地址：">
            <el-input
              placeholder="请输入联登撞库地址"
              v-model="form.ldUrl"
              type="url"
            />
          </el-form-item>
          <el-form-item label="渠道码：">
            <el-input
              placeholder="请输入渠道码"
              v-model="form.extendCode"
              type="url"
            />
          </el-form-item>
          <el-form-item label="密钥：">
            <el-input
              placeholder="请输入密钥"
              v-model="form.appSecret"
              type="url"
            />
          </el-form-item>
        </template>
        <!-- 推送星期 -->
        <el-form-item label="推送星期：">
          <el-checkbox-group v-model="form.weekList">
            <el-checkbox :label="2">星期一</el-checkbox>
            <el-checkbox :label="3">星期二</el-checkbox>
            <el-checkbox :label="4">星期三</el-checkbox>
            <el-checkbox :label="5">星期四</el-checkbox>
            <el-checkbox :label="6">星期五</el-checkbox>
            <el-checkbox :label="7">星期六</el-checkbox>
            <el-checkbox :label="1">星期日</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="推送时间：" class="push-time">
          <el-radio-group v-model="form.allDay">
            <el-radio :label="true">全天</el-radio>
            <el-radio :label="false">非全天</el-radio>
          </el-radio-group>
          <div class="optional-ipt" v-if="form.allDay == false">
            <el-time-picker
              v-model="form.startTime"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
                format: 'HH:mm:ss'
              }"
              placeholder="开始时间"
            >
            </el-time-picker>
            ~
            <el-time-picker
              v-model="form.endTime"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
                format: 'HH:mm:ss'
              }"
              placeholder="结束时间"
            >
            </el-time-picker>
          </div>
        </el-form-item>
      </div>
      <div class="right">
        <el-form-item label="产品logo：">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="string"
            accept="image/jpeg,image/png,image/jpg"
            :http-request="uploadFile"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="期数范围(月)：" class="scope-item">
          <el-input
            style="width: 80px"
            v-model="form.minPeriods"
            type="number"
          />
          <span>至</span>
          <el-input
            style="width: 80px"
            v-model="form.maxPeriods"
            type="number"
          />
        </el-form-item>
        <el-form-item label="日利率(%)：">
          <el-input
            style="width: 100px"
            placeholder="日利率"
            v-model="form.interestRate"
            type="number"
          />
        </el-form-item>
        <el-form-item label="产品类型：">
          <el-select
            v-model="form.cateIds"
            :multiple="true"
            placeholder="请选择"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品标签：">
          <el-select v-model="form.tag" placeholder="请选择">
            <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input
            style="width: 100px"
            placeholder="价格"
            v-model="form.price"
            type="number"
          />
        </el-form-item>
        <el-form-item label="后台地址：">
          <el-input
            placeholder="后台地址"
            v-model="form.productAdminUrl"
            type="url"
          />
        </el-form-item>
        <el-form-item label="账号：">
          <el-input
            style="width: 150px"
            placeholder="账号"
            v-model="form.productAdminUsername"
          />
          密码：<el-input
            style="width: 150px"
            placeholder="密码"
            v-model="form.productAdminPassword"
          />
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { add, update, detail, categories } from '@/api/product'
import { upload } from '@/api/file'
export default {
  name: 'ProductDialog',
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
      categoryOptions: [],
      tagOptions: [
        {
          name: '爆款',
          value: '爆款'
        },
        {
          name: '热门',
          value: '热门'
        },
        {
          name: '门槛低',
          value: '门槛低'
        }
      ],
      form: {
        applyNum: 300,
        cateIds: [],
        interestRate: '',
        limitAmount: -1,
        logoUrl: '',
        maxPeriods: '',
        maxPrincipal: '',
        minPeriods: '',
        minPrincipal: '',
        price: '',
        productAdminPassword: '',
        productAdminUrl: '',
        productAdminUsername: '',
        productCode: '',
        productName: '',
        productUrl: '',
        recommendFlag: true,
        sort: 0,
        state: true,
        tag: '',
        type: 1,
        zcUrl: '',
        url: '',
        ldUrl: '',
        extendCode: '',
        appSecret: '',
        weekList: [],
        startTime: null,
        endTime: null,
        allDay: false,
        desc: ''
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
        const res = await categories()
        if (res.code === 200) {
          this.categoryOptions = res.data
        }
      }
    }
  },
  methods: {
    generateCode() {
      const str = Math.random().toString(36).slice(-6)
      this.form.productCode = str
    },
    async add() {
      console.log(this.form)
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
    async uploadFile(param) {
      const res = await upload(param.file)
      if (res.code === 200) {
        this.form.logoUrl = res.data
      }
    },
    onClose() {
      this.resetForm()
      this.$emit('update:isVisible', false)
      this.$emit('updateList')
    },
    resetForm() {
      this.form = {
        applyNum: 300,
        cateIds: [],
        interestRate: '',
        limitAmount: -1,
        logoUrl: '',
        maxPeriods: '',
        maxPrincipal: '',
        minPeriods: '',
        minPrincipal: '',
        price: '',
        productAdminPassword: '',
        productAdminUrl: '',
        productAdminUsername: '',
        productCode: '',
        productName: '',
        productUrl: '',
        recommendFlag: true,
        sort: 0,
        state: true,
        tag: '',
        type: 1,
        zcUrl: '',
        url: '',
        ldUrl: '',
        extendCode: '',
        appSecret: '',
        weekList: [],
        startTime: null,
        endTime: null,
        allDay: false,
        desc: ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.prod-dialog {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    :deep(.el-form-item__label) {
      font-size: 13px;
    }

    .left {
      flex: 1;
      .money-item {
        span {
          margin: 0 10px;
        }
      }
    }

    .right {
      flex: 1;
      .logo-img {
        width: 125px;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 5px;
      }
      .scope-item {
        span {
          margin: 0 10px;
        }
      }
    }

    .time-box {
      display: flex;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
}

.optional-ipt {
  display: inline-block;
  .el-input {
    width: 140px;
  }
  span {
    margin: 0 10px;
  }
}
</style>
