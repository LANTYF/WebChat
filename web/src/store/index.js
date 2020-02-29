import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    islogin: false,
    id: '',
    friends: [],
    issocket: false
  },
  mutations: {
    fix(state) {
      state.islogin = !state.islogin
    },
    getUser(state, data) {
      state.user = data.user
    },
    getid(state, data) {
      state.id = data.id
    },
    getFriends(state, data) {
      state.friends = data.friends
    },
    changeSocket(state) {
      state.issocket = true
    }
  },
  actions: {
    
  },
  modules: {}
});
