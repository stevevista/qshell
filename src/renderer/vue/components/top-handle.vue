<template>
  <div class="_cover-top">
    <div class="top-back">
      <router-link :to="backPath">
        <div class="_ellipsis iconfont icon-return-arrow" v-text="backText">
        </div>
      </router-link>
    </div>

    <div class="top-other">
      <router-link :to="nextPath">
        <slot name="right">
          <div class="_align-right">
            <span class="iconfont" :class="nextIcon"></span>
          </div>
        </slot>
      </router-link>
    </div>

    <!-- center -->
    <div class="top-title _effect" :class="{'_effect--50':decline}">
      <slot name="center">
        <p>
          <span v-text='curText'></span>
        </p>
      </slot>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    'backText': {
      type: String,
      default: '返回'
    },
    'nextPath': {
      // type:Object
      default: ''
    },
    'nextIcon': {
      type: String,
      default: ''
    },
    'curText': {
      // type:String,
      default: ''
    },
    'decline': {
      default: false
    }
  },
  computed: {
    ...mapState('base', ['backPath'])
  }
}
</script>
