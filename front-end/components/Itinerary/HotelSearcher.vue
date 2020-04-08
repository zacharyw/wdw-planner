<template>
  <b-field label="Hotel" message="Where will you be staying?">
    <b-autocomplete
      v-model="hotel"
      placeholder="Search hotels..."
      :data="filteredHotelArray"
      icon="hotel"
      @input="onHotelChange"
    >
    </b-autocomplete>
  </b-field>
</template>

<script>
const hotels = [
  'All-Star Movies',
  'All-Star Music',
  'All-Star Sports',
  'Art of Animation',
  'Pop Century',
  "The Campsites at Disney's Fort Wilderness",
  'Caribbean Beach Resort',
  'Coronado Springs Resort',
  'Port Orleans Resort - French Quarter',
  'Port Orleans Resort - Riverside',
  "The Cabins at Disney's Fort Wilderness Resort",
  'Animal Kingdom Lodge',
  'Beach Club',
  'BoardWalk Inn',
  'Contemporary',
  'Grand Floridian Resort & Spa',
  'Polynesian Village',
  'Wilderness Lodge',
  'Yacht Club',
  'Bay Lake Tower',
  'Boulder Ridge Villas',
  'Copper Creek Villas & Cabins',
  'Animal Kingdom Villas - Jambo House',
  'Animal Kingdom Villas - Kidani Village',
  'Beach Club Villas',
  'BoardWalk Villas',
  'Old Key West Resort',
  'Polynesian Villas & Bungalows',
  'Riviera Resort',
  'Saratoga Springs Resort & Spa',
  'The Villas at Grand Floridian Resort & Spa'
];

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return { hotel: this.value };
  },
  computed: {
    filteredHotelArray: function() {
      return hotels.filter(option => {
        if (this.hotel === null) {
          return;
        }

        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(this.hotel.toLowerCase()) >= 0
        );
      });
    }
  },
  methods: {
    onHotelChange: function(hotel) {
      this.$emit('input', hotel);
    }
  }
};
</script>
