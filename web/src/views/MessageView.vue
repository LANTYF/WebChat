<!--  -->
<template>
  <div class="chatview" v-if="user" @click="isshow = false">
    <div class="top">
      <img
        :class="{ disonline: !$store.state.islogin }"
        class="meimg"
        :src="user.headerimg"
      />
      <span style="color: #fff" class="msg">消息</span>
      <span style="color: #fff" @click.stop="showmenu">+</span>
    </div>
    <transition name="menu">
      <div v-if="isshow" class="menu">
        <ul>
          <li>创建群聊</li>
          <li @click="add">加好友/群</li>
          <li @click="friendRequest">
            好友申请
            <span style="color: lightpink; margin-left: 10px">{{
              counts
            }}</span>
          </li>
        </ul>
      </div>
    </transition>
    <hr style="border-color: rgba(gray, 0.1);border-width: 0.4px" />
    <div class="container">
      <div v-for="(item, i) in friendlist" :key="i">
        <div
          class="cont"
          v-if="item.length !== 0"
          @click="$router.push(`/main/chatview/${item[0].sender.id}`)"
        >
          <img class="image" :src="item[0].sender.headerimg" alt="" />
          <div class="content">
            <span>{{ i }}</span>
            <div>{{ item[item.length - 1].message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      isshow: false,
      counts: null,
      friendlist: {},
    };
  },
  inject: ["reload"],
  props: ["id"],
  methods: {
    showmenu() {
      this.isshow = !this.isshow;
    },
    add() {
      this.$router.push(`/main/add/${this.user.id}`);
    },
    friendRequest() {
      this.$router.push(`/main/friend/request/${this.id}`);
    },

    socketadd() {
      this.$socket.on("addfriend", data => {
        this.$notify({
          type: "primary",
          message: data.msg
        });
        this.fetchFriendRequest();
      });
    },
    socketGetMsg() {
        this.$socket.emit("getbeforemessage", this.$store.state.user);
        this.$socket.on("getbeforemessage", data => {
          data.forEach(item => {
            if (!this.friendlist[item.sender.username]) {
              this.getFriendlist();
            }
            this.friendlist[item.sender.username].push(item);
            this.friendlist[item.sender.username] = this.uplicate(this.friendlist[item.sender.username])
            let strkey =
              "chat-" + item.sender.username + "-" + item.recipient.username;
            let newArr = sessionStorage[strkey]
              ? JSON.parse(sessionStorage[strkey])
              : [];
            newArr.push(item);
            newArr = this.uplicate(newArr)
            sessionStorage[strkey] = JSON.stringify(newArr);
          });
        });
        this.$socket.on("getinmessage", data => {
          if (!this.friendlist[data.sender.username]) {
            this.getFriendlist();
          }
          this.friendlist[data.sender.username].push(data);
          this.friendlist[data.sender.username] = this.uplicate(this.friendlist[data.sender.username])
          let strkey =
            "chat-" + data.sender.username + "-" + data.recipient.username;
          if (!sessionStorage[strkey]) {
            sessionStorage[strkey] = Array.from([]);
          }
          let newArr = sessionStorage[strkey]
            ? JSON.parse(sessionStorage[strkey])
            : [];
          newArr.push(data);
          newArr = this.uplicate(newArr)
          sessionStorage[strkey] = JSON.stringify(newArr);
        });
    },
    async fetchUser() {
      const res = await this.$http.get(`userinfo/${this.id}`);
      this.user = res.data[0];
    },
    async fetchFriendRequest() {
      const res = await this.$http.get(`friend/${this.id}`);
      this.counts = res.data.length;
    },
    getFriendlist() {
      let obj = {};
      this.$store.state.friends.forEach(item => {
        obj[item.username] = [];
      });
      this.friendlist = obj;
    },
    uplicate(arr) {
      let obj = {}
      let newarr = arr.reduce((cur, next) => {
        obj[next.date] ? "" : obj[next.date] = true && cur.push(next)
        return cur
      }, [])
      return newarr
    }
  },
  computed: {},
  created() {
    this.getFriendlist();
    this.socketadd();
    this.id && this.fetchUser();
    this.id && this.fetchFriendRequest();
  },
  mounted() {
    this.socketGetMsg();
  }
};
</script>

<style scoped>
.chatview {
  height: 100vh;
}
.top {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  position: relative;
}
.meimg {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
.msg {
  flex: 1;
  text-align: center;
  transform: translateX(-10px);
  font-weight: 900;
  font-size: 14px;
}
.disonline {
  filter: grayscale(1);
}
.menu {
  position: absolute;
  background-color: #fff;
  border-radius: 5px;
  font-size: 14px;
  padding: 15px 10px;
  top: 40px;
  right: 10px;
}
.menu::before {
  content: "";
  height: 0;
  width: 0;
  position: absolute;
  border: 6px solid;
  border-color: transparent transparent #fff;
  right: 5px;
  top: -10px;
}
.menu ul {
  list-style: none;
}
.menu ul li {
  margin-bottom: 10px;
}
.menu ul li:last-child {
  margin: 0;
}
.menu-enter,
.menu-leave-to {
  transform-origin: top right;
}
.menu-enter-active {
  animation: smallin 0.2s;
}
.menu-leave-active {
  animation: smallin 0.2s reverse;
}
@keyframes smallin {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.cont {
  display: flex;
  align-items: center;
  background-color: rgba(233, 233, 233, 0.5);
  padding: 5px 15px;
  margin-bottom: 10px;
}
.image {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
.content {
  margin-left: 10px;
}
.content > div {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
