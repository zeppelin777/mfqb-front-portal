<template>
  <el-dialog
    class="push-dialog-container"
    :visible="isVisible"
    title="新增"
    width="60%"
    @close="onClose"
  >
    <el-form inline label-width="130px">
      <div class="fields-box">
        <div class="top-left">
          <el-form-item label="规则名称：">
            <el-input v-model="form.ruleName"/>
          </el-form-item>
          <el-form-item label="单价：">
            <el-input-number v-model="form.price" :min="0"  style="width: 180px"/>
          </el-form-item>
        </div>
        <div class="top-right">
          <el-form-item label="推送类型：">
            <el-select
              v-model="form.platformType"
              clearable
              @change="changePlatformType"
              placeholder="请选择">
              <el-option v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="平台名称：">
            <el-select v-model="form.platformCode" clearable placeholder="请选择">
              <el-option v-for="option in platforms[form.platformType]"
              :key="option.value"
              :label="option.name"
              :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="是否共享：" v-if="form.platformType==1">
            <el-select
              v-model="form.shareFlag"
              placeholder="请选择" clearable>
              <el-option
                v-for="item in shareOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="推送数量：">
            <el-input-number v-model="form.limitAmount" :min="0"  style="width: 180px"/>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="是否开启：">
            <el-switch
              v-model="form.state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="是否延迟推送：" v-if="form.platformType==1">
            <el-switch
              v-model="form.delayFlag"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </div>
      </div>
      <div class="rules-box">
        <h3>规则如下：</h3>
        <p>1、必选条件</p>
        <div class="rule-item">
          <div class="left">地区</div>
          <div class="center">
            <el-select
              v-model="form.district.type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in districtTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="right">
            <el-cascader
             placeholder="请选择地区"
             :options="areaDatas"
             :props="{emitPath: false}"
             v-if="form.district.type===2"
             v-model="form.district.fieldValue"
             >
             </el-cascader>
            <el-cascader
             placeholder="请选择地区"
             :options="areaDatas"
             :props="{multiple: true, emitPath: false}"
             v-if="form.district.type===3"
             v-model="form.district.fieldValues"
              >
            </el-cascader>
          </div>
        </div>
        <div class="rule-item" v-for="(item, index) in form.andFilter" :key="'and'+index">
          <div class="left">
            <el-select v-model="item.field" placeholder="请选择字段">
              <el-option v-for="column in columns"
                :key="column.columnKey"
                :label="column.columnName"
                :value="column.columnKey"
              ></el-option>
            </el-select>
          </div>
          <div class="center">
            <el-select
              v-model="item.type"
              placeholder="请选择类型"
            >
              <el-option
                v-for="option in fliterTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
          <div class="right">
            <el-select v-model="item.fieldValue" v-if="item.type==2" placeholder="请选择值">
              <el-option v-for="option in columns.find(x => x.columnKey === item.field)['columnValues']"
              :key="option.value"
              :label="option.name"
              :value="option.value"
              ></el-option>
            </el-select>
            <el-select v-model="item.fieldValues" v-if="item.type==3" :multiple="true" placeholder="请选择值">
              <el-option v-for="option in columns.find(x => x.columnKey === item.field)['columnValues']"
              :key="option.value"
              :label="option.name"
              :value="option.value"
              ></el-option>
            </el-select>
            <div v-if="item.type==4">
              <el-input style="width: 100px" v-model="item.begin" />
              ~
              <el-input style="width: 100px"  v-model="item.end"/>
            </div>
          </div>
          <el-button
            type="danger"
            icon="el-icon-minus"
            size="small"
            @click="form.andFilter.splice(index)"
          />
        </div>
        <div class="plus-wrap">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="large"
            @click="addAndFilter"
            >
          </el-button>
        </div>
        <p>2、选填条件 必选满足 &nbsp;<el-input-number v-model="form.orFilterNum" :min="0" :max="5"/>&nbsp;项</p>
        <div class="rule-item" v-for="(item, index) in form.orFilter" :key="'or'+index">
          <div class="left">
            <el-select v-model="item.field" placeholder="请选择字段">
              <el-option v-for="column in columns"
                :key="column.columnKey"
                :label="column.columnName"
                :value="column.columnKey"
              ></el-option>
            </el-select>
          </div>
          <div class="center">
            <el-select
              v-model="item.type"
              placeholder="请选择类型"
            >
              <el-option
                v-for="option in fliterTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
          <div class="right">
            <el-select v-model="item.fieldValue" v-if="item.type==2" placeholder="请选择值">
              <el-option v-for="option in columns.find(x => x.columnKey === item.field)['columnValues']"
              :key="option.value"
              :label="option.name"
              :value="option.value"
              ></el-option>
            </el-select>
            <el-select v-model="item.fieldValues" v-if="item.type==3" :multiple="true" placeholder="请选择值">
              <el-option v-for="option in columns.find(x => x.columnKey === item.field)['columnValues']"
              :key="option.value"
              :label="option.name"
              :value="option.value"
              ></el-option>
            </el-select>
            <div v-if="item.type==4">
              <el-input style="width: 100px" v-model="item.begin" />
              ~
              <el-input style="width: 100px"  v-model="item.end"/>
            </div>
          </div>
          <el-button
            type="danger"
            icon="el-icon-minus"
            size="small"
            @click="form.orFilter.splice(index)"
          />
        </div>
        <div class="plus-wrap">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="large"
            @click="addOrFilter"
            >
          </el-button>
        </div>
      </div>

      <!-- 推送星期 -->
      <el-form-item label="推送星期：" label-width="90px">
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
      <el-form-item label="推送时间：" label-width="90px" class="push-time">
        <el-radio-group v-model="form.allDay">
          <el-radio :label="true">全天</el-radio>
          <el-radio :label="false">非全天</el-radio>
        </el-radio-group>
        <div class="optional-ipt" v-if="form.allDay==false">
           <el-time-picker
            v-model="form.startTime"
            value-format="HH:mm:ss"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59',
              format: 'HH:mm:ss'
            }"
            placeholder="开始时间">
          </el-time-picker>
          ~
           <el-time-picker
            v-model="form.endTime"
            value-format="HH:mm:ss"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59',
              format: 'HH:mm:ss'
            }"
            placeholder="结束时间">
          </el-time-picker>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { add, update, detail, columns, platforms } from '@/api/pushRule'
import { areaList } from '@vant/area-data'
import areaData from '@/api/area'

export default {
  name: 'PushDialog',
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
      radio: '',
      value: '',
      areaDatas: [],
      areaList,
      platforms: {},
      columns: [],
      form: {
        ruleName: '',
        platformCode: '',
        platformType: '',
        andFilter: [],
        district: {
          fieldValue: '',
          fieldValues: [],
          type: ''
        },
        executeTime: '',
        limitAmount: '',
        orFilter: [],
        orFilterNum: '',
        price: '',
        shareFlag: true,
        state: true,
        weekList: [],
        allDay: false,
        startTime: null,
        endTime: null,
        delayFlag: false
      },
      typeOptions: [
        { label: '推送', value: 1 },
        { label: '抢单', value: 2 }
      ],
      shareOptions: [
        { label: '独享', value: false },
        { label: '共享', value: true }
      ],
      districtTypeOptions: [
        {
          label: '单选',
          value: 2
        },
        {
          label: '多选',
          value: 3
        }
      ],
      fliterTypeOptions: [
        {
          label: '单选',
          value: 2
        },
        {
          label: '多选',
          value: 3
        },
        {
          label: '范围',
          value: 4
        }
      ]
    }
  },
  watch: {
    isVisible: async function (newVal, oldVal) {
      this.areaDatas = areaData
      if (this.isVisible) {
        if (this.editId) {
          const res = await detail({ id: this.editId })
          if (res.code === 200) {
            this.form = res.data
          }
        }
        const res = await columns()
        if (res.code === 200) {
          this.columns = res.data
        }
        const resPlatform = await platforms()
        if (resPlatform.code === 200) {
          this.platforms = {
            1: [],
            2: []
          }
          for (const index in resPlatform.data) {
            const item = resPlatform.data[index]
            this.platforms[item.platType].push({
              name: item.platformName,
              value: item.platformCode
            })
          }
        }
      }
    }
  },
  mounted() {},
  methods: {
    changePlatformType(val) {
      this.form.platformCode = null
    },
    addAndFilter() {
      this.form.andFilter.push({
        field: '',
        fieldValue: '',
        type: '',
        fieldValues: [],
        begin: '',
        end: ''
      })
    },
    addOrFilter() {
      this.form.orFilter.push({
        field: '',
        fieldValue: '',
        type: '',
        fieldValues: [],
        begin: '',
        end: ''
      })
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
        ruleName: '',
        platformCode: '',
        platformType: '',
        andFilter: [],
        district: {
          fieldValue: '',
          fieldValues: [],
          type: ''
        },
        executeTime: '',
        limitAmount: '',
        orFilter: [],
        orFilterNum: '',
        price: '',
        shareFlag: true,
        state: true,
        weekList: [],
        allDay: false,
        startTime: null,
        endTime: null,
        delayFlag: false
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
