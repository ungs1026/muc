<template>
  <div class="card">
    <h3>{{ item.title }}</h3>
    <p>{{ item.desc }}</p>
  </div>
</template>

<script>
export default {
  name: 'ContentCard',
  props: {
    item: Object
  }
}
</script>

<style scoped>
.card {
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow .2s;
}
.card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
