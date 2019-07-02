<template>
  <div>
    <b-field
      v-for="(activity, activityIndex) in activities"
      :key="'activity-' + index + '-' + activityIndex"
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
      ></b-timepicker>
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'Activities',
  data() {
    return {
      activities: [{ name: '', time: '' }]
    };
  },
  methods: {
    addNewActivity() {
      const lastActivity = this.activities[this.activities.length - 1];

      if (!lastActivity.name) return;

      this.activities.push({ name: null, time: null });
    }
  }
};
</script>
