<template>
  <div class="welcome">
    <LogoIcon ref="logo" class="logo" :width="width" :height="height" @click="toggleCrazyEyes" />
    <h1 class="welcome-text">
      Hi I'm <strong>Alex</strong>,
      <span>aka <a href="https://github.com/TheNerdMan" target="_blank">TheNerdMan</a>,</span>
      <span>aka <strong>Nerdie</strong>,</span>
      <span>aka <strong>Nerd</strong></span>
    </h1>
  </div>
</template>

<script setup lang="ts">
import LogoIcon from './icons/LogoIcon.vue';
import { ref, computed } from 'vue';
const logo = ref<InstanceType<typeof LogoIcon> | null>(null);

const crazyEyesTimeout = ref<number | null>(null);

function toggleCrazyEyes() {
  if (crazyEyesTimeout.value) {
    clearTimeout(crazyEyesTimeout.value);
    crazyEyesTimeout.value = null;
    logo.value?.resetEyes();
    return;
  }

  if (logo.value != null) {
    logo.value?.randomizeEyes();
    crazyEyesTimeout.value = setInterval(() => {
      logo.value?.randomizeEyes();
    }, 500);
  }
}

const mq = computed(() =>
  typeof window !== 'undefined' ? window.matchMedia('(max-width: 600px)') : { matches: false },
);
const width = computed(() => {
  return mq.value.matches ? 200 : 100;
});
const height = computed(() => {
  return mq.value.matches ? 200 : 100;
});
</script>

<style scoped lang="scss">
.welcome {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  margin-top: 20px;
}
.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  margin-right: 6rem;
}
.welcome-text {
  font-size: 24px;
  text-align: left;
  strong,
  a {
    font-weight: bold;
  }
  span {
    display: block;
    margin-top: 5px;
    padding-left: 1.5rem;
  }
}
@media (max-width: 600px) {
  .welcome {
    align-items: center;
  }
  .logo {
    margin-right: 0rem;
    width: 200px;
    height: 200px;
  }
  .welcome-text {
    font-size: 20px;
    text-align: left;
  }
}
</style>
