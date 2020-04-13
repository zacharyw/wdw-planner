<template>
  <div>
    <h5 class="title is-5">FastPass</h5>
    <client-only>
      <b-field :message="parkMessage">
        <b-select
          ref="park-selector"
          v-model="park"
          placeholder="Select a theme park"
          :icon="parkIcon"
        >
          <option value="Magic Kingdom">
            <b-icon :icon="getParkIcon('Magic Kingdom')"></b-icon>
            Magic Kingdom
          </option>
          <option value="Epcot">
            <b-icon :icon="getParkIcon('Epcot')"></b-icon>
            Epcot
          </option>
          <option value="Hollywood Studios">
            <b-icon :icon="getParkIcon('Hollywood Studios')"></b-icon>
            Hollywood Studios
          </option>
          <option value="Animal Kingdom">
            <b-icon :icon="getParkIcon('Animal Kingdom')"></b-icon>
            Animal Kingdom
          </option>
        </b-select>
      </b-field>
    </client-only>
    <b-field
      v-for="(fastPass, fastPassIndex) in sortedFastPasses"
      v-show="park != null"
      :key="'fp-key-' + fastPassIndex"
    >
      <b-select
        ref="fast-pass-selector"
        v-model="fastPass.attraction"
        icon="ticket-alt"
        placeholder="Select FastPass"
        expanded
        @change="emitFastPasses()"
      >
        <option
          v-for="attraction in allowedFastPassOptions(fastPass.attraction)"
          :key="attraction.name"
          :value="attraction.name"
        >
          {{ formatFastPass(attraction) }}
        </option>
      </b-select>
      <b-timepicker
        v-model="fastPass.time"
        placeholder="Type or select"
        icon="clock"
        editable
        hour-format="12"
        :increment-minutes="5"
        @blur="fastPasses = sortFastPasses(fastPasses)"
        @change="emitFastPasses()"
      >
      </b-timepicker>
    </b-field>
    <p class="help is-danger content" style="margin-bottom: .75rem">
      {{ fastPassMessage }}
    </p>
  </div>
</template>

<script>
import sortByTime from '~/assets/js/TimeSort';
import getParkIcon from '~/assets/js/ParkIcon.js';

const fastPassOptions = {
  'Magic Kingdom': [
    { name: 'Big Thunder Mountain Railroad', tier: 0 },
    { name: "Buzz Lightyear's Space Ranger Spin", tier: 0 },
    { name: 'Barnstormer', tier: 0 },
    { name: 'Dumbo', tier: 0 },
    { name: 'Enchanted Tales with Belle', tier: 0 },
    { name: 'Haunted Mansion', tier: 0 },
    { name: "It's a small world", tier: 0 },
    { name: 'Jungle Cruise', tier: 0 },
    { name: 'Mad Tea Party', tier: 0 },
    { name: 'Magic Carpets of Aladdin', tier: 0 },
    { name: 'The Many Adventures of Winnie the Pooh', tier: 0 },
    { name: 'Meet Ariel at Her Grotto', tier: 0 },
    { name: 'Meet Cinderella and Elena at Princess Fairytale Hall', tier: 0 },
    { name: 'Meet Mickey at Town Square Theater', tier: 0 },
    { name: 'Meet Rapunzel and Tiana at Princess Fairytale Hall', tier: 0 },
    { name: 'Meet Tinker Bell at Town Square Theater', tier: 0 },
    { name: "Mickey's PhilharMagic", tier: 0 },
    { name: 'Monsters, Inc. Laugh Floor', tier: 0 },
    { name: "Peter Pan's Flight", tier: 0 },
    { name: 'Pirates of the Caribbean', tier: 0 },
    { name: 'Seven Dwarfs Mine Train', tier: 0 },
    { name: 'Space Mountain', tier: 0 },
    { name: 'Splash Mountain', tier: 0 },
    { name: 'Tomorrowland Speedway', tier: 0 },
    { name: 'Under the Sea - Journey of the Little Mermaid', tier: 0 }
  ],
  Epcot: [
    { name: 'IllumiNations: Reflections of Earth', tier: 1 },
    { name: 'Frozen Ever After', tier: 1 },
    { name: 'Soarin', tier: 1 },
    { name: 'Test Track', tier: 1 },
    { name: 'Epcot Character Spot', tier: 2 },
    { name: 'Journey Into Imagination With Figment', tier: 2 },
    { name: 'Living with the Land', tier: 2 },
    { name: 'Mission: SPACE', tier: 2 },
    { name: 'Pixar Short Film Festival', tier: 2 },
    { name: 'The Seas with Nemo & Friends', tier: 2 },
    { name: 'Spaceship Earth', tier: 2 },
    { name: 'Turtle Talk with Crush', tier: 2 }
  ],
  'Animal Kingdom': [
    { name: 'Avatar Flight of Passage', tier: 1 },
    { name: "Na'vi River Journey", tier: 1 },
    { name: 'Adventurers Outpost Character Greeting', tier: 2 },
    { name: 'Expedition Everest', tier: 2 },
    { name: 'Festival of the Lion King', tier: 2 },
    { name: 'DINOSAUR', tier: 2 },
    { name: 'Finding Nemo Musical', tier: 2 },
    { name: 'Kali River Rapids', tier: 2 },
    { name: 'Kilimanjaro Safaris', tier: 2 },
    { name: 'Primeval Whirl', tier: 2 },
    { name: 'Rivers of Light', tier: 2 },
    { name: "It's Tough to Be A Bug", tier: 2 },
    { name: 'UP! A Great Bird Adventure', tier: 2 }
  ],
  'Hollywood Studios': [
    { name: 'Alien Swirling Saucers', tier: 1 },
    { name: 'Slinky Dog Dash', tier: 1 },
    { name: 'Toy Story Mania!', tier: 1 },
    { name: 'Beauty and the Beast', tier: 2 },
    { name: 'Disney Junior Dance Party!', tier: 2 },
    { name: 'Fantasmic!', tier: 2 },
    { name: 'Frozen Sing-Along Celebration', tier: 2 },
    { name: 'Indiana Jones Epic Stunt Spectacular', tier: 2 },
    { name: 'Muppet Vision 3D', tier: 2 },
    { name: "Rock 'n' Roller Coaster", tier: 2 },
    { name: 'Star Tours: The Adventure Continues', tier: 2 },
    { name: 'The Twilight Zone Tower of Terror', tier: 2 },
    { name: 'Voyage of the Little Mermaid', tier: 2 }
  ]
};

const DEFAULT_FAST_PASSES = function() {
  return Array(3)
    .fill()
    .map(() => {
      return { attraction: null, time: null };
    });
};

export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return DEFAULT_FAST_PASSES();
      }
    },
    initialPark: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fastPassPark: this.initialPark,
      fastPasses: this.initializeFastPasses(this.value)
    };
  },
  computed: {
    parkIcon: function() {
      return getParkIcon(this.park);
    },
    fastPassMessage: function() {
      if (!this.park) return '';

      const attractions = this.fastPasses.map(fastPass => fastPass.attraction);

      const options = fastPassOptions[this.park];
      const matchingAttractions = options.filter(attraction =>
        attractions.includes(attraction.name)
      );

      const count = matchingAttractions.reduce(
        (n, attraction) => n + (attraction.tier === 1),
        0
      );

      if (count < 2) return '';

      return "More than one Tier 1 FastPass. You can still save your plan this way, but it won't be bookable";
    },
    parkMessage: function() {
      if (!this.park || this.park === 'Magic Kingdom') return '';

      return `${this.park} uses a <strong>tiered</strong> FastPass system. Only <strong>one</strong> of your three FastPasses can be a Tier 1 attraction.`;
    },
    fastPassOptions: function() {
      return fastPassOptions;
    },
    sortedFastPasses: function() {
      return this.fastPasses;
    },
    park: {
      get: function() {
        return this.fastPassPark;
      },
      set: function(park) {
        if (this.fastPassPark === park) {
          return;
        }

        const fastPassCount = this.fastPasses.filter(
          fastPass => fastPass.attraction != null || fastPass.time != null
        ).length;

        if (!this.fastPassPark || fastPassCount === 0) {
          this.fastPassPark = park;
          this.$emit('park-change', park);
          return;
        }

        if (
          confirm(
            'Changing parks will reset your FastPasses for this day. Continue?'
          )
        ) {
          this.fastPassPark = park;
          this.$emit('park-change', park);
          this.fastPasses = this.emptyFastPasses();
          this.$emit('input', this.emptyFastPasses());
        }
      }
    }
  },
  methods: {
    sortFastPasses: function(fastPasses) {
      return fastPasses.slice().sort(sortByTime);
    },
    getParkIcon: function(park) {
      return getParkIcon(park);
    },
    allowedFastPassOptions: function(currentlySelected) {
      if (!this.park) return '';

      const attractions = this.fastPasses.map(fastPass => fastPass.attraction);

      return fastPassOptions[this.park].filter(
        attraction =>
          !attractions.includes(attraction.name) ||
          attraction.name === currentlySelected
      );
    },
    formatFastPass: function(attraction) {
      if (attraction.tier !== 1) return attraction.name;

      return `${attraction.name} - Tier ${attraction.tier}`;
    },
    emptyFastPasses: function() {
      return DEFAULT_FAST_PASSES();
    },
    initializeFastPasses: function(initialFastPasses) {
      if (initialFastPasses.length === 3) {
        return this.sortFastPasses(initialFastPasses);
      }

      while (initialFastPasses.length !== 3) {
        initialFastPasses.push({ attraction: null, time: null });
      }

      return this.sortFastPasses(initialFastPasses);
    },
    emitFastPasses() {
      this.$emit('input', this.fastPasses);
    }
  }
};
</script>
