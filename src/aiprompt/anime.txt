# Anime.js API 및 라이브러리 문서

Anime.js는 경량의 강력한 JavaScript 애니메이션 라이브러리입니다. CSS 속성, 개별 CSS 변수, SVG, DOM 속성, JS 객체 등 다양한 요소에 애니메이션을 적용할 수 있습니다.

---

## 1. Anime.js 적용 방법

Anime.js를 프로젝트에 적용하는 방법은 크게 두 가지가 있습니다: CDN 방식과 CLI(npm/yarn) 방식.

### 1.1 CDN 적용 방법

CDN(Content Delivery Network)을 사용하면 HTML 파일에 script 태그 하나만 추가하여 Anime.js를 바로 사용할 수 있습니다. 이는 간단한 테스트나 웹 페이지에 빠르게 적용할 때 유용합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anime.js CDN 예시</title>
    <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>
    <style>
        .box {
            width: 100px;
            height: 100px;
            background-color: dodgerblue;
            margin: 20px;
        }
    </style>
</head>
<body>
    <div class="box"></div>

    <script>
        anime({
            targets: '.box',
            translateX: 250,
            rotate: '1turn',
            backgroundColor: '#FF0000',
            duration: 1000,
            loop: true
        });
    </script>
</body>
</html>
```

### 1.2 CLI (npm/yarn) 적용 방법

현대 JavaScript 프레임워크(Vue, React 등) 기반 프로젝트에서는 npm 또는 yarn과 같은 패키지 매니저를 통해 설치하고 번들링하는 것이 일반적입니다.

#### 1.2.1 설치

```bash
npm install animejs
# 또는
yarn add animejs
```

#### 1.2.2 프로젝트에서 사용

```js
import anime from 'animejs';

anime({
  targets: '.my-element',
  translateX: 100,
  duration: 800
});
```

---

## 2. Anime.js의 핵심 기능 및 API 레퍼런스

Anime.js의 모든 애니메이션은 기본적으로 `anime()` 함수를 호출하여 정의됩니다. 이 함수는 애니메이션의 속성을 정의하는 객체를 인자로 받습니다.

### 2.1 `anime(params)` 함수: 기본 애니메이션 정의

```html
<div class="square red"></div>
<div class="square blue"></div>

<style>
  .square { width: 50px; height: 50px; margin: 10px; background-color: lightgray; }
  .red { background-color: red; }
  .blue { background-color: blue; }
</style>

<script>
  anime({
    targets: '.red',
    translateX: 200,
    rotate: 360,
    duration: 1500,
    easing: 'easeInOutQuad'
  });
  anime({
    targets: '.blue',
    translateY: 100,
    scale: 1.5,
    delay: 500,
    duration: 1000,
    easing: 'easeOutElastic'
  });
</script>
```

#### 파라미터 (params)

| 파라미터 이름     | 타입                                                                           | 필수 여부 | 기본값                | 설명                                                                      |
| ----------- | ---------------------------------------------------------------------------- | ----- | ------------------ | ----------------------------------------------------------------------- |
| `targets`   | `String` \| `HTMLElement` \| `NodeList` \| `Array` \| `Object` \| `Function` | Yes   | —                  | 애니메이션을 적용할 대상입니다. CSS 선택자, DOM 요소, NodeList, JS 객체, 배열 또는 함수가 될 수 있습니다. |
| `duration`  | `Number`                                                                     | No    | `1000`             | 애니메이션 재생 시간(밀리초)입니다.                                                    |
| `delay`     | `Number` \| `Function`                                                       | No    | `0`                | 애니메이션 시작 전 지연 시간(밀리초)입니다.                                               |
| `endDelay`  | `Number` \| `Function`                                                       | No    | `0`                | 애니메이션이 끝난 후 지연 시간(밀리초)입니다.                                              |
| `easing`    | `String` \| `Function`                                                       | No    | `'easeOutElastic'` | 애니메이션의 시간 함수(가속도)입니다. 다양한 이징 함수 문자열을 제공합니다.                             |
| `loop`      | `Boolean` \| `Number`                                                        | No    | `false`            | 애니메이션 반복 여부를 지정합니다. `true`는 무한 반복, 숫자는 지정 횟수만큼 반복합니다.                   |
| `direction` | `String`                                                                     | No    | `'normal'`         | 반복 시 재생 방향을 지정합니다: `normal`, `reverse`, `alternate`.                    |
| `autoplay`  | `Boolean`                                                                    | No    | `true`             | 생성 즉시 자동 재생 여부입니다. `false` 시 `play()` 호출 필요.                            |
| `round`     | `Boolean` \| `Number`                                                        | No    | `false`            | 출력 값을 정수 또는 지정 소수점 자리수로 반올림합니다.                                         |
| `offset`    | `Number` \| `String` \| `Function`                                           | No    | —                  | 타임라인 오프셋을 지정합니다. 상대값, 절대값, 비율 등 지원.                                     |
| 콜백          | `begin`, `update`, `complete`, `loopBegin`, `loopComplete`, `change`         | No    | —                  | 애니메이션의 특정 시점에 호출되는 콜백 함수를 정의할 수 있습니다.                                   |

### 2.2 애니메이션 속성(Properties)

애니메이션 대상의 CSS 또는 DOM 속성, JS 객체 속성 등을 정의하여 애니메이션할 수 있습니다.

#### 2.2.1 CSS 속성 애니메이션

CSS `transform`, `opacity`, `backgroundColor` 등 모든 유효한 CSS 속성을 애니메이션할 수 있습니다.

```html
<div class="css-anim box"></div>
<style>
  .css-anim { width: 80px; height: 80px; background-color: purple; }
</style>
<script>
  anime({
    targets: '.css-anim',
    translateX: 200,
    opacity: [0, 1],
    backgroundColor: '#FFD700',
    borderRadius: ['0%', '50%'],
    duration: 1500,
    easing: 'easeOutSine'
  });
</script>
```

##### 주의사항

* CSS 속성은 카멜 케이스(camelCase)로 작성해야 합니다.
* 단위(px, %, em, vh 등)는 명시적으로 지정해야 합니다. 숫자만 작성하면 px로 처리됩니다.

#### 2.2.2 DOM 속성 애니메이션

innerHTML, width, height 등 DOM 속성을 애니메이션할 수 있습니다.

```html
<div class="counter">0</div>
<script>
  const counter = document.querySelector('.counter');
  anime({ targets: counter, innerHTML: [0, 1000], easing: 'linear', round: 1, duration: 2000 });
</script>
```

#### 2.2.3 JS 객체 속성 애니메이션

JS 객체의 속성 값도 직접 애니메이션할 수 있어 로직 제어에 활용할 수 있습니다.

```js
<script>
  const myObj = { x: 0 };
  anime({ targets: myObj, x: 100, duration: 1000, update: () => console.log(myObj.x) });
</script>
```

#### 2.2.4 SVG 속성 애니메이션

SVG 요소의 `fill`, `stroke`, `points` 등을 애니메이션할 수 있습니다.

```html
<svg width="100" height="100">
  <rect class="svg-rect" x="0" y="0" width="50" height="50" fill="blue" />
</svg>
<script>
  anime({ targets: '.svg-rect', x: 50, y: 50, width: 100, height: 100, fill: 'gold', duration: 1500, easing: 'easeInOutQuad' });
</script>
```

---

### 2.3 애니메이션 컨트롤 메서드

`anime()`가 반환하는 애니메이션 인스턴스를 통해 재생, 일시정지, 재시작, 반전, 탐색 등이 가능합니다.

#### 2.3.1 `anim.play()`

* **설명**: 애니메이션을 재생합니다. `autoplay: false`로 설정했거나, `pause()` 또는 `reverse()` 후 재생할 때 사용합니다.
* **예시**:

  ```html
  <div class="box play-pause"></div>
  <button onclick="playAnim()">Play</button>
  <button onclick="pauseAnim()">Pause</button>
  <style>.play-pause { width: 50px; height: 50px; background-color: green; }</style>
  <script>
    const animInstance = anime({ targets: '.box.play-pause', translateX: 200, autoplay: false, duration: 1000 });
    function playAnim() { animInstance.play(); }
    function pauseAnim() { animInstance.pause(); }
  </script>
  ```

#### 2.3.2 `anim.pause()`

* **설명**: 현재 재생 중인 애니메이션을 일시 정지합니다.

#### 2.3.3 `anim.restart()`

* **설명**: 애니메이션을 처음부터 다시 시작합니다.
* **예시**:

  ```html
  <div class="box restart-anim"></div>
  <button onclick="restartAnim()">Restart</button>
  <style>.restart-anim { width: 50px; height: 50px; background-color: orange; }</style>
  <script>
    const animInstance = anime({ targets: '.box.restart-anim', translateX: 200, duration: 1000, autoplay: false });
    function restartAnim() { animInstance.restart(); }
    animInstance.play();
  </script>
  ```

#### 2.3.4 `anim.reverse()`

* **설명**: 재생 방향을 반대로 전환합니다. 이미 끝난 애니메이션도 역방향으로 재생합니다.

#### 2.3.5 `anim.seek(time)`

* **설명**: 애니메이션의 특정 시간(밀리초)으로 이동합니다.
* **파라미터**: `time` (Number) - 이동할 시간 (ms)

### 2.4 타임라인(Timeline) 기능: 복잡한 애니메이션 시퀀스

* **설명**: `anime.timeline()`으로 여러 애니메이션을 순차 또는 동시 실행합니다.
* **예시**:

  ```html
  <div class="timeline-box box1"></div>
  <div class="timeline-box box2"></div>
  <div class="timeline-box box3"></div>
  <script>
    const timeline = anime.timeline({ easing: 'easeOutExpo', duration: 750, loop: true });
    timeline
      .add({ targets: '.box1', translateX: 100, rotate: 180 })
      .add({ targets: '.box2', translateX: 100, scale: 1.2, offset: '-=500' })
      .add({ targets: '.box3', translateX: 100, rotate: -180, scale: 0.8, offset: '-=250' });
  </script>
  ```

#### `anime.timeline(params)` 파라미터

타임라인 전체의 `duration`, `delay`, `easing`, `loop`, `direction`, `autoplay`, 콜백 함수 등을 설정합니다.

#### `timeline.add(params)` 파라미터

개별 애니메이션을 추가하며 `offset`으로 시작 위치를 조절합니다.

---

### 2.5 헬퍼 함수

* **`anime.random(min, max)`**: 지정 범위 내 무작위 정수 반환
* **`anime.set(targets, props)`**: 즉시 속성 설정
* **`anime.get(target, prop)`**: 속성 값 조회

---

### 2.6 애니메이션 상태 관리

* **`anime.play()`**: 모든 일시정지된 애니메이션 재생
* **`anime.pause()`**: 모든 재생 중인 애니메이션 일시정지
* **`anime.restart()`**: 모든 애니메이션 재시작
* **`anime.remove(targets)`**: 대상의 모든 애니메이션 제거

---

### 2.7 애니메이션 속성 값 정의 방식

* **From/To**: `[from, to]`
* **Keyframes**: `[{ value, duration, delay, easing }, ...]`
* **Functions**: `(el, i, total) => value`

---

### 2.8 이징(Easing)

다양한 이징 제공:

* **선형**: `linear`
* **Quad**: `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
* **Elastic**, **Bounce**, **Back** 등

---

### 2.9 콜백(Callbacks)

* **`begin`**, **`update`**, **`complete`**, **`loopBegin`**, **`loopComplete`**, **`change`** 지원

---

### 2.10 `anime.stagger(value, params)`: 요소 간 지연 적용

```js
anime({ targets: '.box', translateX: 200, delay: anime.stagger(100, { start: 0, direction: 'normal' }), loop: true });
```

---

### 2.11 `anime.setDashoffset(target)`: SVG Dashoffset 초기화

```js
const path = document.querySelector('path');
anime.setDashoffset(path);
anime({ targets: path, strokeDashoffset: [anime.setDashoffset, 0], easing: 'easeInOutSine', duration: 1500, loop: true });
```

---

### 2.12 `anime.remove(targets)`

```js
anime.remove('.box');
```

---

## 3. 자주 묻는 질문 (FAQ)

**Q**: 애니메이션이 재생되지 않아요.

* `targets` 값 확인
* `autoplay` 설정 확인
* CSS 속성 이름 카멜 케이스 확인

**Q**: 속성 값에 단위를 어떻게 지정하나요?

* 숫자만 입력 시 px로 처리
* 문자열로 `%`, `em`, `vh` 등 단위 포함

**Q**: 여러 요소를 개별적으로 애니메이션하려면?

* `delay` 속성에 함수 또는 `anime.stagger()` 사용

---

Anime.js를 통해 다양한 애니메이션을 쉽고 강력하게 구현해 보세요!
