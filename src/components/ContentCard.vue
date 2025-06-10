<template>
  <div class="card">
    <!-- font 폰트 프리뷰가 필요한 경우 -->
    <div v-if="item.type === 'font' && item.font_cdn" class="preview-container">
      <div
        class="font-preview"
        :style="{ fontFamily: item.title }"
      >
        {{ previewText || '미리보기 텍스트' }}
      </div>
    </div>
    <!-- 그 외는 이미지 출력 -->
    <div v-else>
      <img :src="item.img" :alt="item.title" />
    </div>

    <div class="info">
      <h3>{{ item.title }}</h3>
      <p>{{ item.sub_desc }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentCard',
  props: {
    item: Object,
    previewText: {
      type: String,
      default: ''
    }
  },
  mounted() {
    // font 폰트가 있으면 동적으로 import
    if (this.item.type === 'font' && this.item.font_cdn) {
      const styleTag = document.createElement('style');
      styleTag.innerText = `@import url('${this.item.font_cdn}');`;
      document.head.appendChild(styleTag);
    }
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
.preview-container {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
  padding: 8px;
}
.font-preview {
  font-size: 20px;
}
.info {
  text-align: center;
  margin-top: 8px;
}
.info h3 {
  margin: 0;
  font-size: 18px;
}
.info p {
  margin: 4px 0 0;
  color: #666;
  font-size: 14px;
}
</style>
