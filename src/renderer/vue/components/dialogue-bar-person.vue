<template>
  <div class="component-dialogue-bar-person">
    <v-touch @tap="switch_way('txt')" v-show="way === 'say'">
      <span class="iconfont icon-dialogue-jianpan"></span>
    </v-touch>
    <v-touch @tap="switch_way('say')" v-show="way === 'txt'">
      <span class="iconfont icon-dialogue-voice"></span>
    </v-touch>
  </div>
</template>

<script>
export default {
  data () {
    return {
      way: 'txt',
      state_say: false,
      say_cancel: false
    }
  },
  methods: {
    switch_way (way) {
      this.way = way
    }
  }
}
</script>
