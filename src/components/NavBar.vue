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
  font-family: "Bebas Neue", sans-serif;
  font-weight: 700;
  font-style: normal;
  letter-spacing: 2px;
  font-size: 18px;

  position: fixed;
  top: 0; left: 0; right: 0;
  height: 60px;
  background: #000;
  box-shadow: 0 0 6px white;
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;
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
  background: var(--main-color);
}
</style>
