<template>
  <el-container>
    <el-aside width="220px">
      <LayoutMenu />
    </el-aside>
    <el-container>
      <el-header>
        <div class="user-wrap">
          <img src="@/assets/head.png" />
          {{ userName }}
        </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            操作
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
            <el-dropdown-menu>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LayoutMenu from './LayoutMenu.vue'

export default {
  name: 'LayoutMain',
  components: {
    LayoutMenu
  },
  data() {
    return {
      userName: ''
    }
  },
  mounted() {
    this.userName = localStorage.getItem('currentUser')
  },
  methods: {
    async logout() {
      console.log('ddd')
      const res = await this.$confirm('您确认要退出吗?')
      if (res) {
        localStorage.clear()
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped lang="less">
.el-container {
  height: 100vh;
  .el-aside {
    background-color: #001529;
  }
  .el-main {
    height: 100%;
  }
  .el-header {
    display: flex;
    /* align-items: center; */
    /* font-family: fangsong; */
    justify-content: flex-end;
    align-items: center;
    /* font-weight: bold; */
    font-size: 16px;
    background-color: fff;
    border-bottom: 1px solid rgb(240, 242, 245);
    div {
      display: flex;
      align-items: center;

      img {
        width: 40px;
        border-radius: 50%;
        margin-right: 6px;
      }
    }
    .user-wrap {
      margin-right: 20px;
    }

    .el-dropdown-link {
      font-size: 16px;
      font-weight: 400;
      color: #000;
      cursor: pointer;
    }
  }
}
</style>
