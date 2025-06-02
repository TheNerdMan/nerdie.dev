<template>
  <div class="blog-item" @click="emit('click', blog)" style="cursor: pointer">
    -
    <strong>{{ blog.title }}</strong>
    <span v-if="blog.date"> ({{ blog.date }})</span>
  </div>
</template>

<script setup lang="ts">
import type { BlogFile } from '@/utils/types/BlogItem.type';

defineProps<{ blog: BlogFile }>();
const emit = defineEmits<{
  (e: 'click', blog: BlogFile): void;
}>();
</script>

<style scoped>
.blog-item {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}

.blog-item:hover {
  background-color: #f0f0f060;
  border-radius: 4px;
  transition:
    background-color 0.35s ease,
    border-radius 0.45s ease;
}
</style>
