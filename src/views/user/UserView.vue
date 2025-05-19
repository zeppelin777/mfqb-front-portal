<template>
  <div class="user-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <el-form-item label="时间范围：">
          <el-date-picker
            v-model="date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            range-separator="至"
            @change="confirmDate"
            value-format="yyyy-MM-dd"
            clearable
          />
        </el-form-item>
        <el-form-item label="进件状态：">
          <el-select
            v-model="queryInfo.collectFlag"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in collectOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户ID：">
          <el-input v-model="queryInfo.userId" placeholder="请输入用户ID" clearable/>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="queryInfo.phoneNo" placeholder="请输入手机号" clearable/>
        </el-form-item>
        <el-form-item label="来源渠道代码：">
          <el-input
            v-model="queryInfo.channelCode"
            placeholder="请输入渠道代码"
            clearable
          />
        </el-form-item>
        <el-form-item label="来源渠道名称：">
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
            >查询</el-button
          >
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button
            icon="el-icon-download"
            size="small"
            type="primary"
            @click="dataDownload()"
            >下载</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="id" label="ID" align="center" width="80" />
        <el-table-column prop="channelCode" label="渠道编号" align="center" width="80" />
        <el-table-column prop="channelName" label="渠道名称" align="center" />
        <el-table-column prop="phoneNo" label="手机号" align="center" width="120" />
        <el-table-column prop="realName" label="姓名" align="center" width="120" />
        <!-- <el-table-column prop="idCard" label="身份证" align="center" width="140" /> -->
        <el-table-column prop="lastDevice" label="最后登录设备" align="center" width="120" show-overflow-tooltip />
        <el-table-column prop="lastIp" label="最后登录IP" align="center" />
        <el-table-column prop="lastSeen" label="最后登录时间" align="center" width="140" />
        <el-table-column prop="registerDevice" label="注册设备" align="center" width="120" show-overflow-tooltip />
        <el-table-column prop="registerIp" label="注册IP" align="center" />
        <el-table-column prop="ctime" label="注册时间" align="center" width="140" />
        <el-table-column prop="locked" label="禁用登录" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.lockedFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeLocked(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.current"
        :page-sizes="[20, 50, 100]"
        :page-size="this.queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { list, locked, download } from '@/api/appuser'
export default {
  name: 'UserView',
  data() {
    return {
      total: 10,
      tableData: [],
      date: [],
      collectOptions: [
        {
          name: '未进件',
          value: false
        },
        {
          name: '已进件',
          value: true
        }
      ],
      queryInfo: {
        current: 1,
        size: 20,
        userId: '',
        startTime: '2022-08-01',
        endTime: '2022-08-02',
        channelCode: '',
        channelName: '',
        collectFlag: '',
        phoneNo: ''
      }
    }
  },
  mounted() {
    this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD')
    this.queryInfo.endTime = this.$moment(new Date())
      .add(1, 'days')
      .format('YYYY-MM-DD')
    this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
    this.getTableList()
  },
  methods: {
    async getTableList() {
      const res = await list(this.queryInfo)
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.records
      }
    },
    confirmDate(value) {
      if (value) {
        this.queryInfo.startTime = value[0]
        this.queryInfo.endTime = value[1]
        this.getTableList()
      } else {
        this.queryInfo.startTime = ''
        this.queryInfo.endTime = ''
        this.getTableList()
      }
    },
    async changeLocked(row) {
      const res = await locked({ id: row.id, state: row.lockedFlag })
      if (res.code === 200) {
        this.getTableList()
      }
    },
    async dataDownload() {
      await download(this.queryInfo)
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

<style scoped lang="less">
.user-container {
  .opt-box {
    margin-bottom: 20px;
    :deep(.el-card__body) {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-btn {
        display: inline-block;
        margin-left: 25px;
      }
      .el-form-item {
        .el-form-item__label {
          font-size: 13px;
          width: 90px;
          white-space: nowrap;
        }
      }
      .el-range-separator {
        padding: 0;
      }
    }
  }

  :deep(.table-box) {
    th > div {
      font-size: 13px;
    }
  }

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
