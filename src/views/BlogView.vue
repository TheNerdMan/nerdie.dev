<template>
  <div class="blog-header">
    <h1>The ramblings of a developer who is regularly nerd-sniped</h1>
    <p>
      Watch my journey of changing opinion about how I write code (or at least want to write code)
    </p>
  </div>
  <div class="blog-list">
    <BlogItemComponent
      v-for="blog in blogs"
      :key="blog.slug"
      :blog="blog"
      @click="handleBlogClick(blog)"
    />
  </div>
  <BlogViewerComponent :show="showBlogViewer" :blog="blogToView" @close="closeBlogViewer" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BlogItemComponent from '@/components/Blog/BlogItemComponent.vue';
import type { BlogFile } from '@/utils/types/BlogItem.type';
import BlogViewerComponent from '@/components/Blog/BlogViewerComponent.vue';
import { CustomMarkdownParser } from '@/utils/classes/CustomMarkDownParser.class';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const blogFiles = import.meta.glob('@/assets/blogs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const blogs = ref<BlogFile[]>(
  Object.entries(blogFiles).map(([path, content]) => {
    // Extract filename and maybe date/title from path
    const match = path.match(/blogs\/(\d{4})\/(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    return {
      path,
      markdown: new CustomMarkdownParser(content as string),
      year: match ? match[1] : '',
      date: match ? match[2] : '',
      slug: match ? match[3] : '',
      title: match ? match[3].replace(/-/g, ' ') : path,
    };
  }),
);

const showBlogViewer = ref(false);
const blogToView = ref<BlogFile>();

// On mount, check for deep link
onMounted(() => {
  // If route has a blog slug, open the viewer
  const slug = route.params.slug as string | undefined;
  if (slug) {
    const found = blogs.value.find((b) => b.slug === slug);
    if (found) {
      blogToView.value = found;
      showBlogViewer.value = true;
      document.documentElement.scrollTop = 0;
    }
  }
});

function closeBlogViewer() {
  showBlogViewer.value = false;
  blogToView.value = undefined;
  // Remove slug from URL
  router.push({ name: 'blog' });
}

function handleBlogClick(blog: BlogFile) {
  blogToView.value = blog;
  showBlogViewer.value = true;
  document.documentElement.scrollTop = 0; // Scroll to top when opening blog viewer
  // push the blog to the router
  router.push({
    name: 'blog-post',
    params: { slug: blog.slug },
  });
}
</script>

<style scoped>
.blog-header {
  text-align: center;
  margin-bottom: 2rem;
}
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}
</style>
