<template>
  <div>
    <div class="section">
      <div class="container">
        <form @submit.prevent="saveItinerary">
          <b-field label="Name" message="Give your trip a nickname">
            <b-input
              v-model="name"
              icon="signature"
              required
              placeholder="Halloween 2099"
            ></b-input>
          </b-field>
          <b-field
            label="Check-In > Check-Out"
            message="How many nights will you be staying?"
          >
            <client-only placeholder="Loading calendar...">
              <HotelDatePicker
                :starting-date-value="checkIn"
                :ending-date-value="checkOut"
                @check-in-changed="setCheckIn"
                @check-out-changed="setCheckOut"
              />
            </client-only>
          </b-field>
          <HotelSearcher v-model="hotel" :initial-hotel="hotel"></HotelSearcher>
          <h3 v-show="dayPlans.length" class="title is-3">
            Itinerary
          </h3>
          <div v-for="(dayPlan, index) in dayPlans" :key="'day-plan-' + index">
            <h4 class="title is-4">
              <b-icon icon="calendar" size="is-small"></b-icon>
              Day {{ index + 1 }}
              <div class="subtitle is-inline">
                {{ getDateForDay(index + 1) }} ({{ getDayOfWeek(index + 1) }})
              </div>
            </h4>
            <FastPasses
              v-model="dayPlan.fastPasses"
              :initial-park="dayPlan.park"
              @park-change="
                park => {
                  dayPlan.park = park;
                }
              "
            ></FastPasses>
            <h5 class="title is-5">Dining</h5>
            <Dining
              v-model="dayPlan.meals"
              style="margin-bottom: 0.75rem"
            ></Dining>
            <h5 class="title is-5">Other Activities</h5>
            <Activities v-model="dayPlan.activities"></Activities>
            <hr />
          </div>
          <button class="button is-primary">Save Itinerary</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import HotelDatePicker from 'vue-hotel-datepicker';
import { addDays, format, differenceInDays } from 'date-fns';
import FastPasses from '~/components/FastPass/FastPasses.vue';
import HotelSearcher from '~/components/Itinerary/HotelSearcher.vue';
import Dining from '~/components/Itinerary/Dining.vue';
import Activities from '~/components/Itinerary/Activities.vue';
import gql from 'graphql-tag';

export default {
  components: {
    HotelDatePicker,
    FastPasses,
    HotelSearcher,
    Dining,
    Activities
  },
  data() {
    return {
      checkIn: null,
      checkOut: null,
      hotel: '',
      name: '',
      id: null,
      dayPlans: []
    };
  },
  async asyncData({ app, params }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query itinerary($id: ID!) {
          itinerary(id: $id) {
            id
            name
            hotel
            checkIn
            checkOut
            createdAt
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
        id: params.id
      }
    });

    const days = data.itinerary.days.map(day => {
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
      id: data.itinerary.id,
      name: data.itinerary.name,
      hotel: data.itinerary.hotel,
      dayPlans: days,
      checkIn: data.itinerary.checkIn ? new Date(data.itinerary.checkIn) : null,
      checkOut: data.itinerary.checkOut
        ? new Date(data.itinerary.checkOut)
        : null
    };
  },
  mounted: function() {
    this.setCheckOut(this.checkOut);
  },
  methods: {
    getDateForDay(day) {
      return format(addDays(this.checkIn, day - 1), 'MM/dd');
    },
    getDayOfWeek(day) {
      return format(addDays(this.checkIn, day - 1), 'eee');
    },
    setCheckIn(checkIn) {
      this.checkIn = checkIn;
    },
    setCheckOut(checkOut) {
      this.checkOut = checkOut;

      if (this.checkIn === null || this.checkOut === null) {
        return;
      }

      const days = differenceInDays(this.checkOut, this.checkIn) + 1;

      if (days < 0) {
        return;
      }

      const currentPlans = this.dayPlans.slice(0, days - 1);

      const newPlans = Array(days - currentPlans.length)
        .fill()
        .map(() => {
          return {
            id: null,
            park: null
          };
        });

      this.dayPlans = currentPlans.concat(newPlans);
    },
    saveItinerary() {
      const client = this.$apollo.getClient();

      const mutation = gql`
        mutation updateItinerary($attributes: ItineraryInput!) {
          updateItinerary(attributes: $attributes) {
            id
          }
        }
      `;

      const days = this.dayPlans.map(day => {
        return {
          park: day.park,
          fastPasses: day.fastPasses
            ? day.fastPasses
                .filter(fp => fp.attraction !== null || fp.time !== null)
                .map(fp => {
                  return { attraction: fp.attraction, time: fp.time };
                })
            : [],
          meals: day.meals
            ? day.meals
                .filter(m => m.restaurant !== null || m.time !== null)
                .map(m => {
                  return { restaurant: m.restaurant, time: m.time };
                })
            : [],
          activities: day.activities
            ? day.activities
                .filter(a => a.name !== null || a.time !== null)
                .map(a => {
                  return { name: a.name, time: a.time };
                })
            : []
        };
      });

      const variables = {
        attributes: {
          id: this.id,
          name: this.name,
          hotel: this.hotel,
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          days: days
        }
      };

      client.mutate({ mutation: mutation, variables: variables });
    }
  }
};
</script>
