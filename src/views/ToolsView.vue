<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header>
    <h1>This is a work in progress! Please go back (or remind me to finish it on discord @thenerdman)</h1>
  </header>
  <main>
    <h1>Tools</h1>
    <h2>I've built</h2>
    <ul>
      <li><a href="" target="_blank" rel="noopener noreferrer">Tool 1</a></li>
      <li><a href="" target="_blank" rel="noopener noreferrer">Tool 2</a></li>
    </ul>
    <h2>I use</h2>
    <ul>
      <li><a href="https://example.com" target="_blank" rel="noopener noreferrer">Tool 3</a></li>
      <li><a href="https://example.com" target="_blank" rel="noopener noreferrer">Tool 4</a></li>
      <li><a href="https://example.com" target="_blank" rel="noopener noreferrer">Tool 5</a></li>
    </ul>
  </main>
  <footer>
    <RouterLink to="/"> Home </RouterLink>
  </footer>
</template>
