<template>
  <div id="app">
    <div class="contents-wrap">
      <div class="header">
        <p class="prize-money">TRIAL：{{ currentPrizeMoney }}円</p>
        <ul class="options">
          <li class="btn btn--small">
            <button @click="dropOut()" class="btn__inner"><span class="btn__inner__text">ドロップアウト</span></button>
          </li>
          <li class="btn btn--small">
            <button @click="fiftyfiftyOpen()" class="btn__inner" :class="{ 'btn--disabled': isFiftyfiftyUsed }"><span class="btn__inner__text">50:50</span></button>
          </li>
        </ul>
      </div>
      <h1 class="align-center"> 
        <img src="/images/logo.jpg" alt="ミリオネアロゴ">
      </h1>
      <div class="question-text">
        <h2 class="question-text__inner"><span class="question-text__inner__text">{{ questionText }}</span></h2>
      </div>
      <ul class="choices">
        <li v-for="(value, name, key) in choices" :key="key" class="btn btn--2-column btn--text-left mb-2" :class="fiftyfiftyResult(name)"><button @click="finalAnswer($event)" :data-id="name" class="btn__inner"><span class="btn__inner__text">{{ name }}：{{ value }}</span></button></li>
      </ul>
    </div>

    <div v-show="isOpening" class="modal">
      <div class="modal-inner">
        <h2 class="modal-inner__title">クイズ＄ミリオネア</h2>
        <div class="btn mx-auto">
          <button @click="startGame()" class="btn__inner btn--primary"><span class="btn__inner__text">開始する</span></button>
        </div>
      </div>
    </div>

    <div v-show="isFinalAnswer" class="modal">
      <div class="modal-inner">
        <h2 class="modal-inner__title">ファイナルアンサー？</h2>
        <ul class="d-flex justify-content-center">
          <li class="btn btn--medium">
            <button @click="finalAnswerCancel()" class="btn__inner"><span class="btn__inner__text">いいえ</span></button>
          </li>
          <li class="btn btn--medium">
            <button @click="finalAnswerApply()" class="btn__inner"><span class="btn__inner__text">ファイナルアンサー！</span></button>
          </li>
        </ul>
      </div>
    </div>

    <div v-show="isJudge" class="modal">
      <div class="modal-inner">
        <h2 class="modal-inner__title">あなたの選択肢は…</h2>
        <div v-show="isJudgeCorrect">
          <p class="modal-inner__text">正解！</p>
          <div class="btn btn--medium mx-auto">
            <button @click="nextQuestion()" class="btn__inner"><span class="btn__inner__text">次の問題へ</span></button>
          </div>
        </div>
        <div v-show="isJudgeIncorrect">
          <p class="modal-inner__text">不正解！</p>
          <p class="modal-inner__text">次回のチャレンジをお待ちしています。</p>
          <div class="btn btn--medium mx-auto">
            <button @click="init()" class="btn__inner"><span class="btn__inner__text">クイズ開始画面に戻る</span></button>
          </div>
        </div>
      </div>
    </div>

    <result />

    <div v-show="isFiftyfifty" class="modal">
      <div class="modal-inner">
        <h2 class="modal-inner__title">50:50 を使用しますか？</h2>
        <ul class="d-flex justify-content-center">
          <li class="btn btn--medium">
            <button @click="fiftyfiftyCancel()" class="btn__inner"><span class="btn__inner__text">いいえ</span></button>
          </li>
          <li class="btn btn--medium">
            <button @click="fiftyfiftyApply()" class="btn__inner"><span class="btn__inner__text">使用する</span></button>
          </li>
        </ul>
      </div>
    </div>

    <div v-show="isDropOut" class="modal">
      <div class="modal-inner">
        <h2 class="modal-inner__title">ドロップアウト？</h2>
        <p class="modal-inner__text mb-1">ドロップアウトするとこれまでの賞金を手に入れて終了となります。<br>
        本当にドロップアウトしますか？</p>
        <ul class="d-flex justify-content-center">
          <li class="btn btn--medium">
            <button @click="dropOutCancel()" class="btn__inner"><span class="btn__inner__text">いいえ</span></button>
          </li>
          <li class="btn btn--medium">
            <button @click="dropOutApply()" class="btn__inner"><span class="btn__inner__text">はい</span></button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import result from "./components/Result.vue"

export default {
  components: {
    result,
  },
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
    isOpening() {
      return this.$store.getters.isOpening
    },
    questionsData() {
      return this.$store.getters.questionsData
    },
    questionCount() {
      return this.$store.getters.questionCount
    },
    choseCurrentQuestion() {
      return this.$store.getters.choseCurrentQuestion
    },
    choices() {
      return this.$store.getters.choices
    },
    isFinalAnswer() {
      return this.$store.getters.isFinalAnswer
    },
    isJudge() {
      return this.$store.getters.isJudge
    },
    isJudgeCorrect() {
      return this.$store.getters.isJudgeCorrect
    },
    isJudgeIncorrect() {
      return this.$store.getters.isJudgeIncorrect
    },
    isFiftyfifty() {
      return this.$store.getters.isFiftyfifty
    },
    isFiftyfiftyUsed() {
      return this.$store.getters.isFiftyfiftyUsed
    },
    fiftyfifty() {
      return this.$store.getters.fiftyfifty
    },
    fiftyfiftyResult() {
      return function(name) {
        if (!this.fiftyfifty.length) return
        return this.fiftyfifty.includes(name) ? "" : "v-hidden"
      }
    },
    isDropOut() {
      return this.$store.getters.isDropOut
    },
    questionText() {
      return this.questionsData[this.questionCount]?.question || ""
    },
    currentPrizeMoney() {
      return this.prizeMoney[this.questionCount]
    },
  },
  methods: {
    init() {
      this.$store.commit('init')
    },
    async startGame() {
      this.$store.commit('isOpening', false)
      await this.$store.dispatch('getQuestionsData')
      this.setQuestion()
    },
    setQuestion() {
      this.$store.commit('fiftyfifty', [])
      this.$store.commit('choices', this.questionsData[this.questionCount]['choices'])
    },
    questionCountUp() {
      this.$store.commit('questionCountUp')
    },
    finalAnswer(e) {
      this.$store.commit('choseCurrentQuestion', e.target.dataset.id)
      this.$store.commit('isFinalAnswer', true)
    },
    finalAnswerCancel() {
      this.$store.commit('isFinalAnswer', false)
    },
    finalAnswerApply() {
      this.$store.commit('isFinalAnswer', false)
      this.judgeQuestion()
    },
    judgeQuestion() {
      this.$store.commit('isJudge', true)
      // 選択肢が正解の場合は
      if (this.choseCurrentQuestion === this.questionsData[this.questionCount]['answer']) {
        if ((this.questionCount + 1) === Object.keys(this.questionsData).length) {
          // 最後の問題も正解のためリザルト画面表示
          setTimeout(() => {
            this.showResult()
          }, this.minoDelay)
        }
        setTimeout(() => {
          this.$store.commit('isJudgeCorrect', true)
        }, this.minoDelay)
      } else {
        this.$store.commit('isJudgeIncorrect', true)
      }
    },
    nextQuestion() {
      this.$store.commit('isJudge', false)
      this.$store.commit('isJudgeCorrect', false)
      this.$store.commit('isJudgeIncorrect', false)
      this.questionCountUp()
      this.setQuestion()
    },
    showResult() {
      this.$store.commit('isResult', true)
    },
    fiftyfiftyOpen() {
      if (this.isFiftyfiftyUsed) return
      this.$store.commit('isFiftyfifty', true)
    },
    fiftyfiftyCancel() {
      this.$store.commit('isFiftyfifty', false)
    },
    fiftyfiftyApply() {
      this.$store.commit('fiftyfifty', this.questionsData[this.questionCount]['fiftyfifty'])
      this.$store.commit('isFiftyfifty', false)
      this.$store.commit('isFiftyfiftyUsed', true)
    },
    dropOut() {
      this.$store.commit('isDropOut', true)
    },
    dropOutCancel() {
      this.$store.commit('isDropOut', false)
    },
    dropOutApply() {
      this.$store.commit('isDropOut', false)
      this.init()
    },
  },
}
</script>
