import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import ChooseItem from "../views/ChooseItem";
import Main from '../views/Main.vue';
import MessageView from "../views/MessageView";
import Add from "../components/Add.vue";
import FriendRequest from '../components/FriendRequest.vue'
import Friends from '../views/Friends.vue';
import Chatview from '../views/ChatView.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "/",
        component: ChooseItem
      },
      {
        path: '/main',
        component: Main,
        children: [
          {
            path: "/main/:id",
            component: MessageView,
            props: true,
          },
          {
            path: '/main/friends/:id',
            component: Friends,
            props: true
          },
          {
            path: "/main/add/:id",
            component: Add,
            props: true
          },
          {
            path: "/main/friend/request/:id",
            component: FriendRequest,
            props: true
          },
          {
            path: "/main/Chatview/:id",
            component: Chatview,
            props: true
          }
        ]
      },
    ]
  },
];

const router = new VueRouter({
  routes
});

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default router;
