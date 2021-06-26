import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isOpening: true,
    questionsData: [],
    questionCount: 0,
    choseCurrentQuestion: '',
    choices: [],
    isFinalAnswer: false,
    isJudge: false,
    isJudgeCorrect: false,
    isJudgeIncorrect: false,
    isResult: false,
    isFiftyfifty: false,
    isFiftyfiftyUsed: false,
    fiftyfifty: [],
    isDropOut: false,
  },
  getters: {
    isOpening: state => state.isOpening,
    questionsData: state => state.questionsData,
    questionCount: state => state.questionCount,
    choseCurrentQuestion: state => state.choseCurrentQuestion,
    choices: state => state.choices,
    isFinalAnswer: state => state.isFinalAnswer,
    isJudge: state => state.isJudge,
    isJudgeCorrect: state => state.isJudgeCorrect,
    isJudgeIncorrect: state => state.isJudgeIncorrect,
    isResult: state => state.isResult,
    isFiftyfifty: state => state.isFiftyfifty,
    isFiftyfiftyUsed: state => state.isFiftyfiftyUsed,
    fiftyfifty: state => state.fiftyfifty,
    isDropOut: state => state.isDropOut,
  },
  mutations: {
    init(state) {
      state.isOpening = true
      state.questionsData = []
      state.questionCount = 0
      state.choseCurrentQuestion = ''
      state.choices = []
      state.isJudge = false
      state.isResult = false
      state.isFiftyfifty = false
      state.isFiftyfiftyUsed = false
      state.fiftyfifty = []
    },
    isOpening(state, bool) {
      state.isOpening = bool
    },
    questionsData(state, data) {
      state.questionsData = data
    },
    questionCountUp(state) {
      state.questionCount++
    },
    choseCurrentQuestion(state, str) {
      state.choseCurrentQuestion = str
    },
    choices(state, arr) {
      state.choices = arr
    },
    isFinalAnswer(state, bool) {
      state.isFinalAnswer = bool
    },
    isJudge(state, bool) {
      state.isJudge = bool
    },
    isJudgeCorrect(state, bool) {
      state.isJudgeCorrect = bool
    },
    isJudgeIncorrect(state, bool) {
      state.isJudgeIncorrect = bool
    },
    isResult(state, bool) {
      state.isResult = bool
    },
    isFiftyfifty(state, bool) {
      state.isFiftyfifty = bool
    },
    isFiftyfiftyUsed(state, bool) {
      state.isFiftyfiftyUsed = bool
    },
    fiftyfifty(state, arr) {
      state.fiftyfifty = arr
    },
    isDropOut(state, bool) {
      state.isDropOut = bool
    },
  },
  actions: {
    async getQuestionsData({ commit }) {
      const data = await axios.get('https://api-charades-fzx9fn3j387f.netlify.app/.netlify/functions/quiz-millionaire')
        .then(res => res.data)
        .catch(e => {
          console.log(e);
        });
      commit('questionsData', data)
    },
  }
})