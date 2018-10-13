<template>
  <div class="weui-cell moments__post">
    <div class="weui-cell__hd">
      <img :src="moment.user.headerUrl">
    </div>
    <div class="weui-cell__bd">
      <a class="title">
        <span>{{moment.user.displayName}}</span>
      </a>
      <p id="paragraph" class="paragraph">{{moment.post}}</p>
      <div class="thumbnails my-gallery">
        <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject" class="thumbnail" v-for="(pic, i) in moment.photos">
          <a :href="pic" itemprop="contentUrl" data-size="400x400">
            <img :src="pic" itemprop="thumbnail" alt="Image description" />
          </a>
          <figcaption itemprop="caption description">Image {{i}}</figcaption>
        </figure>
      </div>
      <div class="toolbar">
        <p class="timestamp">{{moment.date}}</p>
        <div>
          <div id="actionMenu" class="actionMenu slideIn">
            <p class="actionBtn" id="btnLike"><i class="icon icon-96"></i></p>
            <p class="actionBtn" id="btnComment"><i class="icon icon-3"></i></p>
          </div>
        </div>
        <span id="actionToggle" class="actionToggle">..</span>
      </div>
      <p class="liketext"><i class="icon icon-96"></i>
        <template v-for="u in moment.likers">
          <span class="nickname">{{u.displayName}}</span>,
        </template>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['moment']
}
</script>
