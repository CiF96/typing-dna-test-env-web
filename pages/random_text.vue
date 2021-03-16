<template>
  <main
    class="w-full h-full items-center justify-center bg-blue-100 p-8 flex flex-col min-height-100"
  >
    <div class="bg-white shadow rounded max-w-xl">
      <div class="px-8 py-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Random text form
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          This is a mock text area form. Here we are testing the typingDna
          solution for pre-written text. You have to rewrite the presented
          quote.
        </p>
        <div />
      </div>
      <div class="border-t border-gray-200 p-8">
        <h4 class="text-sm font-medium mb-1">quote to be rewritten</h4>
        <div class="mb-4 border-gray-400 border rounded p-4">
          <p class="text-base text-gray-500">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
            impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis
            ratione.
          </p>
        </div>
        <formulate-form
          :form-errors="formErrors"
          :errors="inputErrors"
          form-error-class="text-red-500"
          class="mb-4"
          @submit="submitRandomTextForm"
        >
          <formulate-input
            id="quote_text"
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
              name="send"
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
    }
  },

  methods: {
    async submitRandomTextForm(data: { quote: string }) {
      console.log({ data })
      const quoteFormTypingPattern = typingDna.getTypingPattern({
        type: 2,
        text:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
        targetId: 'quote_text',
      })

      try {
        const verifyQuoteResponse = await this.$store.dispatch(
          'getTypingPatternData',
          {
            userId: this.$store.state.authenticatedUser.id,
            typingPattern: quoteFormTypingPattern,
            deviceType,
            patternType: '2',
          }
        )

        console.log({ verifyQuoteResponse })
        alert('You have been successfully verified. Congratulations!')
      } catch (error) {
        console.log('DEV - ', { error })
        typingDna.reset()
        const errorStatus = error.response.status
        if (errorStatus === 422) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
        }
        if (errorStatus === 404) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
        }
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

.min-height-100 {
  min-height: 100vh;
}
</style>
