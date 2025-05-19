<template>
    <div class="statistics-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户星级统计</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="opt-box">
        <el-form inline>
          <el-form-item label="时间范围">
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
          <el-form-item label="渠道名称：">
            <el-input v-model="queryInfo.channelName" placeholder="请输入渠道名称" clearable/>
          </el-form-item>
          <el-form-item label="渠道等级：">
            <el-select
              v-model="queryInfo.level"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="星级：">
            <el-select
              v-model="queryInfo.star"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in starOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="查询类型：">
            <el-select
              v-model="queryInfo.queryType"
              placeholder="请选择">
              <el-option
                v-for="item in queryTypeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item class="item-btn">
            <el-button icon="el-icon-search" size="small" type="primary" @click="getTableList()">查询</el-button>
            <el-button icon="el-icon-download" size="small" type="primary" @click="download()">星级数据下载</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
      <el-card class="table-box">
        <el-table border stripe :data="tableData">
          <el-table-column prop="channelName" label="渠道名称" align="center" />
          <!-- <el-table-column label="渠道等级" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level == 'A'" color="#2ecc71" style="color: #fff;">A</el-tag>
              <el-tag v-if="scope.row.level == 'B'" color="#3498db" style="color: #fff;">B</el-tag>
              <el-tag v-if="scope.row.level == 'C'" color="#f1c40f" style="color: #fff;">C</el-tag>
              <el-tag v-if="scope.row.level == 'D'" color="#c0392b" style="color: #fff;">D</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="优质率" align="center" sortable :sort-method="sortMethod">
            <template slot-scope="{ row }">
              {{ sumPercent(row.threePercent + row.fourPercent + row.fivePercent) }}%
            </template>
          </el-table-column>
          <el-table-column label="零星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.zeroStarNum }}/{{ sumPercent(scope.row.zeroPercent) }}%</span>
              <el-button v-if="scope.row.zeroStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 0)">查看产品</el-button>
            </template>
          </el-table-column>
          <el-table-column label="一星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.oneStarNum }}/{{ sumPercent(scope.row.onePercent) }}%</span>
              <el-button v-if="scope.row.oneStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 1)">查看产品</el-button>
            </template>
          </el-table-column>
          <el-table-column label="二星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.twoStarNum }}/{{ sumPercent(scope.row.twoPercent) }}%</span>
              <el-button v-if="scope.row.twoStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 2)">查看产品</el-button>
            </template>
          </el-table-column>
          <el-table-column label="三星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.threeStarNum }}/{{ sumPercent(scope.row.threePercent) }}%</span>
              <el-button v-if="scope.row.threeStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 3)">查看产品</el-button>
            </template>
          </el-table-column>
          <el-table-column label="四星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.fourStarNum }}/{{ sumPercent(scope.row.fourPercent) }}%</span>
              <el-button v-if="scope.row.fourStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 4)">查看产品</el-button>
            </template>
          </el-table-column>
          <el-table-column label="五星用户" align="center">
            <template slot-scope="scope">
              <span style="width: 50px;font-size: 16px;margin-right: 10px;">{{ scope.row.fiveStarNum }}/{{ sumPercent(scope.row.fivePercent) }}%</span>
              <el-button v-if="scope.row.fiveStarNum !== 0" type="text" @click="getPlatStarDetail(scope.row, 5)">查看产品</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.current"
          :page-sizes="[10,20, 50, 50]"
          :page-size="queryInfo.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>

      <el-dialog :visible="productVisible" :title="title" @close="colseVisible()">
        <el-table :data="productList">
            <el-table-column prop="platformName" label="产品名称" align="center" />
            <el-table-column prop="num" label="数量" align="center" />
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryProduct.current"
          :page-sizes="[10,20, 50, 50]"
          :page-size="queryProduct.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="productTotal">
        </el-pagination>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { userStarStatistics, getPlatStarDetail, downloadStar } from '@/api/channelStatistics'
  export default {
    name: 'UserView',
    data() {
      return {
        total: 0,
        isShowPushStatiscsVisible: false,
        tableData: [],
        date: [],
        levelOptions: [
          {
            name: 'A',
            value: 'A'
          },
          {
            name: 'B',
            value: 'B'
          },
          {
            name: 'C',
            value: 'C'
          },
          {
            name: 'D',
            value: 'D'
          }
        ],
        starOptions: [
          {
            name: '零星用户',
            value: 0
          },
          {
            name: '一星用户',
            value: 1
          },
          {
            name: '二星用户',
            value: 2
          },
          {
            name: '三星用户',
            value: 3
          },
          {
            name: '四星用户',
            value: 4
          },
          {
            name: '五星用户',
            value: 5
          }
        ],
        queryTypeOptions: [
          {
            name: 'h5',
            value: 'h5'
          },
          {
            name: 'api',
            value: 'api'
          }
        ],
        queryInfo: {
          current: 1,
          size: 20,
          channelName: '',
          startTime: '',
          endTime: '',
          level: ''
        },
        title: '',
        productVisible: false,
        productList: [],
        queryProduct: {
          current: 1,
          size: 20
        },
        productTotal: 0
      }
    },
    mounted() {
      this.queryInfo.startTime = this.$moment(new Date()).format('YYYY-MM-DD 00:00:00')
      this.queryInfo.endTime = this.$moment(new Date())
        .add(1, 'days')
        .format('YYYY-MM-DD HH:mm:ss')
      this.date = [this.queryInfo.startTime, this.queryInfo.endTime]
      this.getTableList()
    },
    methods: {
      confirmDate(value) {
        if (value) {
          this.queryInfo.startTime = this.$moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
          this.queryInfo.endTime = this.$moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
          this.getTableList()
        } else {
          this.queryInfo.startTime = ''
          this.queryInfo.endTime = ''
          this.getTableList()
        }
      },
      async getTableList() {
        const res = await userStarStatistics(this.queryInfo)
        if (res.code === 200) {
          this.total = res.data.total
          this.tableData = res.data.records
        }
      },

      async download() {
      await downloadStar(this.queryInfo)
    },

      sortMethod(a, b) {
        return (a.threePercent + a.fourPercent + a.fivePercent) - (b.threePercent + b.fourPercent + b.fivePercent)
      },

      sumPercent(num) {
        const count = num * 100
        return Number.isInteger(count)?count: count.toFixed(0)
      },

      async getPlatStarDetail(row, star) {
        switch (star) {
          case 0:
            this.title = row.channelName + '-零星用户产品详情'
            break;
          case 1:
            this.title = row.channelName + '-一星用户产品详情'
            break;
          case 2:
            this.title = row.channelName + '-二星用户产品详情'
            break;
          case 3:
            this.title = row.channelName + '-三星用户产品详情'
            break;
          case 4:
            this.title = row.channelName + '-四星用户产品详情'
            break;
          case 5:
            this.title = row.channelName + '-五星用户产品详情'
            break;
        }
        const params = {
          ...this.queryProduct,
          channelName: row.channelName,
          startTime: this.queryInfo.startTime,
          endTime: this.queryInfo.endTime,
          star,
          queryType: this.queryInfo.queryType
        }
        const res = await getPlatStarDetail(params)
        if (res.code === 200) {
          console.log(res)
          this.productList = res.data.records
          this.productTotal = res.data.total
          this.productVisible = true
        }
      },

      colseVisible() {
        this.queryProduct = {
          current: 1,
          size: 20
        }
        this.productVisible = false
      },
      
      handleSizeChange(val) {
        this.queryInfo.size = val
        this.getTableList()
      },
      handleCurrentChange(val) {
        this.queryInfo.current = val
        this.getTableList()
      },

      handleSizeChange1(val) {
        this.queryProduct.size = val
        // this.getTableList()
      },
      handleCurrentChange1(val) {
        this.queryProduct.current = val
        // this.getTableList()
      },
    }
  }
  </script>
  
  <style scoped lang="less">
  .statistics-container {
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
          margin-bottom: 0;
          .el-form-item__label {
            font-size: 13px;
            width: 90px;
            white-space: nowrap;
          }
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
  