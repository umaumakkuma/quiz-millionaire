import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    questionsData: [],
    questionCount: 0,
    choseCurrentQuestion: '',
    choices: [],
  },
  getters: {
    questionsData: state => state.questionsData,
    questionCount: state => state.questionCount,
    choseCurrentQuestion: state => state.choseCurrentQuestion,
    choices: state => state.choices
  },
  mutations: {
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
    }
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