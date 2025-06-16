<template>
  <div class="card">
    <a
      v-if="item.preview_url"
      :href="item.preview_url"
      class="ribbon-link"
      target="_blank"
      @click.stop
    >
      preview
    </a>

    <div v-if="item.type === 'font' && item.font_cdn" class="preview-container">
      <div
        class="font-preview"
        :style="fontPreviewStyle"
      >
        {{ previewText || 'temp' }}
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
    },
    fontSize: {
      type: Number,
      default: 20
    },
    fontWeight: {
      type: Number,
      default: 400
    },
    textTransform: {
      type: String,
      default: 'none'
    }
  },
  computed: {
    fontPreviewStyle() {
      return {
        fontFamily: this.item.title,
        fontSize: `${this.fontSize}px`,
        fontWeight: this.fontWeight,
        textTransform: this.textTransform
      };
    }
  },
  mounted() {
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
  height: 250px;
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
  position: relative;
  overflow: hidden; 
}

/* [수정] 텍스트 스타일 추가 */
.ribbon-link {
  position: absolute;
  z-index: 1;
  height: 2rem;
  top: 16px;
  right: -8.2rem;
  transform: rotate(36deg);
  width: 150%;
  background: linear-gradient( 90deg, white 10%, #7a8eda 50%);
  text-align: center;
  line-height: 2rem;
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-decoration: none;
  text-transform: uppercase;
}


.card:hover {
  box-shadow: 0 2px 8px rgba(150, 167, 255, 0.2);
}
.card .card_img {
  width: 100%;
  height: 114px;
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
  overflow: hidden;
}
.font-preview {
  text-align: center;
  transition: font-size 0.3s, font-weight 0.3s;
}
.info {
  text-align: center;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  margin-top: auto;
}

.preview_wrapper .preview-btn {
  padding: 4px 12px;
  background-color: var(--main-color);
  font-weight: bold;
  text-decoration: none;
  border-radius: 4px;
  font-size: 12px;
  transition: background-color 0.2s;
}
.preview_wrapper .preview-btn:hover {
  background-color: #7a8eda;
  color: #fff;
}
</style>