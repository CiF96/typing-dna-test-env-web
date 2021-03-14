export const state = () => ({
  isAuthenticated: false,
})

export const mutations = {
  authenticate(state) {
    state.isAuthenticated = true
  },
  logoutUser(state) {
    state.isAuthenticated = false
  },
}

export const actions = {
  async loginUser({ commit }, { email, password, typingPattern }) {
    const params = {
      email,
      password,
      typing_pattern: typingPattern,
    }

    const response = await this.$axios.post('/login', params)

    if (response.data.typing_dna.message_code === 1) {
      commit('authenticate')
    }

    return response.data
  },

  async registerUser(
    { commit },
    { name, lastName, email, password, passwordConfirmation, typingPattern }
  ) {
    const params = {
      name,
      last_name: lastName,
      email,
      password,
      password_confirmation: passwordConfirmation,
      typing_pattern: typingPattern,
    }

    const response = await this.$axios.post('/register', params)

    if (response.data.typing_dna.message_code === 1) {
      commit('authenticate')
    }

    return response.data
  },
}
