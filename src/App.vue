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
          <button @click="fiftyfiftyOpen" class="btn btn--secondary" :class="{ 'btn--disabled': isUsedFiftyfifty }">50:50</button>
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

    <div v-show="isDropOut" class="modal">
      <div class="modal-inner">
        <h1>ドロップアウト？</h1>
        <p class="sub-text">ドロップアウトするとこれまでの賞金を手に入れて終了となります。<br>
        本当にドロップアウトしますか？</p>
        <button @click="dropOutCancel" class="btn btn--secondary">いいえ</button>
        <button @click="dropOutApply" class="btn btn--primary">はい</button>
      </div>
    </div>

    <div v-show="isFiftyfifty" class="modal">
      <div class="modal-inner">
        <h1>50:50 を使用しますか？</h1>
        <button @click="fiftyfiftyCancel" class="btn btn--secondary">いいえ</button>
        <button @click="fiftyfiftyApply" class="btn btn--primary">使用する</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
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
      isOpening: true,
      isFinalAnswer: false,
      isJudge: false,
      isJudgeCorrect: false,
      isJudgeIncorrect: false,
      isResult: false,
      isDropOut: false,
      isFiftyfifty: false,
      isUsedFiftyfifty: false,
      minoDelay: 100,
      fiftyfifty: [],
    }
  },
  computed: {
    questionsData() {
      return this.$store.state.questionsData
    },
    questionCount() {
      return this.$store.state.questionCount
    },
    choseCurrentQuestion() {
      return this.$store.state.choseCurrentQuestion
    },
    choices() {
      return this.$store.state.choices
    },
    currentQuestionNum() {
      console.log(this.questionCount);
      return this.questionCount + 1
    },
    questionText() {
      return this.questionsData[this.questionCount]?.question || ""
    },
    currentPrizeMoney() {
      return this.prizeMoney[this.questionCount]
    },
    fiftyfiftyResult() {
      return function(name) {
      if (!this.fiftyfifty.length) return
        return this.fiftyfifty.includes(name) ? "" : "v-hidden"
      }
    }
  },
  methods: {
    init() {
      // this.questionsData = []
      // this.questionCount = 0
      // this.choseCurrentQuestion = 0
      // this.choices = []
      this.isOpening = true
      this.isFinalAnswer = false
      this.isJudge = false
      this.isJudgeCorrect = false
      this.isJudgeIncorrect = false
      this.isResult = false
      this.isDropOut = false
      this.isFiftyfifty = false
      this.isUsedFiftyfifty = false
      this.minoDelay = 100
      this.isLoading = false
    },
    async startGame() {
      this.isOpening = false
      await this.$store.dispatch('getQuestionsData')
      this.setQuestion()
    },
    questionCountUp() {
      this.$store.commit('questionCountUp')
    },
    setQuestion() {
      this.fiftyfifty = []
      this.$store.commit('choices', this.questionsData[this.questionCount]['choices'])
    },
    finalAnswer(e) {
      this.$store.commit('choseCurrentQuestion', e.target.dataset.id)
      this.isFinalAnswer = true
    },
    finalAnswerCancel() {
      this.isFinalAnswer = false
    },
    finalAnswerApply() {
      this.isFinalAnswer = false
      this.judgeQuestion()
    },
    judgeQuestion() {
      this.isJudge = true

      // 選択肢が正解の場合は
      if (this.choseCurrentQuestion === this.questionsData[this.questionCount]['answer']) {
        if ((this.questionCount + 1) === Object.keys(this.questionsData).length) {
          // 最後の問題も正解のためリザルト画面表示
          setTimeout(() => {
            this.showResult()
          }, this.minoDelay)
        }
        setTimeout(() => {
          this.isJudgeCorrect = true
        }, this.minoDelay)
      } else {
        this.isJudgeIncorrect = true
      }
    },
    nextQuestion() {
      this.isJudge = false
      this.isJudgeCorrect = false
      this.isJudgeIncorrect = false
      this.questionCountUp()
      this.setQuestion()
    },
    showResult() {
      this.isResult = true
    },
    fiftyfiftyOpen() {
      if (this.isUsedFiftyfifty) return
      this.isFiftyfifty = true
    },
    fiftyfiftyCancel() {
      this.fiftyfifty = []
      this.isFiftyfifty = false
    },
    fiftyfiftyApply() {
      this.fiftyfifty = this.questionsData[this.questionCount]['fiftyfifty']
      this.isFiftyfifty = false
      this.isUsedFiftyfifty = true
    },
    dropOut() {
      this.isDropOut = true
    },
    dropOutCancel() {
      this.isDropOut = false
    },
    dropOutApply() {
      this.init()
    },
  },
}
</script>

<style>
@import "./assets/styles/ress.css";
@import "./assets/styles/main.css";
</style>