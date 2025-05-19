<template>
  <el-dialog
    class="crm-dialog-container"
    :visible="isVisible"
    title="新增"
    @close="onClose"
  >
    <el-form label-width="130px" :model="form">
      <div class="fields-box">
        <div class="top-left">
          <el-form-item label="crm名称：">
            <el-input v-model="form.crmName"/>
          </el-form-item>
          <el-form-item label="推送数量：">
            <el-input-number v-model="form.rule.limitAmount" :min="-1"/>
          </el-form-item>
          <el-form-item label="是否开启：">
            <el-switch
              v-model="form.rule.state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </div>
        <div class="top-right">
          <el-form-item label="共享类型：">
            <el-select
              v-model="form.rule.shareFlag"
              placeholder="请选择" clearable>
              <el-option
                v-for="item in shareOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单价：">
            <el-input-number v-model="form.rule.price" :min="0"/>
          </el-form-item>
          <el-form-item label="是否延时推送：" >
            <el-switch
              v-model="form.rule.delayFlag"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </div>
        <div class="top-left">
          <el-form-item label="用户标签：">
            <el-input type="textarea" rows="3" v-model="form.userTag"></el-input>
          </el-form-item>
          <el-form-item label="绑定机构信息">
            <el-select v-model="form.infoId" placeholder="请选择" :clearable="true">
              <el-option v-for="item in platformInfos" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
            </el-select>
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
              v-model="form.rule.district.type"
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
             v-if="form.rule.district.type===2"
             v-model="form.rule.district.fieldValue"
             >
             </el-cascader>
            <el-cascader
             placeholder="请选择地区"
             :options="areaDatas"
             :props="{multiple: true, emitPath: false}"
             v-if="form.rule.district.type===3"
             v-model="form.rule.district.fieldValues"
              >
            </el-cascader>
          </div>
        </div>
        <div class="rule-item" v-for="(item, index) in form.rule.andFilter" :key="'and'+index">
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
            @click="form.rule.andFilter.splice(index)"
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
        <p>2、选填条件 必选满足 &nbsp;<el-input-number v-model="form.rule.orFilterNum" :min="0" :max="5"/>&nbsp;项</p>
        <div class="rule-item" v-for="(item, index) in form.rule.orFilter" :key="'or'+index">
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
            @click="form.rule.orFilter.splice(index)"
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
        <el-checkbox-group v-model="form.rule.weekList">
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
        <el-radio-group v-model="form.rule.allDay">
          <el-radio :label="true">全天</el-radio>
          <el-radio :label="false">非全天</el-radio>
        </el-radio-group>
        <div class="optional-ipt" v-if="form.rule.allDay==false">
           <el-time-picker
            v-model="form.rule.startTime"
            value-format="HH:mm:ss"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59',
              format: 'HH:mm:ss'
            }"
            placeholder="开始时间">
          </el-time-picker>
          ~
           <el-time-picker
            v-model="form.rule.endTime"
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
import { all } from '@/api/platforminfo'
import { add, update, detail } from '@/api/crm'
import { columns } from '@/api/pushRule'
import { areaList } from '@vant/area-data'
import areaData from '@/api/area'

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
      areaDatas: [],
      areaList,
      columns: [],
      platformInfos: [],
      form: {
        crmName: '',
        userTag: '',
        infoId: '',
        loginPassword: '',
        loginUsername: '',
        rule: {
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
      },
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
        const res1 = await all()
        if (res1.code === 200) {
          this.platformInfos = res1.data
        }
      }
    }
  },
  mounted() {},
  methods: {
    addAndFilter() {
      this.form.rule.andFilter.push({
        field: '',
        fieldValue: '',
        type: '',
        fieldValues: [],
        begin: '',
        end: ''
      })
    },
    addOrFilter() {
      this.form.rule.orFilter.push({
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
        crmName: '',
        userTag: '',
        infoId: '',
        loginPassword: '',
        loginUsername: '',
        rule: {
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
}
</script>

<style scoped lang="less">
.crm-dialog-container {
  .fields-box {
    display: flex;
    margin: 0 20px;
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

  // :deep(.el-dialog__footer) {
  //   text-align: center;
  // }
}
</style>
