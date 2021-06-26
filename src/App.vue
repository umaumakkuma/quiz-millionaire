<template>
  <div id="app">
    <div class="contents-wrap">
      <div class="contents-inner">
        <h1>第<span>{{ currentQuestionNum }}</span>問</h1>
        <p class="sub-text">{{ questionText }}</p>
        <p class="sub-text"><span>{{ currentPrizeMoney }}</span>円</p>
        <div class="contents-main">
          <ul class="answer-area">
            <li v-for="(value, name, key) in choices" :key="key" @click="finalAnswer" :data-id="name" :class="fiftyfiftyResult(name)">{{ value }}</li>
          </ul>
          <button @click="dropOut" class="btn btn--secondary">ドロップアウト</button>
          <button @click="fiftyfiftyOpen" class="btn btn--secondary" :class="{ 'btn--disabled': isFiftyfiftyUsed }">50:50</button>
        </div>
      </div>
    </div>

    <div v-show="isOpening" class="modal">
      <div class="modal-inner">
        <h1>クイズ＄ミリオネア？</h1>
        <p class="sub-text">何問解けるかな？</p>
        <div class="contents-main">
          <button @click="startGame" class="btn btn--primary">開始する</button>
        </div>
      </div>
    </div>

    <div v-show="isFinalAnswer" class="modal">
      <div class="modal-inner">
        <h1>ファイナルアンサー？</h1>
        <button @click="finalAnswerCancel" class="btn btn--secondary">いいえ</button>
        <button @click="finalAnswerApply" class="btn btn--primary">ファイナルアンサー！</button>
      </div>
    </div>

    <div v-show="isJudge" class="modal">
      <div class="modal-inner">
        <h1>あなたの選択肢は…</h1>
        <div v-show="isJudgeCorrect">
          <p>正解！</p>
          <button @click="nextQuestion" class="btn btn--secondary">次の問題へ</button>
        </div>
        <div v-show="isJudgeIncorrect">
          <p>不正解…</p>
          <p>次回のチャレンジをお待ちしています。</p>
          <button @click="init" class="btn btn--secondary">クイズ開始画面に戻る</button>
        </div>
      </div>
    </div>

    <div v-show="isResult" class="modal">
      <div class="modal-inner">
        <p class="sub-text">全問正解おめでとう！<br>
        賞金<span>{{ currentPrizeMoney }}</span>円はあなたのものです！</p>
      </div>
    </div>

    <div v-show="isFiftyfifty" class="modal">
      <div class="modal-inner">
        <h1>50:50 を使用しますか？</h1>
        <button @click="fiftyfiftyCancel" class="btn btn--secondary">いいえ</button>
        <button @click="fiftyfiftyApply" class="btn btn--primary">使用する</button>
      </div>
    </div>

    <div v-show="isDropOut" class="modal">
      <div class="modal-inner">
        <h1>ドロップアウト？</h1>
        <p class="sub-text">ドロップアウトするとこれまでの賞金を手に入れて終了となります。<br>
        本当にドロップアウトしますか？</p>
        <button @click="dropOutCancel" class="btn btn--secondary">いいえ</button>
        <button @click="dropOutApply" class="btn btn--primary">はい</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      prizeMoney: [
        10000,
        20000,
        30000,
        50000,
        100000,
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
    isResult() {
      return this.$store.getters.isResult
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
    currentQuestionNum() {
      return this.questionCount + 1
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

      this.minoDelay = 100
      this.isLoading = false
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
      this.$store.commit('init')
    },
  },
}
</script>

<style>
@import "./assets/styles/ress.css";
@import "./assets/styles/main.css";
</style>