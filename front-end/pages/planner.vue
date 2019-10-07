<template>
  <div>
    <div class="section">
      <div class="container">
        <b-field
          label="Check-In > Check-Out"
          message="How many nights will you be staying?"
        >
          <no-ssr placeholder="Loading calendar...">
            <HotelDatePicker
              :starting-date-value="checkIn"
              :ending-date-value="checkOut"
              @check-in-changed="setCheckIn"
              @check-out-changed="setCheckOut"
            />
          </no-ssr>
        </b-field>
        <HotelSearcher></HotelSearcher>
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
          <FastPasses></FastPasses>
          <h5 class="title is-5">Dining</h5>
          <Dining style="margin-bottom: 0.75rem"></Dining>
          <h5 class="title is-5">Other Activities</h5>
          <Activities></Activities>
          <hr />
        </div>
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
      checkIn: new Date(),
      checkOut: new Date(),
      dayPlans: []
    };
  },
  methods: {
    getDateForDay(day) {
      return format(addDays(this.checkIn, day - 1), 'MM/DD');
    },
    getDayOfWeek(day) {
      return format(addDays(this.checkIn, day - 1), 'ddd');
    },
    setCheckIn(checkIn) {
      this.checkIn = checkIn;
    },
    setCheckOut(checkOut) {
      this.checkOut = checkOut;

      const days = differenceInDays(checkOut, this.checkIn) + 1;

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
    }
  }
};
</script>
