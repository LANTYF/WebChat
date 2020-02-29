<!--  -->
<template>
  <div>
    <router-view></router-view>
    <van-tabbar v-model="active" active-color="lightblue">
      <van-tabbar-item icon="chat-o" @click="toMessage">消息</van-tabbar-item>
      <van-tabbar-item icon="friends-o" @click="toFriends">好友</van-tabbar-item>
      <van-tabbar-item icon="star-o">动态</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      id: this.$store.state.id
    }
  },
  methods: {
    toMessage() {
      this.$router.push(`/main/${this.id}`)
    },
    toFriends() {
      this.$router.push(`/main/friends/${this.id}`)
    },
     socketEmitFriends() {
      this.$socket.emit("friends", {
        me: this.id,
        socketid: this.$socket.id
      })
    },
    socketOnGet() {
      this.$socket.on("get", res => {
        this.$store.commit("getFriends", {
          friends: res.data
        })
      })
    },
     socketLogin() {
      this.$socket.on("login", data => {
        if (data.state === "ok") {
          this.$store.commit("fix");
        }
      });
    },
    socketLogout() {
      this.$socket.on("logout", data => {
        this.$store.commit("fix");
        this.$dialog
          .confirm({
            title: "是否重新登录",
            message: data.msg
          })
          .then(() => {
            this.$socket.emit("login", this.user);
          })
          .catch(() => {
            return;
          });
      });
    },
  },
  created() {
    setInterval(() => {
      this.socketEmitFriends()
    }, 10000)
    this.socketOnGet()
    this.socketLogin();
    this.socketLogout();
  }
}

</script>

<style lang='scss'>
</style>