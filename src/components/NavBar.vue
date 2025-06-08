<template>
  <nav class="navbar">
    <ul>
      <li 
        v-for="item in items" 
        :key="item" 
        :class="{ active: item === current }"
        @click="$emit('select', item)"
      >
        {{ item.toUpperCase() }}
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    items: Array,
    current: String
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 60px;
  background: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}
.navbar ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0; padding: 0;
}
.navbar li {
  color: #fff;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background .2s;
}
.navbar li:hover,
.navbar li.active {
  background: #555;
}
</style>
