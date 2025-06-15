<template>
  <div class="card">
    <div v-if="item.type === 'font' && item.font_cdn" class="preview-container">
      <div
        class="font-preview"
        :style="{ fontFamily: item.title }"
      >
        {{ previewText || '미리보기 텍스트' }}
      </div>
    </div>
    <div v-else class="card_img">
      <img :src="item.img" :alt="item.title" />
    </div>
    
    <div class="info">
      <h3>{{ item.title }}</h3>
      <hr style="width: 100%">
      <p>{{ item.sub_desc }}</p>
      <div class="preview_wrapper">
        <a
          v-if="item.preview_url"
          :href="item.preview_url"
          class="preview-btn"
          target="_blank"
          @click.stop
        >
          Preview
        </a>
      </div>
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
  height: 250px; /* 버튼 공간 확보를 위해 높이 조정 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #000;
  border: 1px solid var(--main-color);
  border-radius: 8px;
  color: white;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow .2s;
}
.card:hover {
  box-shadow: 0 2px 8px rgba(150, 167, 255, 0.2); /* 호버 효과 개선 */
}
.card .card_img {
  width: 100%;
  height: 114px; /* 높이 고정 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  margin-bottom: 12px;
}
.card .card_img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.preview-container {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
  padding: 8px;
}
.font-preview {
  font-size: 20px;
  text-align: center;
}
.info {
  text-align: center;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info h3 {
  margin: 0;
  font-size: 18px;
}
.info p {
  height: 50px;
  margin: 4px 0 0;
  font-size: 14px;
  overflow: auto;
  width: 100%;
}
.preview_wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.preview_wrapper .preview-btn {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 12px;
  background-color: var(--main-color);
  font-weight: bold;
  text-decoration: none;
  border-radius: 4px;
  font-size: 12px;
  transition: background-color 0.2s;
}
.preview_wrapper .preview-btn:hover {
  background-color: #7a8eda; /* 호버 시 색상 변경 */
  color: #fff;
}
</style>