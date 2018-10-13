<template>
  <li>
    <router-link :to="{ 
      path: '/chat/dialogue', 
      query: { 
        id: item.id,
        name: item.groupName || (item.users[0].displayName),
        }}"
      tag="div" 
      class="list-info"
      v-on:click.native="toggleMsgRead">
      <div class="header-box">
        <i class="new-msg-count" v-show="item.unread && !item.quiet">{{item.unread}}</i>
        <i class="new-msg-dot" v-show="item.unread && item.quiet"></i>
        <div class="header" :class="[item.type === 'group'? 'multi-header':'']">
          <img v-for="userInfo in item.users" :src="userInfo.headerUrl">
        </div>
      </div>

      <div class="desc-box">
        <div class="desc-time">{{item.lastMessage.date | fmtDate('hh:ss')}}</div>
        <div class="desc-author" v-if="item.type === 'group'">{{item.groupName}}</div>
        <div class="desc-author" v-else>{{item.users[0].displayName}}</div>
        <div class="desc-msg">
          <div class="desc-mute iconfont icon-mute" v-show="item.quiet">
          </div>
          <span v-show="item.type === 'group'">{{item.lastMessage.user.displayName}}:</span>
            <span>{{item.lastMessage.text}}</span>
        </div>
      </div>
    </router-link>
  </li>
</template>

<script>
export default {
  props: ['item'],
  filters: {
    fmtDate(date_, fmtExp) {
      const date = new Date(date_)
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(fmtExp)) {
        fmtExp = fmtExp.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmtExp)) {
          fmtExp = fmtExp.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmtExp
    }
  },
  methods: {
    toggleMsgRead() {
      if (this.item.unread) {
        this.$store.commit('toggleMsgRead', this.item.id)
      }
    }
  }
}
</script>
