<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
// import { getIp } from '@/api/login'
export default {
  async mounted() {
    // const res = await getIp()
    // localStorage.setItem('province', res.pro)
    // localStorage.setItem('city', res.city)
  }
}
</script>
