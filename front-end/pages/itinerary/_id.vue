<template>
  <TripTimeline
    :day-plans="dayPlans"
    :check-in="checkIn"
    :name="name"
    :hotel="hotel"
  ></TripTimeline>
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
      dayPlans: []
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
        : null
    };
  }
};
</script>
