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
          <a class="navbar-item" href="/">
            My Itineraries
          </a>
          <a class="navbar-item" href="/itineraries/browse">
            Browse Itineraries
          </a>

          <feature-toggle name="guides-menu" :value="true">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                Guides
              </a>

              <div class="navbar-dropdown">
                <a class="navbar-item">
                  Basic Disney World Planning Guide
                </a>
                <a class="navbar-item">
                  Disney World Resort Guide
                </a>
                <hr class="navbar-divider" />
                <a class="navbar-item">
                  Basic FastPass+ Guide
                </a>
                <a class="navbar-item">
                  Magic Kingdom FastPass Guide
                </a>
                <a class="navbar-item">
                  Epcot FastPass Guide
                </a>
                <a class="navbar-item">
                  Hollywood Studios FastPass Guide
                </a>
                <a class="navbar-item">
                  Animal Kingdom FastPass Guide
                </a>
                <hr class="navbar-divider" />
                <a class="navbar-item">
                  Basic Dining Guide
                </a>
              </div>
            </div>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                Sample Itineraries
              </a>
              <div class="navbar-dropdown">
                <a class="navbar-item">
                  Two Person / Couple's Disney World Itinerary
                </a>
                <hr class="navbar-divider" />
                <a class="navbar-item">
                  Single Day Magic Kingdom Itinerary
                </a>
                <a class="navbar-item">
                  Single Day Epcot Itinerary
                </a>
                <a class="navbar-item">
                  Single Day Hollywood Studios Itinerary
                </a>
                <a class="navbar-item">
                  Single Day Animal Kingdom Itinerary
                </a>
                <a class="navbar-item">
                  Rest & Relaxation Day at Disney World Itinerary
                </a>
                <hr class="navbar-divider" />
                <a class="navbar-item">
                  Four Day Disney World Itinerary
                </a>
                <a class="navbar-item">
                  Five Day Disney World Itinerary
                </a>
              </div>
            </div>
          </feature-toggle>
          <a v-if="false" class="navbar-item">
            Contact
          </a>
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
import LoginCard from '~/components/Authentication/LoginCard.vue';
import LogoutButton from '~/components/Authentication/LogoutButton.vue';

export default {
  components: {
    LoginCard,
    LogoutButton
  }
};
</script>
