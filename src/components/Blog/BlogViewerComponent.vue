<template>
  <transition name="card-slide">
    <div v-if="localShow" class="modal-overlay">
      <div class="modal-content card-bottom" v-on-click-outside="emitClose">
        <button class="modal-close" @click="emitClose">&times;</button>
        <div v-if="!localBlog">
          <p>Loading blog content...</p>
        </div>
        <div v-else>
          <h2>{{ localBlog.title }}</h2>
          <p v-if="localBlog.date">Published on: {{ localBlog.date }}</p>
          <MarkdownRendererComponent :content="localBlog.content" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineEmits, computed } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import type { BlogFile } from '@/utils/types/BlogItem.type';
import MarkdownRendererComponent from '../Markdown/MarkdownRendererComponent.vue';

const props = defineProps<{ show: boolean; blog?: BlogFile }>();
const emit = defineEmits(['close']);

const transitionDuration = 350; // ms, match your CSS

const localShow = computed({
  get() {
    return props.show;
  },
  set(val: boolean) {
    if (!val) {
      setTimeout(() => emit('close'), transitionDuration);
    }
  },
});

const localBlog = computed({
  get() {
    return props.blog;
  },
  set(val: BlogFile | undefined) {
    if (!val) {
      setTimeout(() => emit('close'), transitionDuration + 10);
    }
  },
});

function emitClose() {
  localShow.value = false;
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.card-bottom {
  background: var(--color-background, #fff);
  color: var(--color-text, #222);
  border-radius: 18px 18px 0 0;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.18);
  max-width: 80vw;
  width: 100vw;
  max-height: 85vh;
  overflow-y: auto;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  position: relative;
  margin-bottom: 0;
  animation: card-slide-up 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #222;
}
.card-slide-enter-active,
.card-slide-leave-active {
  transition:
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-slide-enter-from,
.card-slide-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
.card-slide-enter-to,
.card-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
@keyframes card-slide-up {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
