// src/data.js
export const navItems = ['library', 'api', 'css', 'font', 'js', 'gsap'];

export const dataMap = {
  library: [
    { id: 1, title: 'Lodash', desc: '유틸리티 JS 라이브러리' },
    { id: 2, title: 'Axios', desc: 'HTTP 클라이언트' }
  ],
  api: [
    { id: 1, title: 'Fetch API', desc: '브라우저 내장 HTTP' },
    { id: 2, title: 'GraphQL', desc: '쿼리 언어' }
  ],
  css: [
    { id: 1, title: 'Bootstrap', desc: 'CSS 프레임워크' },
    { id: 2, title: 'Tailwind', desc: '유틸리티 퍼스트' }
  ],
  font: [
    { id: 1, title: 'Google Fonts', desc: '웹용 무료 폰트' },
    { id: 2, title: 'Adobe Fonts', desc: '상업용 폰트' }
  ],
  js: [
    { id: 1, title: 'ES6', desc: '모던 JS 스펙' },
    { id: 2, title: 'TypeScript', desc: '정적 타입 JS' }
  ],
  gsap: [
    { id: 1, title: 'TweenMax', desc: '애니메이션 핵심' },
    { id: 2, title: 'ScrollTrigger', desc: '스크롤 애니메이션' }
  ]
};
