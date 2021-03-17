<template>
  <main
    class="w-full min-h-full items-center justify-center flex flex-col bg-blue-100 p-8"
  >
    <div class="bg-white shadow rounded max-w-xl">
      <div class="px-8 py-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Email form</h3>
        <p class="mt-1 max-w-m text-sm text-gray-500">
          This is a mock email form. You should write an email of at least 120
          characters for the best verification accuracy.
        </p>
        <div />
      </div>
      <div class="border-t border-gray-200 p-8">
        <formulate-form
          :key="enrollmentsLeft"
          :form-errors="formErrors"
          :errors="inputErrors"
          form-error-class="text-red-500"
          class="mb-4"
          @submit="submitEmailForm"
        >
          <formulate-input
            id="email_recipient"
            type="email"
            name="emailRecipient"
            validation-name="email recipient"
            label="to"
            validation="bail|required|email"
            autocomplete="off"
            label-class="input-label"
            input-class="input"
            error-class="input-error"
            class="mb-4"
          />
          <formulate-input
            id="email_subject"
            type="text"
            name="emailSubject"
            validation-name="email subject"
            label="subject"
            autocomplete="off"
            label-class="input-label"
            input-class="input"
            error-class="input-error"
            class="mb-4"
          />
          <formulate-input
            id="email_text"
            v-model="emailText"
            type="textarea"
            name="emailText"
            validation-name="email text"
            label="email"
            validation="bail|required"
            autocomplete="off"
            label-class="input-label"
            input-class="input-area"
            error-class="input-error"
            class="mb-4"
            help-class="text-xs text-gray-500"
            :help="
              charactersRequired > 0 &&
              `Write at least 120 characters for best results. ${charactersRequired} left.`
            "
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
  emailText: string
  formErrors: string[]
  inputErrors: any
}

const typingDna = new TypingDNA()

const deviceType = typingDna.isMobile() === 0 ? 'desktop' : 'mobile'

typingDna.addTarget('email_text')

export default Vue.extend({
  // middleware: 'authenticated',
  data(): VueData {
    return {
      emailText: '',
      formErrors: [],
      inputErrors: {},
    }
  },
  computed: {
    enrollmentsLeft() {
      return this.$store.state.enrollmentsLeft
    },
    charactersRequired() {
      const requirement = 120
      const numberOfCharacters = this.$data.emailText.length

      return requirement - numberOfCharacters
    },
  },
  methods: {
    async submitEmailForm(data: {
      emailRecipient: string
      emailSubject: string
      emailText: string
    }) {
      const emailFormTextId =
        typingDna.getTextId(data.emailText) +
        '-email-' +
        data.emailText.length.toString()

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
        const verifyEmailResponse = await this.$store.dispatch(
          'getTypingPatternData',
          {
            userId: this.$store.state.authenticatedUser.id,
            typingPattern: emailFormTypingPattern,
            deviceType,
            patternType: '0',
            textId: emailFormTextId,
          }
        )

        console.log({ verifyEmailResponse, eL: this.enrollmentsLeft })

        if (this.enrollmentsLeft > 0) {
          alert(
            `You have successfully enrolled a new type-0 pattern. Enrollments left berofe verification: ${this.enrollmentsLeft}`
          )
          data.emailRecipient = ''
          data.emailSubject = ''
          data.emailText = ''
          this.$data.emailText = ''
          return
        }
        alert('You have been successfully verified. Congratulations!')

        data.emailRecipient = ''
        data.emailSubject = ''
        this.$data.emailText = ''
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
