<template>
  <div class="section">
    <div class="container">
      <List :itinerary-data="itineraries" />
      <b-button @click="createItinerary">New Itinerary</b-button>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import List from '~/components/Itinerary/List.vue';

export default {
  name: 'HomePage',
  components: {
    List
  },
  data() {
    return {
      itineraries: []
    };
  },
  async asyncData(context) {
    const { data } = await context.app.apolloProvider.defaultClient.query({
      query: gql`
        query {
          itineraries {
            id
            name
            hotel
            checkIn
            checkOut
          }
        }
      `
    });

    return {
      itineraries: data.itineraries
    };
  },
  methods: {
    createItinerary: function() {
      const client = this.$apollo.getClient();

      const mutation = gql`
        mutation {
          createItinerary {
            id
          }
        }
      `;

      client.mutate({ mutation: mutation }).then(({ data }) => {
        this.$router.push('/itineraries/' + data.createItinerary.id);
      });
    }
  }
};
</script>

<style scoped></style>
