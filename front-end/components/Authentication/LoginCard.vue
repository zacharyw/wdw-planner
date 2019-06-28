<template>
  <div>
    <form @submit.prevent="login">
      <div class="modal-card" style="width:300px;">
        <slot name="title"></slot>
        <section class="modal-card-body">
          <b-message
            type="is-danger"
            aria-close-label="Close message"
            :active.sync="hasError"
          >
            {{ error }}
          </b-message>
          <b-field label="Email">
            <b-input
              v-model="email"
              type="email"
              placeholder="Your email"
              required
            >
            </b-input>
          </b-field>

          <b-field label="Password">
            <b-input
              v-model="password"
              type="password"
              password-reveal
              placeholder="Your password"
              required
            >
            </b-input>
          </b-field>

          <b-checkbox>Remember me</b-checkbox>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary">Login</button>
        </footer>
      </div>
    </form>
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
    }
  }
};
</script>
