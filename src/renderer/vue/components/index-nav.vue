<template>
  <nav>
    <dl v-for="(item, index) in indexNav" @click="setMenuActive(index)">
      <router-link :to="item.path">
        <dt class="iconfont" :class="item.iconClass">
          <i v-if="item.hint.count" v-text="item.hint.count" :class="'_news-'+item.hint.type"></i>
        </dt>
        <dd v-text="item.text"></dd>
      </router-link>
    </dl>
  </nav>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('base', ['indexNav'])
  },
  methods: {
    ...mapActions('base', ['getIndexNav']),
    ...mapMutations('base', [ 'setMenuActive' ])
  },
  created () {
    this.getIndexNav()
  }
}
</script>

<style scoped>
nav {
    display: flex;
    width: 100%;
    overflow: hidden;
    height: 50px;
    padding-top: 8px;
    background: #f9f9f9;
    font-size: 12px;
}

nav dl {
    user-select: none;
    -webkit-user-select: none;
    flex-grow: 1;
    text-align: center;
    line-height: 1;
}

nav dl.v-link-active dl,
nav dl.v-link-active dt {
    color: #0bb908;
}

nav dt {
    position: relative;
    width: 28px;
    height: 28px;
    margin: 0 auto;
    font-size: 28px;
    color: #797979;
    margin-bottom: 2px;
}

nav dd {
    color: #929292;
    transform-origin: 50% 0;
    transform: scale(0.9);
}

nav ._news-dot {
    right: -2px;
    top: -3px;
    width: 11px;
    height: 11px;
}
</style>
