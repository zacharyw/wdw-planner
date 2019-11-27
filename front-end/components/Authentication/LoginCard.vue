<template>
  <div>
    <form @submit.prevent="submitForm">
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
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary">{{ submitText }}</button>
        </footer>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    registerForm: Boolean
  },
  data() {
    return {
      email: '',
      password: '',
      error: null,
      registration: this.registerForm
    };
  },
  computed: {
    hasError: function() {
      return this.error != null;
    },
    submitText: function() {
      return this.registration ? 'Register' : 'Login';
    }
  },
  methods: {
    submitForm: function() {
      if (this.registration) {
        this.$axios
          .post('sign_up', {
            user: {
              email: this.email,
              password: this.password
            }
          })
          .then(response => {
            this.login();
          })
          .catch(e => {
            this.error = e + '';
          });
      } else {
        this.login();
      }
    },
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
