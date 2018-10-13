<template>
  <div id="wx-header">
    <div class="other">
      <span class="iconfont icon-tips-jia" v-show="$route.path==='/'" v-on:click="$store.commit('toggleTipsStatus')"></span>
      <router-link tag="span" to="/contact/add-friend" class="iconfont icon-tips-add-friend" v-show="$route.path==='/contact'"></router-link>
      <span v-show="$route.path==='/contact/new-friends'">添加朋友</span>
      <span class="iconfont icon-chat-friends" v-show="$route.path==='/wechat/dialogue'"></span>

      <ul class="tips-menu" :class="[$store.state.tipsOpen ? 'tips-open' : 'tips-close']" v-on:click="$store.commit('toggleTipsStatus', -1)">
        <li> 
          <span class="iconfont icon-tips-xiaoxi"></span>
          <div>发起群聊</div>
        </li>
        <router-link tag="li" to="/chat/add-friend"> 
          <span class="iconfont icon-tips-add-friend"></span>
          <div>添加朋友</div>
        </router-link>
        <li> <span class="iconfont icon-tips-saoyisao"></span>
          <div>扫一扫</div>
        </li>
        <li> <span class="iconfont icon-tips-fukuan"></span>
          <div>收付款</div>
        </li>
      </ul>
    </div>
    <div class="center">
      <span>{{$store.state.pageName}}</span>
    </div>
  </div>
</template>

<script>
export default {
}
</script>
