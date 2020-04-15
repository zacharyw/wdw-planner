<template>
  <div>
    <div class="section">
      <div class="container">
        <b-field
          label="Share Link (Can view, but not edit)"
          label-position="on-border"
          v-if="shareToken !== null && shareToken !== ''"
        >
          <b-input :value="shareLink" readonly expanded></b-input>
          <p class="control">
            <b-button class="button is-primary" @click="copyShareLink">
              Copy
            </b-button>
          </p>
        </b-field>
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
          <div class="tabs is-boxed is-hidden-tablet" style="margin-top: 2rem;">
            <ul>
              <li :class="activeTab === 'itinerary' ? 'is-active' : ''">
                <a @click="setActiveTab('itinerary')">Itinerary</a>
              </li>
              <li :class="activeTab === 'timeline' ? 'is-active' : ''">
                <a @click="setActiveTab('timeline')">Timeline</a>
              </li>
            </ul>
          </div>
          <div class="columns">
            <div class="column" v-show="activeTab === 'itinerary'">
              <h3 v-show="dayPlans.length" class="title is-3 is-hidden-mobile">
                Itinerary
              </h3>
              <div
                v-for="(dayPlan, index) in dayPlans"
                :key="'day-plan-' + index"
              >
                <h4 class="title is-4">
                  <b-icon icon="calendar" size="is-small"></b-icon>
                  Day {{ index + 1 }}
                  <div class="subtitle is-inline">
                    {{ getFullDayString(index + 1) }}
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
              <button class="button is-primary" :disabled="saving">
                <span v-show="!saving">Save Itinerary</span>
                <span v-show="saving">Saving itinerary...</span>
              </button>
            </div>
            <div
              class="column is-hidden-mobile"
              style="display: flex;justify-content: center;"
            >
              <TripTimeline
                :day-plans="dayPlans"
                :name="name"
                :hotel="hotel"
                :check-in="checkIn"
              ></TripTimeline>
            </div>
          </div>
          <br />
          <TripTimeline
            :day-plans="dayPlans"
            :name="name"
            :hotel="hotel"
            :check-in="checkIn"
            class="is-hidden-tablet"
            v-show="activeTab === 'timeline'"
          ></TripTimeline>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import HotelDatePicker from 'vue-hotel-datepicker';
import { differenceInDays } from 'date-fns';
import FastPasses from '~/components/FastPass/FastPasses.vue';
import HotelSearcher from '~/components/Itinerary/HotelSearcher.vue';
import Dining from '~/components/Itinerary/Dining.vue';
import Activities from '~/components/Itinerary/Activities.vue';
import TripTimeline from '~/components/Itinerary/TripTimeline.vue';
import gql from 'graphql-tag';
import getFullDayString from '~/assets/js/FullDayString.js';

export default {
  components: {
    HotelDatePicker,
    FastPasses,
    HotelSearcher,
    Dining,
    Activities,
    TripTimeline
  },
  data() {
    return {
      checkIn: null,
      checkOut: null,
      hotel: '',
      name: '',
      id: null,
      dayPlans: [],
      activeTab: 'itinerary'
    };
  },
  async asyncData({ app, env, params }) {
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
            shareToken
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
      id: data.itinerary.id === null ? 0 : data.itinerary.id,
      name: data.itinerary.name,
      hotel: data.itinerary.hotel,
      shareToken: data.itinerary.shareToken,
      shareLink: env.baseUrl + '/itinerary/' + data.itinerary.shareToken,
      dayPlans: days,
      checkIn: data.itinerary.checkIn ? new Date(data.itinerary.checkIn) : null,
      checkOut: data.itinerary.checkOut
        ? new Date(data.itinerary.checkOut)
        : null,
      saving: false
    };
  },
  mounted: function() {
    this.setCheckOut(this.checkOut);
  },
  methods: {
    getFullDayString(day) {
      return getFullDayString(day, this.checkIn);
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

      const currentPlans = this.dayPlans.slice(0, days);

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
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    async copyShareLink() {
      try {
        await this.$copyText(this.shareLink);

        this.$buefy.toast.open({
          message: 'Link copied!',
          type: 'is-success'
        });
      } catch (e) {
        console.error(e);
      }
    },
    saveItinerary() {
      this.saving = true;

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

      client
        .mutate({ mutation: mutation, variables: variables })
        .then(({ data }) => {
          this.id = data.updateItinerary.id;
          this.saving = false;

          this.$buefy.toast.open({
            message: 'Itinerary saved!',
            type: 'is-success'
          });
        })
        .catch(error => {
          console.error(error);
          this.saving = false;

          this.$buefy.toast.open({
            message: 'Itinerary failed to save, please try again.',
            type: 'is-danger'
          });
        });
    }
  }
};
</script>
