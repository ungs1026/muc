<template>
  <div class="list-wrapper">
    <!-- 리스트 상단 중앙에 input창 (미리보기+검색 용도) -->
    <div class="input-container">
      <input
        v-model="previewText"
        type="text"
        placeholder="미리보기 텍스트 입력 / 제목 검색"
      />
    </div>

    <div class="list-container">
      <ContentCard
        v-for="item in filteredItems"
        :key="item.idx"
        :item="item"
        :preview-text="previewText"
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
      previewText: ''  // 입력창 값
    }
  },
  computed: {
    filteredItems() {
      // font 카테고리는 항상 보여주고,
      // 그 외는 title에 previewText가 포함된 경우에만 보여줌 (대소문자 구분 없이)
      const query = this.previewText.toLowerCase();
      return this.items.filter(item => {
        if (item.type === 'font' && item.font_cdn) {
          return true;
        }
        return item.title.toLowerCase().includes(query);
      });
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
.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  width: 100%;
}
</style>
