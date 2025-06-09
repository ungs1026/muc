<!-- src/views/HomeView.vue -->
<template>
  <ContentList
    :items="items"
    @selectItem="onSelectItem"
  />
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ContentList from '../components/ContentList.vue'
import { supabase } from '../supabase'

export default {
  name: 'HomeView',
  components: { ContentList },
  props: {
    category: {
      type: String,
      default: 'library'
    }
  },
  setup(props) {
    const router = useRouter()
    const items = ref([])

    async function fetchItems(category) {
      let query = supabase
        .from('library')
        .select('*')
        .order('idx', { ascending: true })

      // category에 따라 type 필터 적용
      if (category && category !== 'all') {
        query = query.eq('type', category)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error fetching items:', error)
        items.value = []
      } else {
        items.value = data
      }
    }

    onMounted(() => {
      fetchItems(props.category)
    })

    watch(
      () => props.category,
      (newCat) => {
        fetchItems(newCat)
      }
    )

    function onSelectItem(item) {
      router.push({
        name: 'Detail',
        params: { category: props.category, id: item.idx }
      })
    }

    return {
      items,
      onSelectItem
    }
  }
}
</script>
