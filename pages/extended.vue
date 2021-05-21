<template>
  <main
    class="w-full items-center justify-center bg-blue-100 p-8 flex flex-col min-h-screen"
  >
    <div class="bg-white shadow rounded max-w-xl">
      <div class="px-8 py-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Extended form
        </h3>
        <p class="mt-1 max-w-m text-sm text-gray-500">
          This is a form we use to test the
          <span class="mt-1 max-w-m text-sm text-blue-500 font-bold"
            >typingdna</span
          >
          extended patterns. Please re-write the text below in to the text
          field.
        </p>
        <div />
      </div>

      <div class="border-t border-gray-200 p-8">
        <h4 class="text-sm font-medium mb-1">quote to be rewritten</h4>
        <div class="mb-4 border-gray-400 border rounded p-4">
          <p class="text-base text-gray-500">
            I ran into Ku Klux Klan and the threat of hurricanes, and those two
            things made me decide not to build on the Alabama coast, so we came
            back to Memphis.
          </p>
        </div>
        <p
          v-if="enrollmentsLeft > 0"
          class="mb-4 text-center text-sm font-semibold text-green-400"
        >
          Enrollments left before verification - {{ enrollmentsLeft }}
        </p>
        <!-- NAPRAVI CHOICE ZA RANDOM TEXT SA SHORT MEDIUM I LONG TEKSTOM ZA USPOREDITI KAKO DULJINA TEKSTA UTJECE NA CONFIDENCE? -->
        <formulate-form
          :key="enrollmentsLeft"
          :form-errors="formErrors"
          :errors="inputErrors"
          form-error-class="text-red-500"
          class="mb-4"
          @submit="submitRandomTextForm"
        >
          <formulate-input
            id="quote_text"
            v-model="quoteText"
            type="textarea"
            name="quoteText"
            validation-name="quote text"
            label="quote"
            validation="bail|required"
            autocomplete="off"
            label-class="input-label"
            input-class="input-area"
            error-class="input-error"
            class="mb-4"
            help-class="text-xs text-gray-500"
          />

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
import { compareTexts } from '~/utils/compareTexts'

interface VueData {
  formErrors: string[]
  inputErrors: any
  quoteText: string
}

const typingDna = new TypingDNA()

const deviceType = typingDna.isMobile() === 0 ? 'desktop' : 'mobile'

typingDna.addTarget('quote_text')

export default Vue.extend({
  // middleware: 'authenticated',
  data(): VueData {
    return {
      formErrors: [],
      inputErrors: {},
      quoteText: '',
    }
  },
  computed: {
    enrollmentsLeft() {
      return this.$store.state.enrollmentsLeft
    },
  },

  methods: {
    async submitRandomTextForm(data: { quoteText: string }) {
      const quote =
        'I ran into Ku Klux Klan and the threat of hurricanes, and those two things made me decide not to build on the Alabama coast, so we came back to Memphis.'
      const quoteTextId =
        'textId: ' +
        typingDna.getTextId(quote) +
        '-length: ' +
        quote.length.toString()

      const percentageOfRewrite = data.quoteText.length / quote.length

      if (percentageOfRewrite < 0.8) {
        alert('You need to write at least 80% of the given quote. Try again.')
        this.quoteText = ''
        typingDna.reset()
        return
      }

      if (compareTexts(quote, data.quoteText) < 0.8) {
        alert(
          'You need to rewrite at least 80% of the quote correctly. Try again.'
        )
        return
      }

      const quoteFormTypingPattern = typingDna.getTypingPattern({
        type: 2,
        text: quote,
        targetId: 'quote_text',
        textId: quoteTextId,
        length: quote.length,
      })

      try {
        const verifyQuoteResponse = await this.$store.dispatch(
          'getTypingPatternData',
          {
            userId: this.$store.state.authenticatedUser.id,
            typingPattern: quoteFormTypingPattern,
            deviceType,
            patternType: '2',
            textId: quoteTextId,
          }
        )
        console.log({ verifyQuoteResponse })

        this.quoteText = ''
        typingDna.reset()
        alert('Your pattern has been successfully submitted.')
        return
      } catch (error) {
        console.log('DEV - ', { error })
        this.quoteText = ''
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
