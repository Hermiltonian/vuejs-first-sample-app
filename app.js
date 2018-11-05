const Auth = {
  login: function (email, pass, cb) {
    setTimeout(() => {
      if (email === "vue@example.com" && pass === "vue") {
        localStorage.token = Math.random().toString(36).substring(7);
        if (cb) { cb(true) }
      } else {
        if (cb) { cb(false) }
      }
    }, 0);
  },
  logout: function () {
    delete localStorage.token;
  },
  loggedIn: function () {
    return !!localStorage.token;
  },
}

const userData = [
  {
    id: 1,
    name: "Milk",
    description: "I have a pattern like a cow.",
  },
  {
    id: 2,
    name: "Kaka",
    description: "I like eating adn sleeping.",
  },
];

const getUsers = (callback) => {
  setTimeout(() => {
    callback(null, userData)
  }, 1000);
}

const getUser = (userId, callback) => {
  setTimeout(() => {
    const filteredUsers = userData.filter((user) => {
      return user.id === parseInt(userId, 10);
    });

    if (filteredUsers.length > 0) {
      callback(null, filteredUsers[0]);
    } else {
      message = "Error: ";
      message += `User whose id is ${userId} does not exitst.`;
      callback(message, null);
    }
  }, 1000);
}

const postUser = (params, callback) => {
  setTimeout(() => {
    params.id = userData.length + 1;
    userData.push(params);
    callback(null, params);
  }, 1000)
}

const UserList = {
  template: "#user-list",
  data: function () {
    return {
      loading: false,
      error: false,
      users: function () { return [] },
    }
  },
  created: function () {
    this.fetchData();
  },
  watch: {
    "$router": "fetchData",
  },
  methods: {
    fetchData: function () {
      this.loading = true;

      getUsers((function (error, users) {
        this.loading = false;

        if (error) {
          this.error = error.toString();
        } else {
          this.users = users;
        }
      }).bind(this));
    },
  },
}

const UserCreate = {
  template: "#user-create",
  data: function () {
    return {
      sending: false,
      error: null,
      user: this.defaultUser(),
    }
  },
  created: function () {

  },
  methods: {
    defaultUser: function () {
      return {
        name: "",
        description: "",
      }
    },
    createUser: function () {
      if (this.user.name.trim() === "") {
        this.error = "Name must be required.";
        return;
      }

      if (this.user.description.trim() === "") {
        this.error = "Description must be required.";
        return;
      }

      postUser(this.user, ((error, user) => {
        this.sending = false;

        if (error) {
          this.error = error.toString();
        } else {
          this.error = null;
          this.user = this.defaultUser();
          alert("Success creating new user");
          this.$router.push("/users");
        }
      }).bind(this))
    },
  },
}

const UserDetail = {
  template: "#user-detail",
  data: function () {
    return {
      loading: false,
      error: null,
      user: null,
    }
  },
  created: function () {
    this.fetchData();
  },
  watch: {
    "$route": "fetchData",
  },
  methods: {
    fetchData: function () {
      this.loading = true;

      getUser(this.$route.params.userId, ((error, user) => {
        this.loading = false;

        if (error) {
          this.error = error.toString();
        } else {
          this.user = user;
        }
      }).bind(this));
    },
  },
}

const router = new VueRouter({
  routes: [
    {
      path: "/top",
      component: {
        template: "<div>this is top(component)</div>",
      },
    },
    {
      path: "/users",
      component: UserList,
    },
    {
      path: "/users/new",
      component: UserCreate,
      beforeEnter: function (to, from, next) {
        if (!Auth.loggedIn()) {
          next({
            path: "/login",
            query: {
              redirect: to.fullPath,
            },
          });
        } else {
          next();
        }
      },
    },
    {
      path: "/users/:userId",
      component: UserDetail,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/logout",
      beforeEnter: function (to, from, next) {
        Auth.logout();
        next("/");
      },
    },
  ],
})

const app = new Vue({
  router: router
}).$mount("#app")
