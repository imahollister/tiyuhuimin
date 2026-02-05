<template>
  <van-tabbar v-model="active" route fixed placeholder safe-area-inset-bottom>
    <van-tabbar-item replace to="/mobile/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item replace to="/mobile/verification" icon="scan">核销</van-tabbar-item>
    <van-tabbar-item replace to="/mobile/user" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue';
const active = ref(0);
</script>