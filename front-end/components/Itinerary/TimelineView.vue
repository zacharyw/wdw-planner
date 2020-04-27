<template>
  <div>
    <b-tooltip label="Save a copy of this itinerary to your account">
      <b-button
        type="is-primary"
        style="margin-bottom: 2rem;"
        :disabled="copying"
        @click="copyItinerary"
      >
        <span v-show="!copying">Make a Copy</span>
        <span v-show="copying">Copying...</span>
      </b-button>
    </b-tooltip>
    <div v-if="false">
      <b-button
        v-show="!isFavorite"
        type="is-light"
        style="margin-bottom: 2rem;"
        :disabled="favoriting"
        @click="saveFavorite"
      >
        <b-icon icon="heart"> </b-icon>
        <span v-show="!favoriting">Save Favorite</span>
        <span v-show="favoriting">Favoriting</span>
      </b-button>
      <b-button
        v-show="isFavorite"
        :type="hoveringFavorite ? 'is-danger' : 'is-success'"
        style="margin-bottom: 2rem;"
        :disabled="unFavoriting"
        @click="unFavorite"
        @mouseover="hoveringFavorite = true"
        @mouseleave="hoveringFavorite = false"
      >
        <b-icon v-show="!hoveringFavorite" icon="heart"> </b-icon>
        <b-icon v-show="hoveringFavorite" icon="heart-broken"> </b-icon>
        <span v-show="!unFavoriting && !hoveringFavorite">Favorite!</span>
        <span v-show="!unFavoriting && hoveringFavorite">Unfavorite</span>
        <span v-show="unFavoriting">Unfavoriting</span>
      </b-button>
    </div>
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="false"
    ></b-loading>
    <TripTimeline
      :day-plans="dayPlans"
      :check-in="checkIn"
      :notes="notes"
      :name="name"
      :hotel="hotel"
      :show-dates="false"
    >
    </TripTimeline>
  </div>
</template>

<script>
import TripTimeline from '~/components/Itinerary/TripTimeline.vue';
import gql from 'graphql-tag';

export default {
  components: {
    TripTimeline
  },
  props: {
    shareToken: {
      type: String,
      default: ''
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkIn: null,
      hotel: '',
      name: '',
      dayPlans: [],
      copying: false,
      notes: '',
      isLoading: true,
      favoriting: false,
      unFavoriting: false,
      hoveringFavorite: false
    };
  },
  mounted: async function() {
    const client = this.$apollo.getClient();
    const { data } = await client.query({
      query: gql`
        query sharedItinerary($shareToken: ID!) {
          sharedItinerary(shareToken: $shareToken) {
            name
            hotel
            checkIn
            notes
            days {
              park
              notes
              fastPasses {
                attraction
                time
              }
              activities {
                name
                time
              }
              meals {
                restaurant
                time
              }
            }
          }
        }
      `,
      variables: {
        shareToken: this.shareToken
      }
    });

    const days = data.sharedItinerary.days.map(day => {
      day.fastPasses.forEach(fastPass => {
        if (fastPass.time) {
          fastPass.time = new Date(fastPass.time);
        }
      });

      day.meals.forEach(meal => {
        if (meal.time) {
          meal.time = new Date(meal.time);
        }
      });

      day.activities.forEach(activity => {
        if (activity.time) {
          activity.time = new Date(activity.time);
        }
      });

      return day;
    });

    this.isLoading = false;

    this.name = data.sharedItinerary.name;
    this.hotel = data.sharedItinerary.hotel;
    this.notes = data.sharedItinerary.notes;
    this.dayPlans = days;
    this.checkIn = data.sharedItinerary.checkIn
      ? new Date(data.sharedItinerary.checkIn)
      : null;
  },
  methods: {
    saveFavorite: function() {},
    unFavorite: function() {},
    copyItinerary: function() {
      this.copying = true;
      const client = this.$apollo.getClient();

      const mutation = gql`
        mutation cloneItinerary($shareToken: ID!) {
          cloneItinerary(shareToken: $shareToken) {
            id
          }
        }
      `;

      const variables = {
        shareToken: this.shareToken
      };

      client
        .mutate({ mutation: mutation, variables: variables })
        .then(({ data }) => {
          const id = data.cloneItinerary.id;

          this.copying = false;

          this.$buefy.toast.open({
            message: 'Itinerary copied and saved!',
            type: 'is-success'
          });

          this.$router.push('/itineraries/' + id);
        })
        .catch(error => {
          console.error(error);

          this.$buefy.toast.open({
            message: 'Itinerary failed to copy, please try again.',
            type: 'is-danger'
          });
        });
    }
  }
};
</script>
