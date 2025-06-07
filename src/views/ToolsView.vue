<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header>
    <h1>This is a work in progress! <RouterLink to="/"> Please go back </RouterLink> 😊</h1>
    <p>(or remind me to finish it on discord @thenerdman)</p>
  </header>
  <main>
    <h1>Tools</h1>
    <h2>I've built</h2>
    <ul>
      <li>Unfortunately most of the tools I've built are IP of my employers</li>
    </ul>
    <h2>I've helped</h2>
    <ul>
      <li>
        <a href="https://github.com/momentum-mod/website" target="_blank" rel="noopener noreferrer"
          >Momentum Mod - Website/API</a
        >
      </li>
    </ul>
    <h2>I use</h2>
    <ul>
      <li>
        <a href="https://gitmoji.dev/" target="_blank" rel="noopener noreferrer"
          >Gitmoji, because yes, emojis should be in git commits too</a
        >
      </li>
    </ul>
  </main>
</template>
