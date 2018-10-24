const getUsers = (callback) => {
  setTimeout(() => {
    callback(null, [
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
    ])
  }, 1000);
}

var UserList = {
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

var router = new VueRouter({
  routes: [
    {
      path: "/top",
      component: {
        template: "<div>this is top(component)</div>",
      },
    },
    {
      path: "/users",
      component: UserList
    },
    {
      path: "/users/:userId",
      component: UserDetail
    },
  ],
})

var app = new Vue({
  router: router
}).$mount("#app")
