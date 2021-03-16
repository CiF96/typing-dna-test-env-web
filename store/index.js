export const state = () => ({
  enrollmentsLeft: 0,
  authenticatedUser: undefined,
  token: undefined,
})

export const getters = {
  isAuthenticated(state) {
    return Boolean(state.authenticatedUser && state.token)
  },
}

export const mutations = {
  authenticate(state, authenticatedUser, token) {
    console.log('authenticate')
    state.authenticatedUser = authenticatedUser
    state.token = token
  },
  logoutUser(state) {
    console.log('logoutUser')
    state.authenticatedUser = undefined
    state.token = undefined
    localStorage.removeItem('token')
  },
  setEnrollmentsLeft(state, numberOfEnrollments) {
    console.log('setEnrollmentsLeft')
    state.enrollmentsLeft = numberOfEnrollments
  },
}

export const actions = {
  async loginUser(
    { commit },
    { email, password, typingPattern, deviceType, patternType }
  ) {
    const params = {
      email,
      password,
      typing_pattern: typingPattern,
      device_type: deviceType,
      pattern_type: patternType,
    }

    const response = await this.$axios.post('/login', params)
    const messageCode = response.data.typing_dna.message_code
    const shouldAuthenticate = messageCode === 1
    const shouldUpdateEnrollments = messageCode === 1 || messageCode === 10
    const user = response.data.user
    const token = response.data.token

    console.log({
      response,
      messageCode,
      shouldAuthenticate,
      shouldUpdateEnrollments,
    })

    if (shouldAuthenticate) {
      localStorage.setItem('token', token)
      commit('authenticate', user, token)
    }

    if (shouldUpdateEnrollments) {
      commit('setEnrollmentsLeft', response.data.enrollments_left)
    }

    return response.data
  },

  async silentLogin({ commit, state }) {
    const localToken = localStorage.getItem('token')

    if (localToken === null) {
      return false
    }

    try {
      const response = await this.$axios.get('/me', {
        headers: {
          Authorization: 'Bearer ' + localToken,
        },
      })
      console.log(response)
      commit('authenticate', response.data.user, localToken)
      return true
    } catch (error) {
      console.log('ERROR - Silent login')

      state.token = undefined
      return false
    }
  },

  async registerUser(
    { commit },
    {
      name,
      lastName,
      email,
      password,
      passwordConfirmation,
      typingPattern,
      deviceType,
      patternType,
    }
  ) {
    const params = {
      name,
      last_name: lastName,
      email,
      password,
      password_confirmation: passwordConfirmation,
      typing_pattern: typingPattern,
      device_type: deviceType,
      pattern_type: patternType,
    }

    const response = await this.$axios.post('/register', params)
    const messageCode = response.data.typing_dna.message_code
    const shouldAuthenticate = messageCode === 1
    const shouldUpdateEnrollments = messageCode === 1 || messageCode === 10

    console.log({
      response,
      messageCode,
      shouldAuthenticate,
      shouldUpdateEnrollments,
    })

    if (shouldUpdateEnrollments) {
      commit('setEnrollmentsLeft', response.data.enrollments_left)
    }

    return response.data
  },

  async getTypingPatternData(
    { commit: _ },
    { userId, typingPattern, deviceType, patternType }
  ) {
    const params = {
      user_id: userId,
      typing_pattern: typingPattern,
      device_type: deviceType,
      pattern_type: patternType,
    }

    const response = await this.$axios.get('/get-typing-pattern-data', {
      params,
    })
    const messageCode = response.data.typing_dna.message_code

    console.log({
      response,
      messageCode,
    })

    return response.data
  },
}
