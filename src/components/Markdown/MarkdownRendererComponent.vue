<template>
  <vue-markdown-render
    class="markdown-body"
    :source="content"
    :options="markdownOptions"
    :plugins="plugins"
  />
</template>

<script setup lang="ts">
import { type Options as MarkdownItOptions } from 'markdown-it';
import { computed } from 'vue';
import VueMarkdownRender from 'vue-markdown-render';
import MarkdownItHighlightjs from 'markdown-it-highlightjs';

defineProps<{ content: string }>();

const markdownOptions = computed<MarkdownItOptions>(() => ({
  html: true,
  linkify: true,
  typographer: true,
}));

const plugins = computed(() => [MarkdownItHighlightjs]);
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css';

/* Add padding between markdown items */
.markdown-body :deep(p),
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(ul),
.markdown-body :deep(ol),
.markdown-body :deep(pre),
.markdown-body :deep(blockquote),
.markdown-body :deep(table) {
  margin-bottom: 1.2em;
}

.markdown-body :deep(li) {
  margin-bottom: 0.5em;
}
</style>
