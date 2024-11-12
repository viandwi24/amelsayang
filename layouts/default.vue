<template>
  <div class="w-full min-h-screen bg-gray-950">
    <!-- navbar -->
    <div class="w-full h-[56px] flex bg-gray-950 border-b border-gray-500/30">
    <div class="flex-1 max-w-screen-lg mx-auto flex items-center justify-between">
      <NuxtLink to="/">
        <div class="font-bold text-xl">AMEL ❤️</div>
      </NuxtLink>
      <div class="flex gap-3">
        <UButton label="Register" variant="ghost" />
        <UButton label="Login" />
      </div>
    </div>
    </div>

    <!-- child / page -->
    <slot />
  </div>
</template>