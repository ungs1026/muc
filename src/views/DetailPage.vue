<template>
  <div class="detail-page" v-if="item">
    <a
      v-if="item.preview_url && windowWidth >= 1300"
      :href="item.preview_url"
      target="_blank"
      class="preview-btn-fixed"
    >
      PREVIEW
    </a>

    <div class="top-right-controls">
      <a
        v-if="item.preview_url && windowWidth < 1300"
        :href="item.preview_url"
        target="_blank"
        class="preview-btn-inline"
        @click.stop
      >
        PREVIEW
      </a>
      <button id="goList" @click.stop="goBack">LIST</button>
    </div>
    
    <h2>{{ item.title }}</h2>

    <div class="main_img" style="width: 100%;">
      <img style="filter: drop-shadow(0 0 6px var(--main-color));" :src="item.img" :alt="item.title">
    </div>

    <div class="markdown" v-html="renderMarkdown(item.sub_desc)"></div>

    <div class="markdown" v-html="renderMarkdown(item.context)"></div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>

  <button class="scroll-to-top-btn" @click="scrollToTop">▲</button>
</template>

<script>
import { ref, onMounted, nextTick, onUnmounted } from 'vue' // onUnmounted 추가
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../supabase'
import hljs from 'highlight.js'

import 'highlight.js/styles/atom-one-dark.css';

export default {
  name: 'DetailPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const category = route.params.category
    const id = Number(route.params.id)
    const item = ref(null)
    const windowWidth = ref(window.innerWidth) // 창 너비를 저장할 ref

    // 창 크기 변경 감지 핸들러
    const handleResize = () => {
      windowWidth.value = window.innerWidth
    }

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
        nextTick(() => {
          hljs.highlightAll();
        });
      }
    }

    onMounted(() => {
      fetchItem();
      // resize 이벤트 리스너 추가
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
        // 컴포넌트가 사라질 때 이벤트 리스너 제거
        window.removeEventListener('resize', handleResize);
    });

    function goBack() {
      router.back()
    }

    // 최상단으로 스크롤하는 함수
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleCopyClick(event) {
      const target = event.target;
      if (target.classList.contains('copy-button')) {
        const pre = target.nextElementSibling;
        if (pre && pre.tagName === 'PRE') {
          const code = pre.innerText;
          try {
            await navigator.clipboard.writeText(code);
            target.textContent = 'Copied!';
            setTimeout(() => {
              target.textContent = 'Copy';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy text: ', err);
            target.textContent = 'Error';
            setTimeout(() => {
              target.textContent = 'Copy';
            }, 2000);
          }
        }
      }
    }

    function renderMarkdown(text) {
      if (!text) return ''

      let html = text

      html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const langClass = lang ? `language-${lang}` : '';
        return `<div class="code-block-wrapper">
                  <button class="copy-button">Copy</button>
                  <pre><code class="${langClass}">${escapedCode.trim()}</code></pre>
                </div>`;
      });

      // 헤더 (h1~h3)
      html = html.replace(/^#### (.+)$/gm,     '<h4>$1</h4>')
      html = html.replace(/^### (.+)$/gm,      '<h3>$1</h3>')
      html = html.replace(/^## (.+)$/gm,       '<h2>$1</h2>')
      html = html.replace(/^# (.+)$/gm,        '<h1>$1</h1>')

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
        if (/^<(h[1-6]|ul|ol|li|pre|blockquote|table|img|hr|div)/.test(block)) return block
        return `<p style="font-size: 1rem;">${block.replace(/\n/g,'<br>')}</p>`
      }).join('\n')

      return html
    }

    return {
      item,
      windowWidth, // 템플릿에서 사용할 수 있도록 반환
      goBack,
      scrollToTop, // 템플릿에서 사용할 수 있도록 반환
      renderMarkdown,
      handleCopyClick
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

.main_img img {
  width: 40%;
}

.markdown {
  background: #000;
  color: white;
  padding: 1em;
  border-radius: 4px;
  margin-bottom: 1em;
}

.markdown :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}
.markdown :deep(th),
.markdown :deep(td) {
  border: 1px solid #ccc;
  padding: 0.5em;
  text-align: left;
}

.markdown :deep(.code-block-wrapper) {
  position: relative;
  margin: 1em 0;
}

.markdown :deep(.copy-button) {
  position: absolute;
  top: 0.8em;
  right: 0.8em;
  background-color: #444;
  color: white;
  border: 1px solid #666;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.8rem;
  z-index: 1;
  transition: background-color 0.2s;
}

.markdown :deep(.copy-button:hover) {
  background-color: #555;
}

.markdown :deep(pre) {
  background: #272822;
  color: #f8f8f2;
  padding: 1em;
  padding-top: 3em;
  overflow-x: auto;
  border-radius: 4px;
  margin: 0;
}

.markdown :deep(.hljs){
  white-space: pre-wrap;
  margin-bottom: 10px;
}

.markdown :deep(blockquote) {
  border-left: 4px solid #ccc;
  padding-left: 1em;
  color: #aaa;
  margin: 1em 0;
}

.markdown :deep(ul),
.markdown :deep(ol) {
  margin: 1em 0;
  padding-left: 1.5em;
}

.markdown :deep(input[disabled]) {
  margin-right: 0.5em;
}

/* --- [수정 및 추가된 스타일] --- */

/* 우측 상단 컨트롤 버튼 컨테이너 */
.top-right-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 10;
}

/* 기존 LIST 버튼 스타일 수정 */
#goList {
  position: static; /* position:absolute 제거 */
  padding-block: 4px;
  padding-inline: 10px;
  border-radius: 5px;
  border: none;
  background: var(--main-color);
  color: white;
  font-weight: 700;
}

/* 1300px 미만일 때의 PREVIEW 버튼 */
.preview-btn-inline {
  padding: 4px 10px;
  border-radius: 5px;
  background: transparent;
  border: 1px solid var(--main-color);
  color: var(--main-color);
  font-weight: 700;
  text-decoration: none;
  font-size: 14px;
}

/* 1300px 이상일 때의 고정 PREVIEW 버튼 */
.preview-btn-fixed {
  position: fixed;
  top: 100px;
  right: 60px;
  padding: 10px 20px;
  background: var(--main-color);
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  border-radius: 5px;
  z-index: 1010;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

/* 최상단 이동 버튼 */
.scroll-to-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: var(--main-color);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  opacity: 0.8;
  transition: opacity 0.2s;
}
.scroll-to-top-btn:hover {
    opacity: 1;
}
</style>