<!--  -->
<template>
  <div class="add">
    <div class="top">
      <span style="font-weight:900" @click="$router.back()">&lt;</span>
      <div style="flex:1">
        <h3 style="text-align: center; margin-bottom: 5px">添加好友</h3>
      </div>
    </div>
    <hr style="border: 0.4px solid #fff" />
    <div class="cont">
      <input v-model="username" class="text" type="text" />
      <span class="search" @click="search">搜索</span>
    </div>
    <div class="container" v-for="item in users" :key="item.id">
      <img class="fimg" :src="item.headerimg" alt="" />
      <span style="flex: 1; font-size: 14px">{{ item.username }}</span>
      <span @click="addFriend(item.id)">+</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      users: {}
    };
  },
  methods: {
    async search() {
      const res = await this.$http.get(`finduser/${this.username}`);
      this.users = res.data;
    },
    addFriend(id) {
      this.$socket.emit("request", {
        me: parseInt(localStorage.chatme),
        friend: id
      });
      this.$notify({
        type: "success",
        message: "请求已发送",
        duration: 1000
      });
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.add {
  background-color: lightblue;
  height: 100vh;
  padding: 5px 15px;
}
.top {
  display: flex;
}
.cont {
  display: flex;
  align-items: center;
}
.text {
  margin: 10px 0;
  height: 30px;
  border-radius: 5px 0 0 5px;
  border: none;
  background-color: #f9fafe;
  flex: 1;
  text-indent: 10px;
}
.text:focus {
  outline: 1px solid greenyellow;
}
.search {
  display: inline-block;
  background-color: #f9fafe;
  border: none;
  line-height: 31px;
  font-size: 14px;
  border-left: 1px solid #ccc;
  padding: 0 10px;
  border-radius: 0 5px 5px 0;
}
.container {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.fimg {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-right: 15px;
}
</style>
