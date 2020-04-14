<template>
  <div>
    <timeline>
      <timeline-title v-if="name && name.length > 0">
        <h1 class="title is-3" style="margin-top: -.5rem">
          {{ name }}
        </h1>
      </timeline-title>
      <span v-for="(day, dayIndex) in timeline" :key="dayIndex">
        <timeline-item>
          <h2 class="title is-4">Day {{ dayIndex + 1 }}</h2>
          <h3 class="subtitle">
            {{ getFullDayString(dayIndex + 1, checkIn) }}
          </h3>
          <b-icon slot="others" icon="calendar" size="is-medium"></b-icon>
        </timeline-item>
        <timeline-item v-if="dayIndex === 0 && hotel && hotel.length > 0">
          <p class="is-size-7" style="padding-top: .25rem">
            Check in at {{ hotel }}
          </p>
          <b-icon slot="others" icon="hotel" size="is-small"></b-icon>
        </timeline-item>
        <timeline-item v-if="day.park">
          <h3 style="padding-top: .6rem;" class="title is-5">
            {{ day.park }}
          </h3>
          <b-icon
            slot="others"
            :style="'color:' + getParkIconColor(day.park)"
            :icon="getParkIcon(day.park)"
            size="is-medium"
          >
          </b-icon>
        </timeline-item>
        <span
          v-for="(dayItem, dayItemIndex) in day.dayLine"
          :key="'dayItem' + dayItemIndex"
        >
          <timeline-item v-if="dayItem.time || dayItem.title">
            <b-icon
              slot="others"
              :style="'color:' + getItemIconColor(dayItem.type)"
              :icon="getItemIcon(dayItem.type)"
              size="is-medium"
            ></b-icon>
            <h4 class="title is-6" style="padding-top: .25rem;">
              {{ dayItem.title }}
            </h4>
            <h5 class="subtitle is-7">{{ formatTime(dayItem.time) }}</h5>
          </timeline-item>
        </span>
      </span>
    </timeline>
  </div>
</template>

<script>
import sortByTime from '~/assets/js/TimeSort';
import getParkIcon from '~/assets/js/ParkIcon.js';
import getFullDayString from '~/assets/js/FullDayString.js';
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline';
import { format } from 'date-fns';

export default {
  name: 'TripTimeline',
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  props: {
    dayPlans: {
      type: Array,
      default: function() {
        return [];
      }
    },
    name: {
      type: String,
      default: ''
    },
    hotel: {
      type: String,
      default: ''
    },
    checkIn: {
      type: Date,
      default: null
    }
  },
  computed: {
    timeline: function() {
      return this.dayPlans
        .map(day => {
          const fastPassLine = day.fastPasses
            ? day.fastPasses.map(fastPass => {
                return {
                  title: fastPass.attraction
                    ? 'FP: ' + fastPass.attraction
                    : null,
                  time: fastPass.time,
                  type: 'fastpass'
                };
              })
            : [];

          const diningLine = day.meals
            ? day.meals.map(meal => {
                return {
                  title: meal.restaurant,
                  time: meal.time,
                  type: 'meal'
                };
              })
            : [];

          const activityLine = day.activities
            ? day.activities.map(activity => {
                return {
                  title: activity.name,
                  time: activity.time,
                  type: 'activity'
                };
              })
            : [];

          const dayLine = fastPassLine
            .concat(diningLine, activityLine)
            .sort(sortByTime);

          return { park: day.park, dayLine: dayLine };
        })
        .filter(day => day !== []);
    }
  },
  methods: {
    getParkIcon: function(park) {
      return getParkIcon(park);
    },
    getParkIconColor: function(park) {
      if (park === 'Magic Kingdom') {
        return 'orchid';
      } else if (park === 'Epcot') {
        return 'silver';
      } else if (park === 'Animal Kingdom') {
        return 'chocolate';
      }

      // Hollywood Studios
      return 'red';
    },
    getItemIcon: function(itemType) {
      if (itemType === 'fastpass') {
        return 'ticket-alt';
      } else if (itemType === 'meal') {
        return 'utensils';
      }

      return 'walking';
    },
    getItemIconColor: function(itemType) {
      if (itemType === 'fastpass') {
        return 'limegreen';
      } else if (itemType === 'meal') {
        return 'slategray';
      }

      return 'dodgerblue';
    },
    formatTime: function(date) {
      if (date) {
        return format(date, 'hh:mm aaaa');
      }
    },
    getFullDayString: function(day) {
      return getFullDayString(day, this.checkIn);
    }
  }
};
</script>

<style scoped></style>
