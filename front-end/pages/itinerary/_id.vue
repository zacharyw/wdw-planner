<template>
  <div class="section">
    <div class="container">
      <b-tooltip label="Save a copy of this itinerary to your account">
        <b-button
          type="is-primary"
          @click="copyItinerary"
          style="margin-bottom: 1rem;"
          :disabled="copying"
        >
          <span v-show="!copying">Make a Copy</span>
          <span v-show="copying">Copying...</span>
        </b-button>
      </b-tooltip>
      <TripTimeline
        :day-plans="dayPlans"
        :check-in="checkIn"
        :name="name"
        :hotel="hotel"
      ></TripTimeline>
    </div>
  </div>
</template>

<script>
import TripTimeline from '~/components/Itinerary/TripTimeline.vue';
import gql from 'graphql-tag';

export default {
  components: {
    TripTimeline
  },
  data() {
    return {
      checkIn: null,
      hotel: '',
      name: '',
      dayPlans: [],
      copying: false
    };
  },
  async asyncData({ app, env, params }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query sharedItinerary($shareToken: ID!) {
          sharedItinerary(shareToken: $shareToken) {
            name
            hotel
            checkIn
            days {
              park
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
        shareToken: params.id
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

    return {
      name: data.sharedItinerary.name,
      hotel: data.sharedItinerary.hotel,
      dayPlans: days,
      checkIn: data.sharedItinerary.checkIn
        ? new Date(data.sharedItinerary.checkIn)
        : null,
      shareToken: params.id
    };
  },
  methods: {
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
