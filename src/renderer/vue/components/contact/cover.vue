<template>
  <div class="home-pic" :style="`background: url(${user.coverUrl}) no-repeat center center`">
    <div class="home-pic-base">
      <div class="top-pic">
        <div class="top-pic-inner">
          <img :src="user.headerUrl">
        </div>
      </div>
      <div class="top-name _ellipsis">{{user.displayName}}</div>
    </div>
    <p class="sign">填坑小能手</p>
  </div>
</template>

<script>
export default {
  props: ['user']
}
</script>
