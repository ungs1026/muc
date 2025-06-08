<template>
  <ContentList 
    :items="dataMap[category]" 
    @selectItem="onSelectItem" 
  />
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import ContentList from '../components/ContentList.vue'
import { dataMap } from '../data'

const props = defineProps({
  category: {
    type: String,
    default: 'library'
  }
})

const router = useRouter()

function onSelectItem(item) {
  router.push({ 
    name: 'Detail', 
    params: { category: props.category, id: item.id } 
  })
}
</script>
