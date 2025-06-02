<template>
  <component :is="tag">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ level: number }>();
const tag = computed(() => `h${props.level}`);
</script>

<style scoped>
/* Add heading styles here */
</style>
