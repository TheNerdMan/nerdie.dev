<template>
  <div class="blog-item" @click="emit('click', blog)" style="cursor: pointer">
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
