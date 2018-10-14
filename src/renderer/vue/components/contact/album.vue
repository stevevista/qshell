<template>
    <div class="album">
        <header id="wx-header">
            <div class="center">
                <div class="iconfont icon-return-arrow" v-on:click="$router.back()">
          <span>返回</span>
        </div>
                <span>相册</span>
            </div>
        </header>
        <cover :user="user"></cover>

        <section class="album-box clearfix" v-for="moment in moments">
            <div class="post-date">
                <b class="day">04</b>
                <b class="month">3月</b>
            </div>
            <div class="post-content">
                <div class="tumb-box">
                    <img v-for="pic in moment.photos" :src="pic" alt="">
                </div>
                <div class="thumb-desc">
                    {{moment.post}}
                    <p class="number">共{{moment.photos.length}}张</p>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
import Cover from '../contact/cover'
export default {
  components: {
    Cover
  },
  computed: {
    user() { 
      return this.$store.state.users[this.$route.query.wxid] 
    },
    moments() {
      return this.$store.state.moments.filter(m => m.user.wxid === this.$route.query.wxid)
    }
  }
}
</script>
<style>
    @import "../../assets/css/album.css";
</style>
