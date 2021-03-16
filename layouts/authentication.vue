<template>
  <div
    class="flex flex-col items-center w-full h-full bg-gradient-to-b from-blue-500 to-blue-200 p-8 min-height-100 justify-center"
  >
    <div
      class="rounded-md p-8 shadow-lg w-full bg-white sm:max-w-lg sm:mx-auto"
    >
      <Nuxt />
    </div>
    <p class="mt-2 text-center text-sm text-gray-600 max-w-md">
      This is a testing environment for the typingDna api and is not intended
      for commercial use.
    </p>
  </div>
</template>

<style>
.min-height-100 {
  min-height: 100vh;
}
</style>
