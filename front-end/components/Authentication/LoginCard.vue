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
import gql from 'graphql-tag';

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
        const client = this.$apollo.getClient();

        const mutation = gql`
          mutation signUp($email: String!, $password: String!) {
            signUp(email: $email, password: $password) {
              id
            }
          }
        `;

        const variables = {
          email: this.email,
          password: this.password
        };

        client
          .mutate({ mutation: mutation, variables: variables })
          .then(({ data }) => {
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
      this.$auth.loginWith('apollo', {
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>
