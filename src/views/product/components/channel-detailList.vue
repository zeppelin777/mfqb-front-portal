<template>
  <el-dialog
    :title="$props.detailData.channelName"
    :visible="isVisible"
    width="60%"
    height="75%"
    @close="$emit('update:isVisible', false)"
  >
    <el-form inline>
      <el-form-item label="产品名称：">
        <el-input
          v-model="queryInfo.platformName"
          placeholder="请输入产品名称"
          clearable
        />
      </el-form-item>
      <el-form-item class="item-btn">
        <el-button
          icon="el-icon-search"
          size="small"
          type="primary"
          @click="getTableList()"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-table border stripe :data="tableData">
      <!-- <el-table-column prop="channelId" label="渠道id" align="center" />
        <el-table-column prop="platformId" label="产品id" align="center" /> -->
      <el-table-column prop="platformName" label="产品名称" align="center" />
      <el-table-column prop="platformType" label="产品类型" align="center">
        <template slot-scope="{ row }">
            <template v-for="item in optionTypes">
              <div v-if="row.platformType === item.id">{{ item.label }}</div>
            </template>
          </template>
      </el-table-column>
      <el-table-column prop="switchFlag" label="开/关" align="center">
        <template slot="header">
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <div style="margin-right: 20px">开/关</div>
            <el-button type="text" size="small" @click="closeAll(true)">全部开启</el-button>
            <el-button type="text" size="small" @click="closeAll(false)">全部关闭</el-button>
          </div>
        </template>
        <template slot-scope="scope">
          <el-switch
            active-text="开"
            inactive-text="关"
            v-model="scope.row.switchFlag"
            @change="(e) => changeSwitch(e, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-dialog>
</template>

<script>
import {
  switchInfoByChannelId,
  updateSwitchById,
  updateAllSwitchById
} from '@/api/channel'

export default {
  name: 'ChannelStatiscsByPushDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: String,
      default: ''
    },
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
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
        channelId: '',
        platformName: ''
      },
      switchFlag: false,
      optionTypes: [{
        id: 1,
        label: '半流程撞库授权'
      }, {
        id: 2,
        label: '半流程进件授权'
      }, {
        id: 3,
        label: '全流程'
      }, {
        id: 4,
        label: '其他流程'
      }]
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
    async changeSwitch(e, row) {
      console.log(e, row)
      let params = {
        id: row.id,
        switchFlag: e
      }
      let res = await updateSwitchById(params)
      console.log(res)
      if (res.code == 200) {
        this.$message.success('修改成功～')
        this.getTableList()
      }
    },
    async getTableList() {
      console.log(this.$props.detailData)
      this.queryInfo.channelId = this.$props.detailData.id
      const res = await switchInfoByChannelId(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    closeAll(e) {
      const text = e ? '确认全部开启吗？' : '确认全部关闭吗？'
      this.$confirm(text)
        .then(async () => {
          let params = {
            id: this.$props.detailData.id,
            switchFlag: e
          }

          const res = await updateAllSwitchById(params)
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
