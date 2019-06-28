<template>
  <div>
    <div class="section">
      <div class="container">
        <div v-if="this.$auth.loggedIn">
          <p class="content">Logged in as {{ this.$auth.user.email }}.</p>
          <LogoutButton></LogoutButton>
        </div>
        <div v-else>
          <LoginCard>
            <template #title>
              <h1 class="title is-1">Login</h1>
            </template>
          </LoginCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginCard from '~/components/Authentication/LoginCard.vue';
import LogoutButton from '~/components/LogoutButton.vue';

export default {
  components: {
    LoginCard,
    LogoutButton
  }
};
</script>
