<!--  -->
<template>
  <div class="list">
    <div style="display: flex;">
      <span @click="$router.back()">&lt;</span>
      <div style="flex: 1">
        <h4 style="text-align:center; margin-bottom: 10px">好友申请列表</h4>
      </div>
    </div>
    <hr style="border: 0.4px solid #fff">
    <div class="list-container">
      <div class="cont" v-for="item in friendslist" :key="item.id">
        <img class="friendimg" :src="item.headerimg" alt="">
        <span style="flex: 1">{{item.username}}</span>
        <van-button style="margin-right: 10px" type="danger" size="mini" @click="remove(item.id)">删除</van-button>
        <van-button type="primary" size="mini" @click="agree(item.id)">同意</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      friendslist: []
    }
  },
  props:['id'],
  methods: {
    async fetch() {
      const res = await this.$http.get(`/friend/${this.id}`)
      console.log(res.data);
      
      this.friendslist = res.data
    },
    agree(id) {
      this.$socket.emit('agree', {
        mid: this.id,
        uid: id
      })
      this.remove(id)
    },
    async remove(id) {
      await this.$http.delete(`/friend/${id}`)
      this.fetch()
      this.$router.go(-1)
    }
  },
  created() {
    this.fetch()
  }
}

</script>

<style scoped>
.list {
  padding: 5px 15px
}
.list-container {
  padding: 10px 0
}
.cont {
  display: flex;
  align-items: center;
  margin-bottom: 10px
}
.friendimg {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-right: 20px
}
</style>