export default [
  {
    base: {
      id: 1,
      name: '大猫',
      nickname: 'nick_大猫',
      remark: 'remark_大猫',
      wxid: 'wxid_damao',
      qq: '13445522',
      email: '13445522@qq.com',
      type: 'friends',
      iconSrc: `file://${__static}/images/cat.jpg`.replace(/\\/g, '/'),
      qrCode: '',
      signature: '个性签名',
      telphone: '13888888888',
      area: ['中国', '北京', '海淀'],
      selfPhotos: [{imgSrc: ''}]
    },
    // 对话列表基本项
    chatBaseModel: {
      newsUnreadCount: 1,
      endTimeStr: 1472632586443,
      endChatAuth: '大猫',
      endChatTxt: '听说小区来了一只大黄狗？'
    },
    // 对话框底部菜单
    chatDialogueBarModel: {
      menu: []
    },
    chatDialogueModel: [],
    chatMemberModel: [{
      id: 1,
      iconSrc: `file://${__static}/images/cat.jpg`.replace(/\\/g, '/'),
      name: '大猫',
      nickname: 'nick_大猫',
      remark: 'remark_大猫'
    }],
    chatConfigModel: {
      isStick: false, // 置顶
      newsMute: false, // 消息免打扰
      starFriends: false, // 标星
      lookMePhotos: true,
      lookHisPhotos: true,
      blacklist: false // 黑名单
    }
  }, {
    base: {
      id: 2,
      name: '微信群01',
      nickname: 'nick_微信群01',
      remark: 'remark_微信群01',
      wxid: 'wxid_group01',
      qq: '00002',
      email: null,
      type: 'group',
      iconSrc: `file://${__static}/images/group.jpg`.replace(/\\/g, '/'),
      qrCode: '',
      signature: '个性签名'
    },
    chatBaseModel: {
      newsUnreadCount: 1,
      endTimeStr: 1472632586443,
      endChatAuth: '领导',
      endChatTxt: '大家下班的时候记得锁好门'
    },
    // 对话框底部菜单
    chatDialogueBarModel: {
      menu: []
    },
    chatDialogueModel: [],
    chatMemberModel: [{
      id: 1,
      iconSrc: `file://${__static}/images/cat.jpg`.replace(/\\/g, '/'),
      name: 'damao01',
      nickname: 'nick_微信群01',
      remark: 'remark_微信群01'
    }, {
      id: 1,
      iconSrc: `file://${__static}/images/cat.jpg`.replace(/\\/g, '/'),
      name: 'damao02',
      nickname: 'nick_微信群01',
      remark: 'remark_微信群01'
    }],
    chatConfigModel: {
      chatBackground: null, // 背景
      groupNotice: '', // 群公告
      isStick: false, // 置顶
      newsMute: true, // 消息免打扰
      contactsSave: false,
      showGroupNickname: true // 显示群聊天昵称
    }
  }, {
    base: {
      id: 1,
      name: '饿了么',
      nickname: '饿了么',
      remark: '饿了么',
      wxid: 'iloveleme',
      qq: '00000',
      email: '000000@qq.com',
      type: 'service',
      iconSrc: `file://${__static}/images/er.jpg`.replace(/\\/g, '/'),
      qrCode: '',
      signature: '个性签名',
      telphone: '18812345678',
      area: ['中国', '北京', '海淀'],
      selfPhotos: [{imgSrc: ''}]
    },
    // 对话列表基本项
    chatBaseModel: {
      newsUnreadCount: 0,
      endTimeStr: 1472632586443,
      endChatAuth: '',
      endChatTxt: '饿了么网上订餐平台'
    },
    // 对话框底部菜单
    chatDialogueBarModel: {
      menu: [{
        title: '我要订餐',
        url: '//m.ele.me/',
        subMenu: []
      }, {
        title: '关注必读',
        url: '',
        subMenu: []
      }, {
        title: '联系我们',
        url: '//m.ele.me/',
        subMenu: []
      }]
    },
    chatDialogueModel: [{
      id: 1,
      name: '饿了么',
      nickname: '饿了么',
      remark: '饿了么',
      wxid: 'iloveleme',
      qq: '00000',
      email: '00000@qq.com',
      type: 'service',
      iconSrc: '',
      qrCode: '',
      signature: '个性签名',
      telphone: '18812345678',
      area: ['中国', '北京', '海淀'],
      selfPhotos: [{imgSrc: ''}]
    }],
    chatMemberModel: [],
    chatConfigModel: {
      isStick: false, // 置顶
      newsMute: false, // 消息免打扰
      starFriends: false, // 标星
      lookMePhotos: true,
      lookHisPhotos: true,
      blacklist: false // 黑名单
    }
  }
]
