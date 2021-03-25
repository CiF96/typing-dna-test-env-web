<template>
  <nav class="bg-blue-500 fixed inset-x-0 top-0">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            type="button"
            :class="
              isMobileMenuActive &&
              'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white focus:bg-blue-800'
            "
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-400"
            aria-controls="mobile-menu"
            aria-expanded="false"
            @click="toggleIsMobileMenuActive"
          >
            <span class="sr-only">Open main menu</span>

            <!-- :class="isMobileMenuActive ? 'hidden' : 'block'" -->
            <svg
              v-if="!isMobileMenuActive"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            <!-- :class="isMobileMenuActive ? 'block' : 'hidden'" -->
            <svg
              v-if="isMobileMenuActive"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex-shrink-0 flex items-center">
            <!-- <img
                class="block lg:hidden h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                alt="Workflow"
              /> -->
            <div class="block lg:hidden">
              <img class="h-8 w-8" src="/typingdna-logo.png" />
            </div>
            <!-- <img
                class="hidden lg:block h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                alt="Workflow"
              /> -->
            <logo />
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <nuxt-link
                id="same-text"
                to="/same-text"
                :class="
                  selectedMenuItem === 'same-text'
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-300 hover:bg-blue-400 hover:text-white'
                "
                class="px-3 py-2 rounded-md text-sm font-medium"
                @click.native="
                  setSelectedMenuItem($event)
                  $store.commit('setEnrollmentsLeft', 0)
                "
                >Same Text</nuxt-link
              >
              <nuxt-link
                id="any-text"
                to="/any-text"
                :class="
                  selectedMenuItem === 'any-text'
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-300 hover:bg-blue-400 hover:text-white'
                "
                class="px-3 py-2 rounded-md text-sm font-medium"
                @click.native="
                  setSelectedMenuItem($event)
                  $store.commit('setEnrollmentsLeft', 0)
                "
                >Any Text</nuxt-link
              >
              <nuxt-link
                id="extended"
                to="/extended"
                :class="
                  selectedMenuItem === 'extended'
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-300 hover:bg-blue-400 hover:text-white'
                "
                class="px-3 py-2 rounded-md text-sm font-medium"
                @click.native="
                  setSelectedMenuItem($event)
                  $store.commit('setEnrollmentsLeft', 0)
                "
                >Extended</nuxt-link
              >
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button
                id="user-menu"
                type="button"
                :class="
                  isUserMenuActive &&
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                "
                class="bg-gray-800 flex text-sm rounded-full"
                aria-expanded="false"
                aria-haspopup="true"
                @click="toggleIsUserMenuActive"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>
            </div>

            <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          -->
            <!-- :class="!isUserMenuActive && 'hidden'" -->
            <div
              v-if="isUserMenuActive"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <button
                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                @click="logoutUser"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div
      id="mobile-menu"
      :class="isMobileMenuActive ? 'block sm:hidden' : 'hidden'"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <nuxt-link
          id="same-text"
          to="/same-text"
          :class="
            selectedMenuItem === 'same-text'
              ? 'bg-blue-800 text-white'
              : 'text-gray-300 hover:bg-blue-400 hover:text-white'
          "
          class="block px-3 py-2 rounded-md text-base font-medium"
          @click.native="
            setSelectedMenuItem($event)
            $store.commit('setEnrollmentsLeft', 0)
            toggleIsMobileMenuActive()
          "
          >Same Text</nuxt-link
        >
        <nuxt-link
          id="any-text"
          to="/any-text"
          :class="
            selectedMenuItem === 'any-text'
              ? 'bg-blue-800 text-white'
              : 'text-gray-300 hover:bg-blue-400 hover:text-white'
          "
          class="block px-3 py-2 rounded-md text-base font-medium"
          @click.native="
            setSelectedMenuItem($event)
            $store.commit('setEnrollmentsLeft', 0)
            toggleIsMobileMenuActive()
          "
          >Any Text</nuxt-link
        >
        <nuxt-link
          id="extended"
          to="/extended"
          :class="
            selectedMenuItem === 'extended'
              ? 'bg-blue-800 text-white'
              : 'text-gray-300 hover:bg-blue-400 hover:text-white'
          "
          class="block px-3 py-2 rounded-md text-base font-medium"
          @click.native="
            setSelectedMenuItem($event)
            $store.commit('setEnrollmentsLeft', 0)
            toggleIsMobileMenuActive()
          "
          >Extended</nuxt-link
        >
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import logo from '~/components/Logo.vue'

export default Vue.extend({
  components: {
    logo,
  },
  data() {
    return {
      selectedMenuItem: 'same-text',
      isMobileMenuActive: false,
      isUserMenuActive: false,
    }
  },

  mounted() {
    console.log(this.$route.name)
    if (this.$route.name == null) {
      return
    }
    this.selectedMenuItem = this.$route.name
  },
  methods: {
    // ...mapMutations({
    //   logoutUser: 'logoutUser',
    // }),
    logoutUser() {
      this.$store.commit('logoutUser')
      this.$router.push('/login')
    },
    setSelectedMenuItem(event: any) {
      this.selectedMenuItem = event.currentTarget.id
    },
    toggleIsMobileMenuActive() {
      if (this.isMobileMenuActive) {
        this.isMobileMenuActive = false
      } else {
        this.isMobileMenuActive = true
      }
    },
    toggleIsUserMenuActive() {
      if (this.isUserMenuActive) {
        this.isUserMenuActive = false
      } else {
        this.isUserMenuActive = true
      }
    },
  },
})
</script>
<style></style>
