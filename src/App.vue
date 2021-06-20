<template>
  <div id="app">
    <div class="contents-wrap">
      <div class="contents-inner">
        <h1>第<span>{{ questionNum }}</span>問</h1>
        <p class="sub-text">{{ questionText }}</p>
        <p class="sub-text"><span>{{ currentPrizeMoney }}</span>円</p>
        <div class="contents-main">
          <ul id="js-answer-area" class="answer-area"></ul>
          <ul>
            <li v-for="(choice, index) in choices" :key="index" @click="finalAnswer" :data-id="index">{{ choice }}</li>
          </ul>
          <button @click="dropOut" class="btn btn--secondary">ドロップアウト</button>
          <button @click="fiftyfifty" class="btn btn--secondary" :class="{ 'btn--disabled': isUsedFiftyfifty }">50:50</button>
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
      questionsData: [
        {
          'id': 1,
          'question': '問題1',
          'choices': ['選択肢1(正解)', '選択肢2', '選択肢3', '選択肢4'],
          'answer': 0,
          'fiftyfifty': [0, 1]
        },
        {
          'id': 2,
          'question': '問題2',
          'choices': ['選択肢1', '選択肢2(正解)', '選択肢3', '選択肢4'],
          'answer': 1,
          'fiftyfifty': [1, 3]
        },
        {
          'id': 3,
          'question': '問題3',
          'choices': ['選択肢1', '選択肢2', '選択肢3(正解)', '選択肢4'],
          'answer': 2,
          'fiftyfifty': [1, 2]
        }
      ],
      prizeMoney: [
        10000,
        20000,
        30000,
        50000,
        100000,
      ],
      questionCount: 0,
      choiceCurrentQuestion: 0,
      choices: [],
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
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    questionNum() {
      return this.questionsData[this.questionCount]['id']
    },
    questionText() {
      return this.questionsData[this.questionCount]['question']
    },
    currentPrizeMoney() {
      return this.prizeMoney[this.questionCount]
    },
  },
  methods: {
    init() {
      this.questionCount = 0
      this.choiceCurrentQuestion = 0
      this.choices = []
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
    },
    main() {
      this.showQuestion()
      // this.choiceAnswer()
    },
    startGame() {
      this.isOpening = false
      this.main()
    },
    showQuestion() {
      this.choices = this.questionsData[this.questionCount]['choices']
      console.log(this.choices)
    },
    finalAnswer(e) {
      this.choiceCurrentQuestion = Number(e.target.dataset.id)
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
      if (this.choiceCurrentQuestion === this.questionsData[this.questionCount]['answer']) {
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
      this.questionCount++
      this.main()
    },
    showResult() {
      this.isResult = true
    },
    fiftyfifty() {
      if (this.isUsedFiftyfifty) return
      this.isFiftyfifty = true
    },
    fiftyfiftyCancel() {
      this.isFiftyfifty = false
    },
    fiftyfiftyApply() {
      const choices = document.querySelectorAll('.choice')
      const stayChoices = this.questionsData[this.questionCount]['fiftyfifty']
      choices.forEach((val, i) => {
        if (!stayChoices.includes(i)) {
          val.classList.add('v-hidden')
        }
      })
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