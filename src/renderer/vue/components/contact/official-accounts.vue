<template>
    <!--公众号组件-->
    <div :class="{'search-open-contact':!$store.state.showHeader}" class="official-account">
        <header id="wx-header">
            <div class="center">
                <router-link to="/contact" tag="div" class="iconfont icon-return-arrow">
                    <span>通讯录</span>
                </router-link>
                <span>公众号</span>
            </div>
        </header>
         <!--这里的 search 组件的样式也需要修改一下-->
        <search></search>
        <!--公众号集合-->
        <template v-for="(value,key) in OfficialAccountsList">
            <div class="weui-cells__title">{{key}}</div>
            <div class="weui-cells">
                <div class="weui-cell weui-cell_access" v-for="item in value">
                    <div class="weui-cell__hd">
                        <img :src="item.headerUrl" class="home__mini-avatar___1nSrW">
                    </div>
                    <div class="weui-cell__bd">
                        {{item.name}}
                    </div>
                </div>
            </div>
        </template>
</div>
</template>
<script>
import Search from '../common/search'
export default {
  components: {
    Search
  },
  computed: {
    initialList: function() {
      const initialList = []
      const OfficialAccounts = this.$store.state.officialAccounts
      for (const a of OfficialAccounts) {
        if (initialList.indexOf(a.initial) === -1) {
          initialList.push(a.initial)
        }
      }
      return initialList.sort()
    },
    OfficialAccountsList() {
      const OfficialAccountsList = {}
      const OfficialAccounts = this.$store.state.officialAccounts
      for (const protoTypeName of this.initialList) {
        OfficialAccountsList[protoTypeName] = []
        for (const a of OfficialAccounts) {
          if (a.initial === protoTypeName) {
            OfficialAccountsList[protoTypeName].push(a)
          }
        }
      }
      return OfficialAccountsList
    }
  }

}
</script>
<style>
    .official-account {
        padding-bottom: 20px;
    }
    
    .official-account .weui-cell_access:active {
        background-color: rgba(177, 177, 177, 0.53)
    }
</style>
