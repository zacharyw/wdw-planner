<template>
  <div>
    <client-only placeholder="Loading itineraries...">
      <b-table :data="itineraries" :columns="columns"></b-table>
    </client-only>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  name: 'List',
  apollo: {
    itineraries: {
      prefetch: false,
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
    }
  },
  data() {
    return {
      itineraries: [],
      columns: [
        {
          field: 'name',
          label: 'Name'
        },
        {
          field: 'hotel',
          label: 'Hotel'
        },
        {
          field: 'checkIn',
          label: 'Check In'
        },
        {
          field: 'checkOut',
          label: 'Check Out'
        }
      ]
    };
  }
};
</script>

<style scoped></style>
