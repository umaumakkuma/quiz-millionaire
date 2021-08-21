<template>
  <div v-show="isResult" class="modal">
    <div class="modal-inner">
      <h2 class="modal-inner__title">全問正解おめでとう！</h2>
      <p class="modal-inner__text">賞金<span>{{ currentPrizeMoney }}</span>円はあなたのものです！</p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      prizeMoney: [
        10000,
        20000,
        30000,
        50000,
        100000,
        150000,
        250000,
        500000,
        750000,
        1000000,
        1500000,
        2500000,
        5000000,
        7500000,
        10000000,
      ],
      minoDelay: 100,
    }
  },
  computed: {
    questionCount() {
      return this.$store.getters.questionCount
    },
    currentPrizeMoney() {
      return this.prizeMoney[this.questionCount]
    },
    isResult() {
      return this.$store.getters.isResult
    },
  }
}
</script>
