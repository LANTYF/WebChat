<!--  -->
<template>
  <div class="charview">
    <div class="top">
      <span @click="$router.back()">&lt;</span>
      <div class="friend">
        <span class="friendname">{{ friend.username }}</span>
        <span style="font-size: 9px">
          {{
          friend.isonline ? "在线" : "离线"
          }}
        </span>
      </div>
    </div>
    <better-scroll class="wrapper" ref="scroll">
       <div class="container">
          <div
          class="chatitem"
          :class="{ self: item.sender.username == $store.state.user.username }"
          v-for="(item, i) in chatlist"
          :key="i"
        >
          <img
            :src="item.sender.headerimg"
            alt
          />
          <span class="msg">{{ item.message }}</span>
        </div>
       </div>
    </better-scroll>
    <div class="bottom">
      <input type="text" v-model="message" @keydown.enter="sendMsg" />
      <button class="btn" @click="sendMsg">发送</button>
    </div>
  </div>
</template>

<script>
import BetterScroll from "../components/BetterScroll";
export default {
  data() {
    return {
      friend: {},
      message: "",
      chatlist: []
    };
  },
  components: {
    BetterScroll
  },
  props: ["id"],
  methods: {
    socketChat() {
      this.$socket.emit("chatWithFriend", {
        friendid: this.id,
        socketid: this.$socket.id
      });
      this.$socket.on("chatWithFriend", res => {
        this.friend = res.data[0];
        this.getchatlist(res.data[0]);
        this.removeMsg(this.friend);
      });
    },
    sendMsg() {
      let msg = {
        sender: this.$store.state.user,
        recipient: this.friend,
        message: this.message,
        date: new Date().getTime()
      };
      if (this.message.length == 0) {
        this.$toast({
          message: "不能发送空白内容"
        });
        this.message = "";
      } else {
        this.chatlist.push(msg);
        this.message = "";
        let strKey =
          "chat-" +
          this.$store.state.user.username +
          "-" +
          this.friend.username;
        let newArr = sessionStorage[strKey] ? JSON.parse(sessionStorage[strKey]) : []
        newArr.push(msg)
        sessionStorage[strKey] = JSON.stringify(newArr)
        this.$socket.emit("sendmsg", msg);
      }
      this.scrollToBottom()
    },
    socketGetMsg() {
      this.$socket.on("getmessage", data => {
        this.chatlist.push(data)
      });
    },
    getchatlist(friend) {
      let strkey1 = "chat-" + friend.username + "-" + this.$store.state.user.username;
      this.chatlist = sessionStorage[strkey1] ? JSON.parse(sessionStorage[strkey1]) : [];
      let strkey2 = "chat-" + this.$store.state.user.username + "-" + friend.username;
      let newArr = sessionStorage[strkey2] ? JSON.parse(sessionStorage[strkey2]) : [];
      this.chatlist.push(...newArr)
      this.chatlist = this.chatlist.sort((a, b) => (a.date - b.date))
      this.scrollToBottom()
    },
    async removeMsg(friend) {
      await this.$http.get(
        `/removemsg?sender=${friend.username}&recipient=${this.$store.state.user.username}`
      );
    },
    scrollToBottom() {
      // setTimeout(() => {
      //   let divs = document.querySelectorAll(".chatitem")
      //   this.$refs.scroll.scrollToElement(divs[divs.length - 1])
      // })
          let divs = document.querySelectorAll(".chatitem")
          this.$nextTick(() => {
            this.$refs.scroll && this.$refs.scroll.scrollToElement(divs[divs.length - 1])
    
          })
    }
  },
  created() {
    this.socketChat();
    this.socketGetMsg()
  },
  updated() {
    this.scrollToBottom()
  },
};
</script>

<style scoped>
.charview {
  height: 100vh;
  position: relative;
}
.top {
  display: flex;
  color: #fff;
  padding: 5px 15px;
  align-items: center;
  background-color: lightblue;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.friend {
  flex: 1;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
}
.friendname {
}
.bottom {
  position: fixed;
  bottom: 0;
  z-index: 999;
  left: 0;
  right: 0;
  height: 45px;
  display: flex;
  background-color: lightblue;
  align-items: center;
  padding: 5px 10px;
  z-index: 999;
}
.bottom input {
  height: 35px;
  border: none;
  flex: 1;
  text-indent: 15px;
  margin-right: 10px;
  border-radius: 5px;
  font-weight: 300;
  font-size: 14px;
}
.btn {
  height: 35px;
  background-color: #fff;
  border: none;
  padding: 0 16px;
  font-size: 12px;
  border-radius: 5px;
}
.container {
  padding: 0 15px;
  background-color: rgba(233, 233, 233, 0.3);
}
.chatitem {
  display: flex;
  align-items: center;
}
.chatitem img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin: 10px 0;
}
.chatitem .msg {
  display: inline-block;
  background-color: #bbb;
  padding: 5px 10px;
  border-radius: 5px;
  position: relative;
  margin-left: 20px;
  max-width: 200px;
  word-break: break-all;
  font-size: 14px;
  font-weight: 300;
  min-height: 20px;
}
.chatitem .msg:before {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  border: 5px solid;
  border-color: transparent transparent #bbb;
  transform: rotate(-90deg);
  left: -10px;
  bottom: 5px;
}
.chatitem.self {
  flex-direction: row-reverse;
}
.chatitem.self .msg {
  margin-right: 20px;
  margin-left: initial;
}
.chatitem.self .msg:before {
  right: -10px;
  left: initial;
  transform: rotate(90deg);
}
.wrapper {
  position: absolute;
  top: 44px;
  bottom: 50px;
  width: 100%;
  overflow-y: scroll;
  background-color: rgba(233, 233, 233, 1);
}
</style>
