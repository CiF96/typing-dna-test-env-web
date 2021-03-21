export const state = () => ({
  enrollmentsLeft: 0,
  authenticatedUser: undefined,
  token: undefined,
})

export const getters = {
  isAuthenticated(state) {
    console.log('test', { authu: state.authenticatedUser, authT: state.token })
    return Boolean(state.authenticatedUser && state.token)
  },
}

export const mutations = {
  authenticate(state, { authenticatedUser, token }) {
    console.log('authenticate', { authenticatedUser, token })
    state.authenticatedUser = authenticatedUser
    state.token = token
  },
  logoutUser(state) {
    console.log('logoutUser')
    localStorage.removeItem('token')
    state.authenticatedUser = undefined
    state.token = undefined
    console.log({
      authU: state.authenticatedUser,
      authT: state.token,
      aaa: localStorage.getItem('token'),
    })
  },
  setEnrollmentsLeft(state, numberOfEnrollments) {
    console.log('setEnrollmentsLeft')
    state.enrollmentsLeft = numberOfEnrollments
  },
}

export const actions = {
  async loginUser(
    { commit },
    { email, password, typingPattern, deviceType, patternType, textId }
  ) {
    const params = {
      email,
      password,
      typing_pattern: typingPattern,
      device_type: deviceType,
      pattern_type: patternType,
      text_id: textId,
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
      commit('authenticate', { authenticatedUser: user, token })
    }

    if (shouldUpdateEnrollments) {
      commit('setEnrollmentsLeft', response.data.enrollments_left)
    }

    return response.data
  },

  async silentLogin({ commit, state }) {
    const localToken = localStorage.getItem('token')

    console.log({ localToken })

    if (localToken === null) {
      return false
    }

    try {
      const response = await this.$axios.get('/me', {
        headers: {
          Authorization: 'Bearer ' + localToken,
        },
      })
      console.log({ silentLoginResponse: response })
      commit('authenticate', {
        authenticatedUser: response.data.user,
        token: response.data.token,
      })
      localStorage.setItem('token', response.data.token)
      return true
    } catch (error) {
      console.log('ERROR - Silent login')

      state.token = undefined
      state.authenticatedUser = undefined
      localStorage.removeItem('token')
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
      textId,
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
      text_id: textId,
    }

    console.log({ params })

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
      console.log({ shouldUpdateEnrollments })
    }

    return response.data
  },

  async getTypingPatternData(
    { commit },
    { userId, typingPattern, deviceType, patternType, textId }
  ) {
    const params = {
      user_id: userId,
      typing_pattern: typingPattern,
      device_type: deviceType,
      pattern_type: patternType,
      text_id: textId,
    }

    const response = await this.$axios.post('/typing-pattern-data', params)
    const messageCode = response.data.typing_dna.message_code
    const shouldUpdateEnrollments = messageCode === 1 || messageCode === 10

    if (shouldUpdateEnrollments) {
      commit('setEnrollmentsLeft', response.data.enrollments_left)
    }

    console.log({
      response,
      messageCode,
    })

    return response.data
  },
}
