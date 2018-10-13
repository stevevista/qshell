<template>
  <div id="wechat">
    <ul class="wechat-list">
      <msg-item v-for="session in $store.state.dialogues" :item="session" class="list-row line-bottom" :key="session.id"></msg-item>
    </ul>
  </div>
</template>

<script>
import MsgItem from './msg-item'
export default {
  components: {
    MsgItem
  }
}
</script>

<style>
  @import "../../assets/css/wechat.css";
</style>
