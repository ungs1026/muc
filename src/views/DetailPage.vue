<template>
  <div class="detail-page" v-if="item">
    <h2>{{ item.title }}</h2>

    <div class="main_img" style="width: 100%;">
      <img style="filter: drop-shadow(0 0 6px var(--main-color));" :src="item.img" :alt="item.title">
    </div>

    <div class="markdown" v-html="renderMarkdown(item.sub_desc)"></div>

    <div class="markdown" v-html="renderMarkdown(item.context)"></div>

    <button id="goList" @click="goBack">LIST</button>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue' // nextTick 추가
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../supabase'
import hljs from 'highlight.js' // hljs를 named import 대신 default import로 변경

// Highlight.js 테마 CSS 임포트 (만약 Vue CLI/Vite 등으로 번들링한다면)
// 실제 프로젝트 설정에 따라 이 위치나 방식이 다를 수 있습니다.
// CSS는 <style> 태그에 직접 포함하거나, main.js에서 임포트할 수도 있습니다.
import 'highlight.js/styles/atom-one-dark.css'; // 원하는 테마 CSS 선택

export default {
  name: 'DetailPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const category = route.params.category
    const id = Number(route.params.id)
    const item = ref(null)

    async function fetchItem() {
      const { data, error } = await supabase
        .from('library')
        .select('*')
        .eq('idx', id)
        .eq('type', category)
        .single()
      if (error) {
        console.error('Error fetching item:', error)
        item.value = null
      } else {
        item.value = data;
        // 데이터 로드 및 DOM 업데이트 후 하이라이팅 적용
        // nextTick을 사용하여 DOM이 완전히 업데이트된 후에 hljs를 실행
        nextTick(() => {
          hljs.highlightAll();
        });
      }
    }

    onMounted(fetchItem)

    function goBack() {
      router.back()
    }

    // 수동 Markdown → HTML 변환기
    function renderMarkdown(text) {
      if (!text) return ''

      let html = text

      // ```language\nCode\n``` 형식의 코드 블록 처리
      // 이 정규식은 언어 지정(예: ```javascript)도 캡처합니다.
      // 언어 지정이 없는 경우에도 작동합니다.
      html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        // HTML 이스케이프: < > & 등을 HTML 엔티티로 변환하여 코드 내용이 HTML로 파싱되지 않게 함
        const escapedCode = code.replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        // 언어가 지정된 경우 'language-언어명' 클래스 추가
        const langClass = lang ? `language-${lang}` : '';
        return `<pre><code class="${langClass}">${escapedCode}</code></pre>`;
      });

      // 헤더 (h1~h3)
      html = html.replace(/^### (.+)$/gm,     '<h3>$1</h3>')
      html = html.replace(/^## (.+)$/gm,      '<h2>$1</h2>')
      html = html.replace(/^# (.+)$/gm,       '<h1>$1</h1>')

      // 수평선
      html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr>')

      // 블록 인용
      html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

      // 체크박스 목록
      html = html.replace(/^- \[ \] (.+)$/gm, '<li><input type="checkbox" disabled> $1</li>')
      html = html.replace(/^- \[x\] (.+)$/gim, '<li><input type="checkbox" disabled checked> $1</li>')

      // 순서 없는 목록
      html = html.replace(/^(?:[-*+]) (.+)$/gm, '<li>$1</li>')
      // 순서 있는 목록
      html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')

      // 리스트(<ul> 또는 <ol>) 감싸기
      // 이 부분은 수동 파서에서 가장 복잡하고 버그가 많을 수 있습니다.
      // Marked.js 같은 라이브러리를 사용하면 훨씬 견고해집니다.
      html = html
        .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
        .replace(/<ul>\s*<ul>/g, '<ul>')
        .replace(/<\/li>\s*<ul>/g, '</li><ul>')
      html = html
        .replace(/<ul>([\s\S]*?)<\/ul>/g, (m, inner) =>
          inner.match(/^\s*<li>\d+\./)
            ? m.replace(/<ul>/,'<ol>').replace(/<\/ul>/,'</ol>')
            : m
        )

      // 테이블
      html = html.replace(
        /((?:\|.*\|\s*\n)+)\|\s*-+[\s|-]*\|\s*\n((?:\|.*\|\s*\n?)+)/g,
        (_, hdr, body) => {
          const rows = hdr.trim().split('\n').concat(body.trim().split('\n'))
          const th = rows[0].split('|').slice(1,-1)
            .map(c=>`<th>${c.trim()}</th>`).join('')
          const trs = rows.slice(2).map(r=> {
            const cols = r.split('|').slice(1,-1)
            return `<tr>${cols.map(c=>`<td>${c.trim()}</td>`).join('')}</tr>`
          }).join('')
          return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`
        }
      )

      // 볼드·이탤릭·취소선
      html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      html = html.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>')
      html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')
      html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
      html = html.replace(/_([^_]+)_/g, '<em>$1</em>')
      html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>')

      // 링크 및 이미지
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
      html = html.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
        (_, txt, url, title) =>
          `<a href="${url}"${title?` title="${title}"`:''}>${txt}</a>`
      )

      // 단락: 빈 줄 기준으로 <p> 감싸기
      html = html.split(/\n{2,}/).map(block => {
        block = block.trim()
        // 이미 블록요소면 그대로 (코드 블록, 헤더, 리스트 등)
        if (/^<(h[1-6]|ul|ol|li|pre|blockquote|table|img|hr)/.test(block)) return block
        return `<p style="font-size: 0.8rem;">${block.replace(/\n/g,'<br>')}</p>`
      }).join('\n')

      return html
    }

    return {
      item,
      goBack,
      renderMarkdown
    }
  }
}
</script>

<style scoped>

.detail-page {
  position: relative;
  margin: 20px;
  padding: 10px;
  color: white;
  border: 2px solid var(--main-color);
}

.main_img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

/* 마크다운 렌더링 영역 스타일 */
.markdown {
  background: #000;
  color: white;
  padding: 1em;
  border-radius: 4px;
  margin-bottom: 1em;
}

/* 테이블 스타일 */
.markdown table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}
.markdown th,
.markdown td {
  border: 1px solid #ccc;
  padding: 0.5em;
  text-align: left;
}

/* 코드 블록 스타일 - Highlight.js 테마에 의해 오버라이드될 수 있음 */
.markdown pre {
  background: #272822; /* 기본 배경색 (테마가 로드되지 않았거나 다른 스타일) */
  color: #f8f8f2;      /* 기본 글자색 */
  padding: 1em;
  overflow-x: auto;
  border-radius: 4px;
}

/* Highlight.js에 의해 추가되는 .hljs 클래스에 대한 추가 스타일 (선택 사항) */
/* .markdown pre code.hljs {
    padding: 0; // Highlight.js가 자체 패딩을 추가할 수 있으므로, pre에 패딩을 주고 code에서는 제거
    background: none; // Highlight.js가 자체 배경색을 추가할 수 있으므로, 제거
} */

.hljs{
  text-wrap: wrap;
  margin-bottom: 10px;
}


/* 블록인용 스타일 */
.markdown blockquote {
  border-left: 4px solid #ccc;
  padding-left: 1em;
  color: #666;
  margin: 1em 0;
}

/* 리스트 스타일 */
.markdown ul,
.markdown ol {
  margin: 1em 0;
  padding-left: 1.5em;
}

/* 체크박스 스타일 */
.markdown input[disabled] {
  margin-right: 0.5em;
}

#goList {
  position: absolute;
  top: 10px;
  right: 10px;
  padding-block: 4px;
  padding-inline: 10px;
  border-radius: 5px;
  border: none;
  background: var(--main-color);
  color: white;
  font-weight: 700;
}
</style>