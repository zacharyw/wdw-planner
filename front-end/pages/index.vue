<template>
  <div>
    <div class="section">
      <div class="container">
        <List />
      </div>
    </div>
  </div>
</template>

<script>
import List from '~/components/Itinerary/List';

export default {
  name: 'HomePage',
  auth: true,

  components: {
    List
  }
};
</script>
