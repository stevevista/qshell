<template>
  <div id="app">
    <welcome></welcome>
    <div class="outter" :class="{'hideLeft':$route.path.split('/').length>2}">
      <header class="app-header" :class="{'header-hide':!$store.state.showHeader}">
        <wx-header></wx-header>
      </header>

      <search v-show="$route.path.indexOf('explore') === -1 && $route.path.indexOf('self') === -1"></search>

      <section class="app-content">
        <keep-alive>
          <router-view name="default"></router-view>
        </keep-alive>
      </section>

      <footer class="app-footer">
        <wx-nav></wx-nav>
      </footer>
    </div>

    <transition name="custom-classes-transition" :enter-active-class="enterAnimate" :leave-active-class="leaveAnimate">
      <router-view name="subPage" class="sub-page"></router-view>
    </transition>
  </div>
</template>

<script>
import Welcome from './components/common/welcome.vue'
import WxHeader from './components/common/wx-header'
import Search from './components/common/search'
import WxNav from './components/common/wx-nav'
export default {
  name: 'app',
  components: {
    WxHeader,
    WxNav,
    Search,
    Welcome
  },
  data () {
    return {
      enterAnimate: '',
      leaveAnimate: ''
    }
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      if (toDepth === 2) {
        this.$store.commit('setPageName', to.name)
      }

      if (toDepth === fromDepth) {
        return
      }
      this.enterAnimate = toDepth > fromDepth ? 'animated fadeInRight' : 'animated fadeInLeft'
      this.leaveAnimate = toDepth > fromDepth ? 'animated fadeOutLeft' : 'animated fadeOutRight'

      if (toDepth === 3) {
        this.leaveAnimate = 'animated fadeOutRight'
      }
    }
  }
}
</script>

<style>
  @import "assets/css/base.css";
  @import "assets/css/common.css";
  @import "assets/css/wx-header.css";
  @import "assets/css/lib/iconfont.css";
  @import "assets/css/lib/animate.css";
  @import "assets/css/lib/weui.min.css";
</style>
