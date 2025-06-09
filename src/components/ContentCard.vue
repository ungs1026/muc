<template>
  <div class="card">
    <div>
      <img :src="item.img" :alt="item.title">
    </div>
    <div>
      <h3>{{ item.title }}</h3>
      <p>{{ item.sub_desc }}</p>
    </div>
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow .2s;
}
.card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card img {
  width: 100%;
}
</style>
