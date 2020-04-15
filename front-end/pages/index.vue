<template>
  <div class="section">
    <div class="container">
      <h1 class="title">Itineraries</h1>
      <List :itinerary-data="itineraries" />
      <b-button id="newButton" @click="newItinerary">New Itinerary</b-button>
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
            shareToken
          }
        }
      `
    });

    return {
      itineraries: data.itineraries
    };
  },
  methods: {
    newItinerary: function() {
      this.$router.push('/itineraries/0');
    }
  }
};
</script>

<style scoped>
#newButton {
  margin-top: 1rem;
}
</style>
