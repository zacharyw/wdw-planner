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
          {{
            props.row.checkIn == null ? '' : props.row.checkIn.substring(0, 10)
          }}
        </b-table-column>
        <b-table-column field="checkOut" label="Check Out">
          {{
            props.row.checkOut == null
              ? ''
              : props.row.checkOut.substring(0, 10)
          }}
        </b-table-column>
        <b-table-column label="Actions">
          <nuxt-link :to="'/itineraries/' + props.row.id">
            <b-button type="is-link">View</b-button>
          </nuxt-link>
          <DeleteButton
            :id="props.row.id"
            :name="props.row.name"
            @itinerary-deleted="deleteItinerary"
          ></DeleteButton>
          <CopyShareButton
            :share-link="baseUrl + '/itinerary/' + props.row.shareToken"
            button-type="is-light"
            button-text="Copy Share Link"
          ></CopyShareButton>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import DeleteButton from '~/components/Itinerary/DeleteButton.vue';
import CopyShareButton from '~/components/Itinerary/CopyShareButton.vue';

export default {
  name: 'List',
  components: {
    DeleteButton,
    CopyShareButton
  },
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
      itineraries: this.itineraryData,
      baseUrl: process.env.baseUrl
    };
  },
  methods: {
    deleteItinerary: function(id) {
      let index = null;
      for (const [i, itinerary] of this.itineraries.entries()) {
        if (itinerary.id === id) {
          index = i;
          break;
        }
      }

      this.itineraries.splice(index, 1);
    }
  }
};
</script>

<style scoped></style>
