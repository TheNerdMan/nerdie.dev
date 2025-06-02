<template>
  <div>
    <component
      v-for="(fragment, idx) in fragments"
      :key="idx"
      :is="resolveComponent(fragment)"
      v-bind="getProps(fragment)"
    >
      <template v-if="fragment.children && fragment.children.length">
        <MarkdownRendererComponent :content="''" :fragments="fragment.children" />
      </template>
      <template v-else-if="fragment.content">
        {{ fragment.content }}
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MarkdownHeading from './MarkdownHeading.vue';
import MarkdownParagraph from './MarkdownParagraph.vue';
import MarkdownList from './MarkdownList.vue';
import MarkdownListItem from './MarkdownListItem.vue';
import MarkdownCodeBlock from './MarkdownCodeBlock.vue';
import MarkdownBlockquote from './MarkdownBlockquote.vue';
import { fragmentMarkdown } from './fragmentMarkdown';
import type { Fragment } from './fragmentMarkdown';

const props = defineProps<{ content?: string; fragments?: Fragment[] }>();

const fragments = computed(() => {
  if (props.fragments) return props.fragments;
  if (props.content) return fragmentMarkdown(props.content);
  return [];
});

function resolveComponent(fragment: Fragment) {
  switch (fragment.type) {
    case 'heading':
      return MarkdownHeading;
    case 'paragraph':
      return MarkdownParagraph;
    case 'bullet_list':
    case 'ordered_list':
      return MarkdownList;
    case 'list_item':
      return MarkdownListItem;
    case 'blockquote':
      return MarkdownBlockquote;
    case 'code_block':
      return MarkdownCodeBlock;
    case 'inline':
      return 'span';
    case 'hr':
      return 'hr';
    case 'link':
      return 'a';
    default:
      return 'div';
  }
}

function getProps(fragment: Fragment) {
  const props: Record<string, unknown> = {};
  if (fragment.level) props.level = fragment.level;
  if (fragment.ordered !== undefined) props.ordered = fragment.ordered;
  if (fragment.type === 'link' && fragment.href) {
    props.href = fragment.href;
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }
  return props;
}
</script>

<style scoped>
a {
  display: inline-block;
}
</style>
