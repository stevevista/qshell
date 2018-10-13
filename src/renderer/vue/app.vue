<template>
  <div id="app">
    <header class="app-header" style="display:none;" v-show="appload">
      <div class="_effect" :class="{'_effect--50':decline}">
        <index-header style="overflow:visible;"></index-header>
      </div>
    </header>

    <section class="app-content" style="display:none;" v-show="appload">
      <router-view keep-alive></router-view>
    </section>

    <footer class="app-footer _line-fine" style="display:none;" v-show="appload">
        <div class="_effect " :class="{'_effect--50':decline}">
            <index-nav></index-nav>
        </div>
    </footer>

    <!--mask layer--> 
    <section class="welcome" v-show="welcome" transition="welcome"></section>
  </div>
</template>

<script>
import './assets/css/common.css'
import './assets/css/base.css'
import indexHeader from './components/index-header.vue'
import indexNav from './components/index-nav.vue'
export default {
  components: {
    indexHeader,
    indexNav
  },
  data () {
    return {
      appload: false,
      welcome: false,
      decline: false
    }
  },
  created () {
    if (this.$route.matched.length === 1) {
      this.welcome = true
    }
    this.appload = true
    setTimeout(() => {
      this.welcome = false
    }, 2000)
  }
}

</script>

<style scoped>
.welcome {
    width: 100%;
    height: 100%;
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    transition: .25s all linear;
    background: url(./assets/images/launchimage.png) no-repeat center center;
    background-size: cover;
}
.welcome-leave {
    opacity: 0;
}
</style>
