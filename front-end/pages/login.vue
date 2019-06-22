<template>
  <div>
    <div class="section">
      <div class="container">
        <b-message
          type="is-danger"
          aria-close-label="Close message"
          :active.sync="hasError"
        >
          {{ error }}
        </b-message>
        <div v-if="this.$auth.loggedIn">
          <p class="content">Logged in as {{ this.$auth.user.email }}.</p>
          <b-button type="is-danger" @click="logout">Log Out</b-button>
        </div>
        <div v-else>
          <h1 class="title is-1">Log In</h1>
          <b-field label="Email">
            <b-input
              v-model="email"
              type="email"
              placeholder="Enter email"
            ></b-input>
          </b-field>
          <b-field label="Password">
            <b-input
              v-model="password"
              type="password"
              placeholder="Enter password"
            ></b-input>
          </b-field>
          <p class="control">
            <b-button type="is-primary" @click="login">
              Log In
            </b-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: null
    };
  },
  computed: {
    hasError: function() {
      return this.error != null;
    }
  },
  methods: {
    login: function() {
      this.$auth
        .loginWith('local', {
          data: {
            user: {
              email: this.email,
              password: this.password
            }
          }
        })
        .catch(e => {
          this.error = e + '';
        });
    },
    logout: function() {
      this.$auth.logout().catch(e => {
        this.error = e + '';
      });
    }
  }
};
</script>
