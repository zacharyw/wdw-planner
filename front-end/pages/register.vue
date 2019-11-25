<template>
  <div>
    <div class="section">
      <div class="container">
        <div v-if="this.$auth.loggedIn">
          <p class="content">Logged in as {{ this.$auth.user.email }}.</p>
          <LogoutButton></LogoutButton>
        </div>
        <div v-else>
          <LoginCard :register-form="true">
            <template #title>
              <h1 class="title is-1">Register</h1>
            </template>
          </LoginCard>
          <p class="content has-text-centered" style="margin-top: 1rem;">
            Already have an account?
            <nuxt-link to="/login">Log in here</nuxt-link>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginCard from '~/components/Authentication/LoginCard.vue';
import LogoutButton from '~/components/Authentication/LogoutButton.vue';

export default {
  auth: false,
  components: {
    LoginCard,
    LogoutButton
  }
};
</script>
