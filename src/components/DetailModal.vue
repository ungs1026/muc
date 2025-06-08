<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <h2>{{ item.title }}</h2>
      <p>{{ item.desc }}</p>
      <!-- 상세 내용 추가 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailModal',
  props: {
    item: Object
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 8px; right: 8px;
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
