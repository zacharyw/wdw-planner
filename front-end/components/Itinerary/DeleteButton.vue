<template>
  <b-button type="is-danger" :disabled="deleting" @click="deleteItinerary()">
    <span v-show="!deleting">Delete</span>
    <span v-show="deleting">Deleting...</span>
  </b-button>
</template>

<script>
import gql from 'graphql-tag';

export default {
  name: 'DeleteButton',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      deleting: false
    };
  },
  methods: {
    deleteItinerary: function() {
      this.deleting = true;

      const forReal = confirm('Are you sure you want to delete? ' + this.name);

      if (!forReal) {
        this.deleting = false;
        return;
      }

      const client = this.$apollo.getClient();

      const mutation = gql`
        mutation deleteItinerary($id: ID!) {
          deleteItinerary(id: $id) {
            id
          }
        }
      `;

      const variables = { id: this.id };

      client
        .mutate({ mutation: mutation, variables: variables })
        .then(({ data }) => {
          this.$emit('itinerary-deleted', this.id);

          this.$buefy.toast.open({
            message: 'Itinerary deleted.'
          });
        })
        .catch(error => {
          console.error(error);
          this.deleting = false;

          this.$buefy.toast.open({
            message: 'Itinerary failed to delete, please try again.',
            type: 'is-danger'
          });
        });
    }
  }
};
</script>

<style scoped></style>
