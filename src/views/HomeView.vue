<script setup lang="ts">
import HomeComponent from '@/components/HomeComponent.vue';
</script>

<template>
  <main class="landing-page">
    <HomeComponent />
    <div class="links">
      <RouterLink to="/tools">Tools</RouterLink>
      <span> | </span>
      <RouterLink to="/blog">Blogs</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
  .landing-page {
    height: calc(100vh - 4rem);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
