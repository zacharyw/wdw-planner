<template>
  <div class="section">
    <div class="container">
      <h1 class="title">Browse Itineraries</h1>
      <form @submit.prevent="searchItineraries">
        <HotelSearcher v-model="hotel" :initial-hotel="hotel"></HotelSearcher>
        <b-field label="Nights">
          <b-select v-model="nights" placeholder="Select a number of nights">
            <option
              v-for="option in nightOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </b-select>
        </b-field>
        <div class="block">
          <label class="label">Parks</label>
          <p class="help" style="margin-bottom: .5rem;">
            Find itineraries that include at least one day at a specific park,
            or a day that doesn't involve the parks at all.
          </p>
          <b-checkbox v-model="parks" native-value="Magic Kingdom">
            Magic Kingdom
          </b-checkbox>
          <br />
          <b-checkbox v-model="parks" native-value="Epcot">
            Epcot
          </b-checkbox>
          <br />
          <b-checkbox v-model="parks" native-value="Hollywood Studios">
            Hollywood Studios
          </b-checkbox>
          <br />
          <b-checkbox v-model="parks" native-value="Animal Kingdom">
            Animal Kingdom
          </b-checkbox>
          <br />
          <b-checkbox v-model="parks" native-value="No Park">
            No Park
          </b-checkbox>
          <br />
        </div>
        <button class="button is-primary" :disabled="searching">
          <span v-show="!searching">Search Itineraries</span>
          <span v-show="searching">Searching...</span>
        </button>
      </form>
      <br />
      <b-table :data="itineraries" default-sort="hotel" detailed>
        <template slot-scope="props">
          <b-table-column field="popularity" label="Popularity" sortable>
            {{ props.row.popularity }}
          </b-table-column>
          <b-table-column field="name" label="Name" sortable>
            <nuxt-link :to="'/itinerary/' + props.row.shareToken">
              {{ props.row.name }}
            </nuxt-link>
          </b-table-column>
          <b-table-column field="hotel" label="Hotel" sortable>
            {{ props.row.hotel }}
          </b-table-column>
          <b-table-column field="days" label="Nights" sortable>
            {{ props.row.days.length - 1 }}
          </b-table-column>
          <b-table-column label="Parks">
            {{ parkList(props.row.days) }}
          </b-table-column>
        </template>
        <template slot="detail" slot-scope="props">
          <TimelineView :share-token="props.row.shareToken"></TimelineView>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import HotelSearcher from '~/components/Itinerary/HotelSearcher.vue';
import TimelineView from '~/components/Itinerary/TimelineView.vue';

export default {
  name: 'BrowseItineraries',
  components: {
    HotelSearcher,
    TimelineView
  },
  data() {
    return {
      itineraries: [],
      searching: false,
      hotel: '',
      nights: null,
      parks: [
        'Magic Kingdom',
        'Epcot',
        'Hollywood Studios',
        'Animal Kingdom',
        'No Park'
      ],
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
  },
  computed: {
    nightOptions() {
      return [...Array(31).keys()];
    }
  },
  async asyncData(context) {
    const { data } = await context.app.apolloProvider.defaultClient.query({
      query: gql`
        query searchItineraries($params: SearchItinerariesInput!) {
          searchItineraries(params: $params) {
            id
            name
            hotel
            checkIn
            checkOut
            shareToken
            popularity
            days {
              park
            }
          }
        }
      `,
      variables: {
        params: {
          hotel: '',
          parks: [
            'Magic Kingdom',
            'Epcot',
            'Hollywood Studios',
            'Animal Kingdom',
            'No Park'
          ],
          nights: null
        }
      }
    });

    return {
      itineraries: data.searchItineraries
    };
  },
  methods: {
    async searchItineraries() {
      this.searching = true;
      const client = this.$apollo.getClient();

      const { data } = await client.query({
        query: gql`
          query searchItineraries($params: SearchItinerariesInput!) {
            searchItineraries(params: $params) {
              id
              name
              hotel
              checkIn
              checkOut
              shareToken
              days {
                park
              }
            }
          }
        `,
        variables: {
          params: {
            hotel: this.hotel,
            parks: this.parks,
            nights: this.nights
          }
        },
        fetchPolicy: 'no-cache'
      });

      this.searching = false;

      this.itineraries = data.searchItineraries;
    },
    parkList(days) {
      const parks = days.map(day => (day.park === null ? 'No Park' : day.park));

      // Set removes duplicates
      return [...new Set(parks)].sort().join(', ');
    }
  }
};
</script>
