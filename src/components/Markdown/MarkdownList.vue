<template>
  <component :is="ordered ? 'ol' : 'ul'">
    <slot />
  </component>
</template>

<script setup lang="ts">
defineProps<{ ordered?: boolean }>();
</script>

<style scoped>
/* Add list styles here */
</style>
