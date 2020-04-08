<template>
  <div>
    <b-field
      v-for="(activity, activityIndex) in activities"
      :key="'activity-' + activityIndex"
    >
      <b-input
        v-model="activity.name"
        icon="walking"
        placeholder="Enter activity"
        expanded
        @blur="addNewActivity"
      ></b-input>
      <b-timepicker
        v-model="activity.time"
        icon="clock"
        editable
        placeholder="Type or select"
        hour-format="12"
        :increment-minutes="5"
        @blur="activities = sortActivities(activities)"
      ></b-timepicker>
    </b-field>
  </div>
</template>

<script>
import sortByTime from '~/assets/js/TimeSort';

const DEFAULT_ACTIVITY = function() {
  return [{ name: '', time: null }];
};

export default {
  name: 'Activities',
  props: {
    value: {
      type: Array,
      default: () => {
        return DEFAULT_ACTIVITY();
      }
    }
  },
  data() {
    return {
      activities:
        this.value.length === 0
          ? DEFAULT_ACTIVITY()
          : this.sortActivities(this.value)
    };
  },
  watch: {
    activities: {
      handler: function(oldActivities, newActivities) {
        this.$emit('input', newActivities);
      },
      deep: true
    }
  },
  created: function() {
    this.addNewActivity();
  },
  methods: {
    addNewActivity() {
      const lastActivity = this.activities[this.activities.length - 1];

      if (!lastActivity.name) return;

      this.activities.push({ name: null, time: null });
    },
    sortActivities(activities) {
      return activities.slice().sort(sortByTime);
    }
  }
};
</script>
