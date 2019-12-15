<template>
  <div>
    <b-table :data="itineraries">
      <template slot-scope="props">
        <b-table-column field="name" label="Name">
          <nuxt-link :to="'/itineraries/' + props.row.id">
            {{ props.row.name }}
          </nuxt-link>
        </b-table-column>
        <b-table-column field="hotel" label="Hotel">
          {{ props.row.hotel }}
        </b-table-column>
        <b-table-column field="checkIn" label="Check In">
          {{ props.row.checkIn }}
        </b-table-column>
        <b-table-column field="checkOut" label="Check Out">
          {{ props.row.checkOut }}
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    itineraryData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      itineraries: this.itineraryData
    };
  }
};
</script>

<style scoped></style>
