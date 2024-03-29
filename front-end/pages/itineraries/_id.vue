<template>
  <div>
    <div class="section">
      <div class="container">
        <b-field
          v-if="
            shareToken !== null &&
              shareToken !== '' &&
              !(!isPublic && initialIsPublic)
          "
          label="Share Link (Can view, but not edit)"
          label-position="on-border"
        >
          <b-input :value="shareLink" readonly expanded></b-input>
          <p class="control">
            <CopyShareButton
              :share-link="shareLink"
              :show-tooltip="false"
            ></CopyShareButton>
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
          <div class="field">
            <b-switch v-model="isPublic">
              {{ isPublic ? 'Public' : 'Private' }}
            </b-switch>
            <p class="help">
              Public itineraries are visible on the
              <nuxt-link to="/itineraries/browse">browse itineraries</nuxt-link>
              page. Exact dates of travel are not shown.
            </p>
            <p
              class="help"
              v-if="shareToken !== null && !isPublic && initialIsPublic"
            >
              Changing from public to private will reset the share link for this
              itinerary. After saving reshare the new link with anyone you want
              to be able to view this itinerary.
            </p>
          </div>
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
          <b-field label="Notes">
            <b-input v-model="notes" type="textarea"></b-input>
          </b-field>
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
            <div v-show="activeTab === 'itinerary'" class="column">
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
                <Activities
                  v-model="dayPlan.activities"
                  style="margin-bottom: 1.25rem"
                ></Activities>
                <b-field label="Notes" label-position="on-border">
                  <b-input v-model="dayPlan.notes" type="textarea"></b-input>
                </b-field>
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
                :notes="notes"
                :check-in="checkIn"
                style="margin-top: .75rem;"
              ></TripTimeline>
            </div>
          </div>
          <br />
          <div v-show="activeTab === 'timeline'" class="is-hidden-tablet">
            <TripTimeline
              :day-plans="dayPlans"
              :name="name"
              :notes="notes"
              :hotel="hotel"
              :check-in="checkIn"
            ></TripTimeline>
            <button
              class="button is-primary"
              style="margin-top: 1rem;"
              :disabled="saving"
            >
              <span v-show="!saving">Save Itinerary</span>
              <span v-show="saving">Saving itinerary...</span>
            </button>
          </div>
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
import CopyShareButton from '~/components/Itinerary/CopyShareButton.vue';
import gql from 'graphql-tag';
import getFullDayString from '~/assets/js/FullDayString.js';

export default {
  components: {
    HotelDatePicker,
    FastPasses,
    HotelSearcher,
    Dining,
    Activities,
    TripTimeline,
    CopyShareButton
  },
  data() {
    return {
      checkIn: null,
      checkOut: null,
      hotel: '',
      name: '',
      notes: '',
      id: null,
      dayPlans: [],
      activeTab: 'itinerary',
      isPublic: true
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
            notes
            public
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
      notes: data.itinerary.notes,
      isPublic: data.itinerary.public,
      initialIsPublic: data.itinerary.public,
      shareToken: data.itinerary.shareToken,
      baseUrl: env.baseUrl + '/itinerary/',
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
  computed: {
    shareLink() {
      return this.baseUrl + this.shareToken;
    }
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
    saveItinerary() {
      this.saving = true;

      const client = this.$apollo.getClient();

      const mutation = gql`
        mutation updateItinerary($attributes: ItineraryInput!) {
          updateItinerary(attributes: $attributes) {
            id
            shareToken
          }
        }
      `;

      const days = this.dayPlans.map(day => {
        return {
          park: day.park,
          notes: day.nosates,
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
          notes: this.notes,
          public: this.isPublic,
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          days: days
        }
      };

      client
        .mutate({ mutation: mutation, variables: variables })
        .then(({ data }) => {
          const isNew = this.id === 0;
          this.id = data.updateItinerary.id;
          this.saving = false;
          this.initialIsPublic = this.isPublic;
          this.shareToken = data.updateItinerary.shareToken;

          this.$buefy.toast.open({
            message: 'Itinerary saved!',
            type: 'is-success'
          });

          if (isNew) {
            this.$router.push('/itineraries/' + this.id);
          }
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
