<template>
  <div class="al-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>进件日志统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="opt-box">
      <el-form inline>
        <div class="form-row">
          <el-form-item label="手机号(MD5): ">
            <el-input
              v-model="queryInfo.md5Phone"
              clearable
              placeholder="请输入手机号(MD5)"
            />
          </el-form-item>
          <el-form-item label="平台名称：">
            <el-input
              v-model="queryInfo.platformName"
              clearable
              placeholder="请输入平台名称"
            />
          </el-form-item>
          <el-form-item label="结果：">
            <el-select
              v-model="queryInfo.result"
              clearable
              placeholder="请选择结果"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="创建时间：">
            <el-date-picker
              v-model="queryInfo.queryTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <div class="btn-group-right">
            <el-form-item class="item-btn">
              <el-button
                icon="el-icon-search"
                size="small"
                type="primary"
                @click="fetchData()"
              >
                查询
              </el-button>
            </el-form-item>
            <el-form-item class="item-btn">
              <el-button
                icon="el-icon-upload2"
                size="small"
                type="primary"
                @click="openDialog()"
              >
                导入
              </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-table border stripe :data="tableData">
        <el-table-column prop="md5Phone" label="手机号(MD5)" align="center" />
        <el-table-column prop="source" label="渠道名称" align="center" />
        <el-table-column prop="platformName" label="产品名称" align="center" />
        <el-table-column prop="channelPrice" label="渠道价格" align="center" />
        <el-table-column prop="platformPrice" label="产品价格" align="center" />
        <el-table-column prop="ctime" label="创建时间" align="center" />
        <el-table-column prop="result" label="结果" align="center" />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog
      title="导入"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="attention">
        请上传xlsx格式文件,且文件大小不超过10MB.需要填写产品名称
      </div>
      <el-upload
        class="al-upload"
        action="#"
        :on-change="handleChange"
        :file-list="fileList"
        :limit="1"
        :auto-upload="false"
        ref="al-upload"
      >
        <el-button slot="trigger" size="small" type="primary">
          点击上传
        </el-button>
        <el-select
          class="plat-select"
          v-model="platformCode"
          slot="tip"
          clearable
          placeholder="请选择产品"
        >
          <el-option
            v-for="item in platformData"
            :key="item.platformCode"
            :label="item.platformName"
            :value="item.platformCode"
          ></el-option>
        </el-select>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryLogsByCondition,
  uploadExcelAndDownFile
} from '@/api/applicationLogs'

import { platforms } from '@/api/pushRule'
export default {
  name: 'UserView',
  components: {},
  data() {
    return {
      currentPage: 1,
      total: 0,
      dialogVisible: false,
      tableData: [],
      fileList: [],
      queryInfo: {
        current: 1,
        size: 20,
        phone: '',
        platformName: '',
        result: '',
        queryTime: []
      },
      platformCode: '',
      options: [
        {
          value: 'success',
          label: '成功'
        },
        {
          value: 'error',
          label: '失败'
        }
      ],
      platformData: []
    }
  },
  methods: {
    handleSizeChange(val) {
      this.queryInfo.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.queryInfo.current = val;
      this.fetchData();
    },
    async openDialog() {
      this.dialogVisible = true
      // 获取平台数据
      const res = await platforms()
      if (res.code === 200) {
        this.platformData = res.data.map((item) => ({
          platformCode: item.platformCode,
          platformName: item.platformName
        }))
      }
    },
    async fetchData() {
      const res = await queryLogsByCondition(JSON.stringify(this.queryInfo))
      if (res.code === 200) {
        this.tableData = res.data.records
        this.total = res.data.total
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
            this.fileList = []
            this.platformCode = ''
            done()
        })
        .catch((_) => {})
    },
      closeDialog() {
        this.dialogVisible = false
        this.fileList = []
        this.platformCode = ''
      },
    async submitUpload() {
        if(this.fileList.length === 0) {
          this.$message.error('请先上传文件')
          return
        }
        if(this.platformCode === '') {
          this.$message.error('请选择产品')
          return
        }
        const formData = new FormData()
        formData.append('file', this.fileList[0].raw)
        formData.append('platformCode', this.platformCode)
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const res = await uploadExcelAndDownFile(formData)
        console.log(res);
        // 获取文件名
        let filename = 'export.xlsx';
        let disposition = '';
        if (res.headers) {
          disposition = res.headers['content-disposition'] || res.headers['Content-Disposition'];
        }
        if (disposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
          if (matches && matches[1]) {
            filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
          }
        }
        // 下载文件
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
        this.$message.success('下载成功');
        this.dialogVisible = false;
        this.fileList = [];
        this.platformCode = '';
        this.fetchData();
        loading.close();
    },
    handleChange(file, fileList) {
      // 文件类型校验
      const isXlsx =
        file.raw.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xlsx')
      if (!isXlsx) {
        this.$message.error('只能上传xlsx格式文件')
        // 移除不合规文件
        this.fileList = fileList.filter((f) => f.uid !== file.uid)
        return
      }

      // 文件大小限制（如10MB）
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件大小不能超过10MB')
        this.fileList = fileList.filter((f) => f.uid !== file.uid)
        return
      }

      // 只保留最新文件（limit=1已控制，但可防止异常）
      if (fileList.length > 1) {
        this.fileList = [fileList[fileList.length - 1]]
      } else {
        this.fileList = fileList
      }
    }
  }
}
</script>

<style scoped lang="less">
.al-container {
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
      .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .btn-group-right {
          margin-left: auto;
          display: flex;
          align-items: center;
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
  .el-dialog__body {
    .al-upload {
      margin-top: 15px;
      display: inline-block;
    }
    .plat-select {
      display: inline-block;
      width: 240px;
      margin-left: 20px;
    }
  }
}
</style>
