<template>
  <div class="_full_router component-chat-dialogue">
    <div class="_full_inner">
      <top-handle :back-text='"微信"' :cur-text='topModel.curText' :next-path='topModel.nextPath' :next-icon='topModel.nextIcon'>
        <p class="_effect" slot='center' :class="{'_effect--50':decline}">
          <span class="top-title__text _ellipsis" v-text='topModel.curText'></span>
          <span class="top-title__num parentheses" v-text="chat_member.length" v-show="dialogue_type==='group'"></span>
          <span class="iconfont icon-mute" v-show='topModel.isMute'></span>
        </p>
      </top-handle>

      <div class="_cover-content _effect" :class="{'_effect--30':decline}">
        <section class="dialogue-section">
          <div class="dialogue-section-inner">
            <div class="dialogue-item dialogue-item--others">
            </div>
            <div class="dialogue-item dialogue-item--time">
            </div>
            <div class="dialogue-item dialogue-item--self">
            </div>
          </div>
        </section>
        <footer class="dialogue-footer">
          <component :is='dialogue_bar_type'></component>
        </footer>
      </div>

    </div>
    <!-- router -->
    <router-view transition="cover"></router-view>
  </div>
</template>

<script>
import topHandle from '../../components/top-handle'
import dialogueBarPerson from '../../components/dialogue-bar-person'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      decline: false,
      dialogue_bar_type: 'dialogueBarPerson',
      topModel: {
        curText: '',
        isMute: true,
        nextPath: {
          path: '/chat/dialogue/chat-detail'
        },
        nextIcon: 'icon-chat-person'
      }
    }
  },
  computed: {
    ...mapState('chat', ['chat_member', 'dialogue_type'])
  },
  components: {
    topHandle,
    dialogueBarPerson
  }
}
</script>

<style scoped>
.component-chat-dialogue {}

.dialogue-section {
    height: calc(100% - 50px);
}

.dialogue-section-inner {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    overflow: auto;
}

.dialogue-footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50px;
}
</style>
