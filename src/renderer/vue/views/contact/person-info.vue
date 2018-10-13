<template>
  <div class="_full_router component-person-info">
    <div class="_full_inner">
      <top-handle
        :back-text="topModel.backText"
        :cur-text="topModel.curText"
        :decline="decline"
        :next-path="topModel.nextPath"
        :next-icon="topModel.nextIcon"
      >
      </top-handle>
      <div class="_cover-content _effect"
                :class="{'_effect--30':decline}">
        <div class="_full _scroll">
          <!-- flag -->
          <div class="weui_cells">
            <div class="weui_cell">
              <div class="card_pic _left" :style="{backgroundImage:'url('+ personInfo.base.iconSrc + ')'}">
              </div>
              <div class="card_line">
                <div class="remark">
                  <span v-text="personInfo.base.remark"></span><span class="gender gender-man"></span>
                </div>
                <p class="wxid"><span>微信号:</span><span v-text="personInfo.base.wxid"></span></p>
                <p class="nickname">
                  <span>昵称:</span>
                  <span v-text="personInfo.base.nickname"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import topHandle from '../../components/top-handle'

export default {
  components: {
    topHandle
  },
  data () {
    return {
      decline: false,
      topModel: {
        backText: '返回',
        curText: '详细资料',
        nextPath: {path: 'person-info-set', append:true},
        nextIcon: 'icon-more'
      }
    }
  },
  computed: {
    ...mapState('contacts', ['personInfo'])
  }
}
</script>