<template>
  <div class="section">
    <div class="container">
      <List :itinerary-data="itineraries" />
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
  }
};
</script>

<style scoped></style>
