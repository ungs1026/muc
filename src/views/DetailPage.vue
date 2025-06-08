<template>
  <div class="detail-page" style="padding: 20px;">
    <h2>{{ item.title }}</h2>
    <p>{{ item.desc }}</p>
    <button @click="goBack">목록으로 돌아가기</button>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'
import { dataMap } from '../data'

const props = defineProps({
  category: String,
  id: [String, Number]
})

const router = useRouter()

const item = computed(() => {
  const arr = dataMap[props.category] || []
  return arr.find(i => i.id === Number(props.id)) || { title: '', desc: '' }
})

function goBack() {
  router.back()
}
</script>
