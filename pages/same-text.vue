<template>
  <main
    class="w-full min-h-full items-center justify-center bg-blue-100 p-8 flex flex-col"
  >
    <div class="bg-white shadow rounded max-w-xl">
      <div class="px-8 py-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Same Text form
        </h3>
        <p class="mt-1 max-w-m text-sm text-gray-500">
          This is a form we use to test the
          <span class="mt-1 max-w-m text-sm text-blue-500 font-bold"
            >typingdna</span
          >
          same-text patterns. Please re-write the credentials underneath exactly
          as they say.
        </p>
        <div />
      </div>

      <div class="border-t border-gray-200 p-8">
        <h4 class="text-sm font-medium mb-1">credentials</h4>
        <div class="mb-4 border-gray-400 border rounded p-4">
          <p class="text-base text-gray-500">email: test@lloyds.design</p>
          <p class="text-base text-gray-500">password: test12345678</p>
        </div>
        <p
          v-if="enrollmentsLeft > 0"
          class="mb-4 text-center text-sm font-semibold text-green-400"
        >
          Enrollments left before verification - {{ enrollmentsLeft }}
        </p>
        <formulate-form
          :key="enrollmentsLeft"
          :form-errors="formErrors"
          :errors="inputErrors"
          form-error-class="text-red-500"
          class="mb-4"
          @submit="submitSameTextForm"
        >
          <formulate-input
            id="email"
            v-model="email"
            type="text"
            name="email"
            label="email"
            validation="bail|required|matches:test@lloyds.design"
            :validation-messages="{
              matches: `The text you entered doesn't match the credential. Try again.`,
            }"
            autocomplete="off"
            label-class="input-label"
            input-class="input"
            error-class="input-error"
            class="mb-4"
            error-behavior="submit"
          />
          <formulate-input
            id="password"
            v-model="password"
            type="text"
            name="password"
            label="password"
            validation="bail|required|matches:test12345678"
            :validation-messages="{
              matches: `The text you entered doesn't match the credential. Try again.`,
            }"
            label-class="input-label"
            input-class="input"
            error-class="input-error"
            class="mb-4"
            error-behavior="submit"
          />

          <formulate-errors class="mb-4" />
          <div class="flex justify-end">
            <formulate-input
              type="submit"
              :name="enrollmentsLeft > 0 ? 'enroll' : 'send'"
              input-class="block p-3 bg-blue-500  hover:bg-blue-400 rounded-md text-white text-lg text-center w-24"
            />
          </div>
        </formulate-form>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

interface VueData {
  formErrors: string[]
  inputErrors: any
  email: string
  password: string
}

const typingDna = new TypingDNA()

const deviceType = typingDna.isMobile() === 0 ? 'desktop' : 'mobile'

typingDna.addTarget('email')
typingDna.addTarget('password')

export default Vue.extend({
  // middleware: 'authenticated',
  data(): VueData {
    return {
      formErrors: [],
      inputErrors: {},
      email: '',
      password: '',
    }
  },
  computed: {
    enrollmentsLeft() {
      return this.$store.state.enrollmentsLeft
    },
  },

  methods: {
    async submitSameTextForm(data: { email: string; password: string }) {
      const emailAndPasswordText = `${data.email ?? ''}${data.password ?? ''}`
      const emailAndPasswordTextId =
        'textId: ' +
        typingDna.getTextId(emailAndPasswordText) +
        '-length: ' +
        emailAndPasswordText.length.toString()

      const sameTextTypingPattern = typingDna.getTypingPattern({
        type: 1,
        text: emailAndPasswordText,
        textId: emailAndPasswordTextId,
      })

      console.log({ sameTextTypingPattern })

      try {
        const verifyQuoteResponse = await this.$store.dispatch(
          'getTypingPatternData',
          {
            userId: this.$store.state.authenticatedUser.id,
            typingPattern: sameTextTypingPattern,
            deviceType,
            patternType: '1',
            textId: emailAndPasswordTextId,
          }
        )
        console.log({ verifyQuoteResponse })
        alert('Your pattern has been successfully submitted.')
        this.email = ''
        this.password = ''
        typingDna.reset()
      } catch (error) {
        console.log('DEV - ', { error })
        this.email = ''
        this.password = ''
        typingDna.reset()
        const errorStatus = error.response.status
        if (errorStatus === 422) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
        }
        if (errorStatus === 404) {
          alert('This pattern was not enrolled.')
          return
        }
        if (errorStatus === 403) {
          alert("This isn't you typing is it?")
          return
        }
        alert('Something went wrong. Please try again.')
      }
    },
  },
})
</script>

<style>
.input-area {
  @apply border;
  @apply py-2;
  @apply px-3;
  @apply rounded-md;
  @apply h-32;
  @apply w-full;
}

.input-label {
  @apply mb-1;
  @apply font-bold;
  @apply text-lg;
}

.input-error {
  @apply text-red-500;
  @apply text-xs;
}
</style>
