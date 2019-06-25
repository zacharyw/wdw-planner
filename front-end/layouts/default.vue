<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          👑 WDW Planner
        </a>

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            Home
          </a>

          <a class="navbar-item">
            Documentation
          </a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              More
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                About
              </a>
              <a class="navbar-item">
                Jobs
              </a>
              <a class="navbar-item">
                Contact
              </a>
              <hr class="navbar-divider" />
              <a class="navbar-item">
                Report an issue
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div v-if="!this.$auth.loggedIn" class="navbar-item">
            <b-dropdown position="is-bottom-left" aria-role="menu">
              <button slot="trigger" class="button is-primary">
                <span>Login</span>
                <b-icon icon="caret-down"></b-icon>
              </button>

              <b-dropdown-item aria-role="menu-item" custom paddingless>
                <LoginCard></LoginCard>
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div v-else class="navbar-item">
            <LogoutButton></LogoutButton>
          </div>
        </div>
      </div>
    </nav>
    <nuxt />
  </div>
</template>

<script>
import LoginCard from '~/components/LoginCard.vue';
import LogoutButton from '~/components/LogoutButton.vue';

export default {
  components: {
    LoginCard,
    LogoutButton
  }
};
</script>
