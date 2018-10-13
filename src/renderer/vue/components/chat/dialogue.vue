<template>
  <div class="dialogue">
    <header id="wx-header">
      <div class="other">
        <router-link 
          :to="{path:'/chat/dialogue/dialogue-detail', query: {id: $route.query.id}}" 
          tag="span" 
          class="iconfont" 
          :class="{'icon-chat-group': dialogue.type === 'group', 'icon-chat-friends': dialogue.type !== 'group'}"></router-link>
      </div>
      <div class="center">
        <router-link to="/" tag="div" class="iconfont icon-return-arrow">
          <span>微信</span>
        </router-link>
        <span>{{$route.query.name}}</span>
          <span class="parentheses" v-show="dialogue.type === 'group'">{{dialogue.users.length}}</span>
      </div>
    </header>
    <section class="dialogue-section clearfix">
      <div class="row clearfix" v-for="item in dialogue.messages">
        <img :src="item.user.headerUrl" class="header">
        <p class="text">{{item.text}}</p>
      </div>
    </section>
    <footer class="dialogue-footer">
      <div class="component-dialogue-bar-person">
        <span class="iconfont icon-dialogue-jianpan" v-show="!currentChatWay" v-on:click="currentChatWay=true"></span>
        <span class="iconfont icon-dialogue-voice" v-show="currentChatWay" v-on:click="currentChatWay=false"></span>
        <div class="chat-way" v-show="!currentChatWay">
          <div class="chat-say" @click="toggleTalk">
            <span class="one">按住 说话</span>
            <span class="two">松开 结束</span>
          </div>
        </div>
        <div class="chat-way" v-show="currentChatWay">
          <input class="chat-txt" type="text" v-on:focus="focusIpt" v-on:blur="blurIpt"/>
        </div>
        <span class="expression iconfont icon-dialogue-smile"></span>
        <span class="more iconfont icon-dialogue-jia"></span>
        <div class="recording" style="display: none;" id="recording">
          <div class="recording-voice" style="display: none;" id="recording-voice">
            <div class="voice-inner">
              <div class="voice-icon"></div>
              <div class="voice-volume">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
              </div>
            </div>
            <p>手指上划,取消发送</p>
          </div>
          <div class="recording-cancel" style="display: none;">
            <div class="cancel-inner"></div>
            <p>松开手指,取消发送</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentChatWay: true,
      isTalking: false,
      timer: null
    }
  },
  computed: {
    dialogue() {
      for (const d of this.$store.state.dialogues) {
        if (d.id === +this.$route.query.id) {
          return d
        }
      }
    }
  },
  methods: {
    toggleTalk() {
      this.isTalking = !this.isTalking
      const recording = document.querySelector('.recording')
      const recordingVoice = document.querySelector('.recording-voice')
      recording.style.display = recordingVoice.style.display = this.isTalking ? 'block' : 'none'
    },
    focusIpt() {
      this.timer = setInterval(function() {
        document.body.scrollTop = document.body.scrollHeight
      }, 100)
    },
    blurIpt() {
      clearInterval(this.timer)
    }
  }
}
</script>

<style>
    @import "../../assets/css/dialogue.css";
    .say-active {
        background: #c6c7ca;
    }
</style>
