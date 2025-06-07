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
        <transition name="fade-up">
          <button v-if="showBackToTop && isMobile" class="back-to-top" @click="scrollToTop">
            Back to top
          </button>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineEmits, computed, ref, onMounted, onBeforeUnmount } from 'vue';
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

function scrollToTop() {
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const isMobile = ref(false);
const showBackToTop = ref(false);

function handleScroll() {
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    const scrollTop = modalContent.scrollTop;
    const scrollHeight = modalContent.scrollHeight - modalContent.clientHeight;
    showBackToTop.value = scrollHeight > 0 && scrollTop > scrollHeight * 0.05;
  }
}

onMounted(() => {
  // Simple mobile detection (can be improved)
  isMobile.value =
    window.matchMedia('(max-width: 600px)').matches || /Mobi|Android/i.test(navigator.userAgent);

  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.addEventListener('scroll', handleScroll);
  }
  handleScroll(); // Initial check
});

// Clean up event listener
onBeforeUnmount(() => {
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.removeEventListener('scroll', handleScroll);
  }
});
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

.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-up-enter-to,
.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.back-to-top {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 2.5rem;
  z-index: 1100;
  background: var(--color-background, #fff);
  color: var(--color-text, #222);
  border: 1px solid #ccc;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.back-to-top:hover {
  background: #222;
  color: #fff;
}
@media (max-width: 600px) {
  .modal-overlay {
    align-items: stretch;
    padding: 0;
  }
  .card-bottom {
    border-radius: 0;
    max-width: 100vw;
    width: 100vw;
    max-height: 100vh;
    height: 100vh;
    margin-bottom: 0;
    padding-top: 3.5rem;
    animation: none;
  }
  .modal-close {
    top: 1.2rem;
    right: 1.2rem;
    font-size: 2.2rem;
  }
  .back-to-top {
    bottom: 1.2rem;
    font-size: 1.1rem;
    width: calc(100vw - 2rem);
    left: 1rem;
    transform: none;
    border-radius: 1.5rem;
  }
}
</style>
