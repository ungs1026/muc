<template>
  <div class="list-container">
    <ContentCard 
      v-for="item in items" 
      :key="item.id" 
      :item="item" 
      @click="$emit('selectItem', item)"
    />
  </div>
</template>

<script>
import ContentCard from './ContentCard.vue'

export default {
  name: 'ContentList',
  components: { ContentCard },
  props: {
    items: Array
  }
}
</script>

<style scoped>
.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
  gap: 20px;
  padding: 20px;
}
</style>
