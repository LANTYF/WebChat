<!--  -->
<template>
  <div>
    <h4 style="text-align: center; padding: 20px 0">选择账号登陆</h4>
    <div class="container">
      <div
        class="item"
        @click="chooseme(item)"
        v-for="item in userlist"
        :key="item.id"
      >
        <img :src="item.headerimg" alt />
        <span>{{ item.username }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userlist: []
    };
  },
  methods: {
    chooseme(item) {
      // localStorage.chatme = item.id;
      this.$store.commit('getid', { id: item.id })
      this.$store.commit('getUser', {user: item})
      this.$socket.emit("login", item);
      this.$router.push(`/main/${item.id}`);
    },
    async fetchUser() {
      const res = await this.$http.get("/user");
      this.userlist = res.data;
    },
    socketConnect() {
      this.$socket.on("connect", () => {
        console.log("与服务器连接成功");
      });
    }
  },
  created() {
    this.fetchUser();
    this.socketConnect();
  }
};
</script>

<style scoped>
.container {
  display: flex;
  margin: 15px;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}
.item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
