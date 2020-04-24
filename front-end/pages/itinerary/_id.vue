<template>
  <div class="section">
    <div class="container">
      <TimelineView :share-token="shareToken" />
    </div>
  </div>
</template>

<script>
import TimelineView from '~/components/Itinerary/TimelineView.vue';

export default {
  components: {
    TimelineView
  },
  data() {
    return {
      shareToken: this.$route.params.id
    };
  }
};
</script>
