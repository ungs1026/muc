<template>
  <div class="list-wrapper">
    <div class="input-container">
      <input
        v-model="previewText"
        type="text"
        placeholder="미리보기 텍스트 입력 / 제목 검색"
      />
    </div>

    <div v-if="hasFontItems" class="font-controls-container">
      <div class="control-group">
        <label>Font Size: {{ fontSize }}px</label>
        <input type="range" v-model="fontSize" min="12" max="72" />
      </div>
      <div class="control-group">
        <label>Font Weight: {{ fontWeight }}</label>
        <input type="range" v-model="fontWeight" min="100" max="900" step="100" />
      </div>
      <div class="control-group buttons">
        <button @click="setTextTransform('uppercase')">Uppercase</button>
        <button @click="setTextTransform('lowercase')">Lowercase</button>
        <button @click="setTextTransform('none')">Reset</button>
      </div>
    </div>

    <div class="list-container">
      <ContentCard
        v-for="item in filteredItems"
        :key="item.idx"
        :item="item"
        :preview-text="previewText"
        :font-size="parseInt(fontSize)"
        :font-weight="parseInt(fontWeight)"
        :text-transform="textTransform"
        @click="$emit('selectItem', item)"
      />
    </div>
  </div>
</template>

<script>
import ContentCard from './ContentCard.vue'

export default {
  name: 'ContentList',
  components: { ContentCard },
  props: {
    items: Array
  },
  data() {
    return {
      previewText: '',   // 입력창 값
      fontSize: 20,        // 폰트 크기
      fontWeight: 400,     // 폰트 굵기
      textTransform: 'none' // 대소문자
    }
  },
  computed: {
    filteredItems() {
      const query = this.previewText.toLowerCase();
      return this.items.filter(item => {
        if (item.type === 'font' && item.font_cdn) {
          return true;
        }
        return item.title.toLowerCase().includes(query);
      });
    },
    // 폰트 아이템이 하나라도 있는지 확인하는 computed
    hasFontItems() {
      return this.items.some(item => item.type === 'font');
    }
  },
  methods: {
    // 대소문자 변경 버튼을 위한 메서드
    setTextTransform(transform) {
      this.textTransform = transform;
    }
  }
}
</script>

<style scoped>
.list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.input-container input {
  width: 50%;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
/* [추가] 폰트 컨트롤러 스타일 */
.font-controls-container {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  background-color: #222;
  padding: 15px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}
.control-group.buttons {
  gap: 5px;
}
.control-group button {
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}
.control-group label {
  white-space: nowrap;
}
.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  width: 100%;
}
</style>