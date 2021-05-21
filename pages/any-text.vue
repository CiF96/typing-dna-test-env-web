<template>
  <main
    class="w-full items-center justify-center flex flex-col bg-blue-100 p-8 min-h-screen"
  >
    <div class="bg-white shadow rounded max-w-xl">
      <div class="px-8 py-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Any Text form
        </h3>
        <p class="mt-1 max-w-m text-sm text-gray-500">
          This is a form we use to test the
          <span class="mt-1 max-w-m text-sm text-blue-500 font-bold"
            >typingdna</span
          >
          any-text patterns. Please rewrite the quote underneath - only the
          length is crucial - the quote does not to be rewritten perfectly.
        </p>
        <div />
      </div>
      <div class="border-t border-gray-200 p-8">
        <!-- <formulate-input
          v-if="experimentType === 'length'"
          v-model="desiredTextLength"
          :options="{
            short: 'Short',
            medium: 'Medium',
            default: 'Default',
            long: 'Long',
            veryLong: 'Very long',
          }"
          type="radio"
          label-class="input-label"
          element-class="flex mb-4"
          label="desired text length"
        /> -->

        <div class="mb-4">
          <h1 class="input-label">experiment type</h1>
          <v-select
            v-model="experimentType"
            :reduce="(experimentType) => experimentType.code"
            :value="experimentType"
            :options="[
              { label: 'Default', code: 'default' },
              { label: 'Length', code: 'length' },
            ]"
          />
        </div>

        <div v-if="experimentType === 'length'" class="mb-4">
          <h1 class="input-label">desired text length</h1>
          <v-select
            v-model="desiredTextLength"
            :reduce="(textLength) => textLength.code"
            :value="desiredTextLength"
            :options="[
              { label: 'Short', code: 'short' },
              { label: 'Medium', code: 'medium' },
              { label: 'Default', code: 'default' },
              { label: 'Long', code: 'long' },
              { label: 'Very long', code: 'veryLong' },
            ]"
          />
        </div>

        <h4 class="text-sm font-medium mb-1">quote to be rewritten</h4>
        <div class="mb-4 border-gray-400 border rounded p-4">
          <p v-if="quote != null" class="text-base text-gray-500">
            {{ quote }}
          </p>
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
          @submit="submitEmailForm"
        >
          <formulate-input
            id="email_text"
            v-model="emailText"
            type="textarea"
            name="emailText"
            validation-name="email text"
            label="text"
            validation="bail|required"
            autocomplete="off"
            label-class="input-label"
            input-class="input-area"
            error-class="input-error"
            class="mb-4"
            help-class="text-xs
          text-gray-500"
            :help="
              charactersRequired > 0
                ? experimentType === 'length'
                  ? `Write between ${textSize} and ${textSize + 40} characters.
          ${charactersRequired} left.`
                  : `Write at least ${textSize} characters
          for best results. ${charactersRequired} left.`
                : ''
            "
          />

          <!-- <formulate-input
            v-model="experimentType"
            :options="{
              default: 'Default',
              length: 'Length',
            }"
            type="radio"
            decorator-class="bg-red-500 w-0"
            label-class="input-label"
            label="experiment type"
          /> -->

          <formulate-errors class="mb-4" />
          <div class="flex justify-end">
            <formulate-input
              type="submit"
              :name="enrollmentsLeft > 0 ? 'enroll' : 'verify'"
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
  emailText: string
  formErrors: string[]
  inputErrors: any
  experimentType: 'default' | 'length'
  desiredTextLength: 'short' | 'medium' | 'default' | 'long' | 'veryLong'
}

const typingDna = new TypingDNA()

const deviceType = typingDna.isMobile() === 0 ? 'desktop' : 'mobile'

typingDna.addTarget('email_text')

export default Vue.extend({
  // middleware: 'authenticated',
  data(): VueData {
    return {
      emailText: '',
      experimentType: 'default',
      desiredTextLength: 'default',
      formErrors: [],
      inputErrors: {},
    }
  },
  computed: {
    enrollmentsLeft() {
      return this.$store.state.enrollmentsLeft
    },
    quote() {
      return this.$store.state.quote
    },
    textSize() {
      switch (this.desiredTextLength) {
        case 'short':
          return 60
        case 'medium':
          return 100
        case 'default':
          return 140
        case 'long':
          return 180
        case 'veryLong':
          return 220

        default:
          return 140
      }
    },
    charactersRequired() {
      const requirement = this.textSize
      const numberOfCharacters = this.$data.emailText.length

      return requirement - numberOfCharacters
    },
  },
  watch: {
    experimentType() {
      this.desiredTextLength = 'default'
    },
    async desiredTextLength() {
      console.log({ size: this.textSize })
      await this.$store.dispatch('getQuote', { textLength: this.textSize })
    },
  },
  async mounted() {
    await this.$store.dispatch('getQuote', { textLength: this.textSize })
  },

  methods: {
    async submitEmailForm(data: {
      emailRecipient: string
      emailSubject: string
      emailText: string
    }) {
      const emailFormTextId =
        'textId: ' +
        typingDna.getTextId(data.emailText) +
        '-length: ' +
        data.emailText.length.toString()

      console.log({ dsl: this.desiredTextLength })

      const emailFormTypingPattern = typingDna.getTypingPattern({
        type: 0,
        length: data.emailText.length,
        targetId: 'email_text',
        textId: emailFormTextId,
      })

      const emailFormTypingPatternQuality = typingDna.getQuality(
        emailFormTypingPattern
      )

      console.log(emailFormTypingPattern, emailFormTypingPatternQuality)

      if (emailFormTypingPatternQuality <= 0.3) {
        alert('The text you entered is too short to be validated correctly')
        return
      }

      try {
        await this.$store.dispatch('getTypingPatternData', {
          userId: this.$store.state.authenticatedUser.id,
          typingPattern: emailFormTypingPattern,
          deviceType,
          patternType: '0',
          textId: emailFormTextId,
          experimentType: this.experimentType,
          textLength: this.desiredTextLength,
        })

        alert('Your pattern has been successfully submitted.')
        this.$data.emailText = ''
        typingDna.reset()
        await this.$store.dispatch('getQuote', { textLength: this.textSize })
      } catch (error) {
        console.log('DEV - ', { error })
        this.$data.emailText = ''
        typingDna.reset()
        const errorStatus = error.response.status
        if (errorStatus === 422) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
          return
        }
        if (errorStatus === 404) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
          alert("This pattern hasn't been enrolled.")
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
.input {
  @apply border;
  @apply py-2;
  @apply px-3;
  @apply rounded-md;
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
