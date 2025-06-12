<template>
  <div id="app">
    <NavBar 
      :items="navItems" 
      :current="currentCategory" 
      @select="onSelectCategory" 
    />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { navItems } from './data'

const router = useRouter()
const route = useRoute()

// 경로 파라미터(category)에 따라 네비 버튼 하이라이트
const currentCategory = computed(() => route.params.category || 'library')

// 네비 클릭 시 해당 카테고리로 이동
function onSelectCategory(cat) {
  router.push({ name: 'Home', params: { category: cat } })
}
</script>

<style>
body, #app {
  margin: 0; padding: 0;
}
.main-content {
  padding-top: 60px; /* NavBar 높이만큼 */
  max-width: 1000px;
  margin: 0 auto;
}

a {
  color: white;
  text-decoration: none;
}

a:hover{
  color: #acbaff;
}

</style>
