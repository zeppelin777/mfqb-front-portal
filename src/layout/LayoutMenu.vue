<template>
  <el-menu
    default-active="1"
    @open="handleOpen"
    @close="handleClose"
    background-color="#001529"
    text-color="#fff"
    active-text-color="#409eff"
    router
  >
    <el-menu-item index="/index">
      <i class="el-icon-data-analysis"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-submenu v-for="(item,index) in menuTree" :index="item.path" :key="index">
      <template slot="title">
        <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" />
        <i v-else class="el-icon-user"></i>
        <span>{{item.meta.title}}</span>
      </template>
      <el-menu-item v-for="(child,ci) in item.children" :index="child.path" :key="ci">
        <template slot="title">
          <svg-icon v-if="child.meta.icon" :icon-class="child.meta.icon" />
          <i v-else class="el-icon-user"></i>
          <span>{{child.meta.title}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
import { build } from '@/api/menu'
export default {
  data() {
    return {
      menuTree: []
    }
  },
  mounted() {
    this.getMenuTree()
  },
  methods: {
    async getMenuTree() {
      const res = await build()
      if (res.code === 200) {
        this.menuTree = res.data
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped lang="less">
.el-menu {
  border-right: 0;
}
</style>
