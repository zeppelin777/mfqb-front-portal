<template>
  <el-dialog
    :title="`推送渠道统计——${platformName}`"
    :visible="isVisible"
    width="60%"
    height="75%"
    @close="$emit('update:isVisible', false)"
  >
    <el-form inline>
      <el-form-item label="渠道名称：">
        <el-input
          v-model="queryInfo.channelName"
          placeholder="请输入渠道名称"
          clearable
        />
      </el-form-item>
      <el-form-item class="item-btn">
        <el-button
          icon="el-icon-search"
          size="small"
          type="primary"
          @click="getTableList()"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-table border stripe :data="tableData">
      <el-table-column
        prop="channelName"
        label="渠道名称"
        align="center"
        width="140px"
      />
      <el-table-column
        prop="channelId"
        label="渠道id"
        align="center"
        width="160px"
      />
      <!-- <el-table-column prop="remark" label="渠道类型" align="center">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.remark == 'api全流程'" type="success">{{ scope.row.remark }}</el-tag>
            <el-tag v-if="scope.row.remark == 'h5渠道'">{{ scope.row.remark }}</el-tag>
            <el-tag v-if="scope.row.remark == 'api半流程'" type="danger">{{ scope.row.remark }}</el-tag>
          </template>
      </el-table-column> -->
      <el-table-column
        prop="channelTypeName"
        label="渠道类型"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.channelType === '1'">全流程</span>
          <span v-else-if="scope.row.channelType === '2'">半流程</span>
          <span v-else-if="scope.row.channelType === '3'">uv</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="platformType" label="产品类型" align="center">
        <template slot-scope="{ row }">
            <template v-for="item in optionTypes">
              <div v-if="row.platformType === item.id">{{ item.label }}</div>
            </template>
          </template>
      </el-table-column> -->
      <el-table-column prop="dayChannelLimit" label="日推送最大量" align="center">
        <template slot-scope="scope">
          <el-input-number
            :disabled="!scope.row.switchFlag"
            v-model="scope.row.dayChannelLimit"
          ></el-input-number>
          <el-button
            size="small"
            type="primary"
            :disabled="!scope.row.switchFlag"
            style="margin-left: 10px"
            @click="updateSwitchChannelLimitById(scope.row.id, scope.row.dayChannelLimit)"
          >
            保存
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="switchFlag" label="开关状态" align="center">
        <template slot="header">
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <div style="margin-right: 20px">开/关</div>
            <el-button type="text" size="small" @click="closeAll(true)">
              全部开启
            </el-button>
            <el-button type="text" size="small" @click="closeAll(false)">
              全部关闭
            </el-button>
          </div>
        </template>
        <template slot-scope="scope">
          <el-switch
            active-text="开"
            inactive-text="关"
            v-model="scope.row.switchFlag"
            @change="(e) => changeSwitchFlag(e, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.current"
      :page-sizes="[20, 50, 100]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import { update } from '@/api/platforminfo'
import {
  chanpinSwitchInfo,
  changeChanpinSwitchInfo,
  updateAllSwitchByPlatId,
  updateSwitchChannelLimitById
} from '@/api/pushStatistics'

export default {
  name: 'PushStatiscsBychannelDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    platformId: {
      type: String,
      default: ''
    },
    platformName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      total: 0,
      tableData: [],
      queryInfo: {
        current: 1,
        size: 20,
        channelName: '',
        platformId: ''
      },
      optionTypes: [
        {
          id: 1,
          label: '半流程撞库授权'
        },
        {
          id: 2,
          label: '半流程进件授权'
        },
        {
          id: 3,
          label: '全流程'
        },
        {
          id: 4,
          label: '其他流程'
        }
      ]
    }
  },
  watch: {
    isVisible: async function (newVal, oldVal) {
      if (this.isVisible) {
        this.getTableList()
      }
    }
  },
  methods: {

    async updateSwitchChannelLimitById(id, dayChannelLimit) {
      const res = await updateSwitchChannelLimitById(id, dayChannelLimit)
      if (res.code === 200) {
        this.$message.success('修改成功～')
        this.getTableList()
      }
    },

    async getTableList() {
      // console.log(this.source)
      this.queryInfo.platformId = this.platformId
      const res = await chanpinSwitchInfo(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    async changeSwitchFlag(e, row) {
      let params = {
        id: row.id,
        switchFlag: e
      }

      const res = await changeChanpinSwitchInfo(params)
      if (res.code === 200) {
        this.$message.success('修改成功～')
        this.getTableList()
      }
    },

    closeAll(e) {
      const text = e ? '确认全部开启吗？' : '确认全部关闭吗？'
      this.$confirm(text)
        .then(async () => {
          let params = {
            id: this.platformId,
            switchFlag: e
          }

          const res = await updateAllSwitchByPlatId(params)
          if (res.code === 200) {
            this.$message.success('操作完成')
            this.getTableList()
          }
        })
        .catch(() => {})
    },

    handleSizeChange(val) {
      this.queryInfo.size = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.queryInfo.current = val
      this.getTableList()
    }
  }
}
</script>

<style scoped></style>
