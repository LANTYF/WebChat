<!--  -->
<template>
  <div class="friend">
    <h5 style="text-align: center; margin: 10px 0; color: #fff">好友列表</h5>
    <hr style="border: 0.4px solid #fff">
    <div class="container">
      <div class="cont" v-for="item in $store.state.friends" :key="item.id">
        <img :class="{disonline: !item.isonline}" class="friendsimg" :src="item.headerimg" alt="">
        <span style="color: #fff; font-size: 12px">{{item.username}}</span>
        <span class="state">{{item.isonline ? "online" : "offline"}}</span>
        <van-button color="rgba(255,255,255,0.2)" size="mini" @click="toChat(item.id)">chat</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toChat(id) {
      this.$router.push(`/main/chatview/${id}`)
    }
  },
  created() {
    this.$socket.emit()
  }
}

</script>

<style scoped>
.friend {
  padding: 5px 0
}
.container {
  padding: 10px 15px
}
.cont {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background-color: rgba(255,255,255,0.3);
  padding: 5px 10px;
  border-radius: 5px
}
.friendsimg {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-right: 20px
}
.disonline {
  filter: grayscale(1)
}
.state {
  font-size: 9px;
  color: #fff;
  margin-left: 20px;
  margin-right: 70px;
}
</style>