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
    },
    {
      path: "/users/:userId",
      component: UserDetail,
    },
  ],
})

const app = new Vue({
  router: router
}).$mount("#app")
