<template>
  <b-button type="is-light" @click="logout">Log Out</b-button>
</template>

<script>
export default {
  methods: {
    logout: function() {
      this.$auth.logout().catch(e => {
        this.error = e + '';
      });
    }
  }
};
</script>
