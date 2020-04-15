<template>
  <b-tooltip :label="shareLink" position="is-left" :active="showTooltip">
    <b-button :class="buttonClass" @click="copyShareLink">
      {{ buttonText }}
    </b-button>
  </b-tooltip>
</template>

<script>
export default {
  name: 'CopyShareButton',
  props: {
    shareLink: {
      type: String,
      default: ''
    },
    buttonType: {
      type: String,
      default: 'is-primary'
    },
    buttonText: {
      type: String,
      default: 'Copy'
    },
    showTooltip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      deleting: false
    };
  },
  computed: {
    buttonClass: function() {
      return 'button ' + this.buttonType;
    }
  },
  methods: {
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
    }
  }
};
</script>

<style scoped></style>
