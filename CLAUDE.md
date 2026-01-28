# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

자소서(자기소개서) 글자수 체크 웹 애플리케이션입니다. `profile/` 폴더에 있는 텍스트 파일들을 읽어서 각 파일의 글자수를 카운트하고, 전체 통계를 시각적으로 보여줍니다.

### 기술 스택
- **프론트엔드**: Vanilla JavaScript (ES6+), HTML5, Tailwind CSS (CDN)
- **빌드**: Node.js 스크립트 (파일 목록 자동 생성)
- **배포**: Vercel (정적 사이트 호스팅)
- **개발 도구**: Nodemon (파일 감시), Playwright (스크린샷 자동화)

## 핵심 아키텍처

### 배포 워크플로우

**Git → Vercel 자동 배포:**
```
개발자가 코드 변경
  ↓
git commit & push origin main
  ↓
GitHub 웹훅이 Vercel에 알림
  ↓
Vercel이 npm run build 실행
  ↓
files.json 자동 생성 (profile/*.txt 스캔)
  ↓
정적 사이트 배포
  ↓
https://word-chk.vercel.app 업데이트 완료!
```

**브랜치 전략:**
- `main`: Production 배포 (word-chk.vercel.app)
- PR: Preview 배포 자동 생성 (고유 URL)

### 빌드 시스템 (중요!)

이 프로젝트는 **빌드 타임에 files.json을 자동 생성**합니다:

1. **`npm run build`** → `generate-files.js` 실행
2. `profile/` 폴더의 모든 `.txt` 파일을 스캔
3. 파일명을 가나다순으로 정렬하여 `files.json` 생성
4. 클라이언트가 `files.json`을 로드하여 파일 목록 표시

**중요:** Vercel 배포 시 `buildCommand: "npm run build"`가 반드시 실행되어야 합니다.

### 파일 로딩 플로우

```
페이지 로드
  ↓
loadFiles() 호출
  ↓
files.json 로드 (빌드 시 생성된 파일 목록)
  ↓
각 .txt 파일을 fetch()로 로드
  ↓
filesData 배열에 저장 (파일명, 내용, 글자수)
  ↓
renderFileList() - UI 렌더링
  ↓
updateStats() - 통계 업데이트 (총/평균/최대/최소)
```

### UI 컴포넌트

- **헤더**: 제목 + 새로고침 버튼
- **통계 카드**: 총 파일, 총 글자수, 평균, 최대, 최소
- **파일 카드**: 각 파일의 이름, 글자수, 내용 미리보기 (클릭 시 모달)
- **모달**: 파일 전체 내용 표시 (ESC 키 또는 배경 클릭으로 닫기)
- **NEW 배지**: localStorage를 사용하여 새 파일 표시
- **토스트 메시지**: 새로고침 완료 시 알림

### 주요 함수 (client.js)

- `loadFiles()`: files.json 및 .txt 파일 로드
- `renderFileList()`: 파일 카드 UI 생성
- `updateStats()`: 전체 통계 계산 및 표시
- `updateAdvancedStats()`: 평균/최대/최소 계산
- `refreshFiles()`: 새로고침 버튼 동작
- `checkFileStatus()`: NEW 배지 표시 로직 (localStorage 기반)
- `showFileContent()`: 모달 표시
- `showToast()`: 알림 메시지 표시

## 개발 명령어

### 빌드
```bash
# profile 폴더 스캔 → files.json 생성
npm run build
```

**언제 실행?**
- profile 폴더에 파일을 추가/삭제/이름 변경 후
- Vercel 배포 시 자동 실행됨

### 개발 서버
```bash
# 통합 개발 환경 시작 (권장)
npm run dev
```

**동작:**
1. Python 웹 서버 시작 (포트 3001)
2. Nodemon으로 `profile/` 폴더 감시
3. `.txt` 파일 변경 시 자동으로 `npm run build` 실행
4. 브라우저를 수동으로 새로고침 (F5)

**종료:** `Ctrl+C`

**대안 (수동):**
```bash
# 간단한 로컬 서버만 실행
python3 -m http.server 3001
# 또는
npx http-server -p 3001
```

브라우저에서 `http://localhost:3001` 접속

### 배포

**프로덕션 URL:** https://word-chk.vercel.app

```bash
# Git push → Vercel 자동 배포 (GitHub 연동 완료)
git push origin main
```

**Vercel 빌드 설정 (필수):**
- Build Command: `npm run build` ✅
- Output Directory: `.` (루트) ✅
- Install Command: `npm install` ✅
- Framework Preset: `Other`
- **Override 활성화 필수!**

**⚠️ 중요: Vercel Git Integration 설정 확인**
- Settings → Git → Connected Git Repository: `season1zeepapa-cell/word-chk`
- Production Branch: `main`
- Ignored Build Step: 비활성화 (빌드가 항상 실행되어야 함)
- Deploy Hooks: PR 생성 시 Preview 배포 자동 생성

## 파일 추가/수정 워크플로우

### profile/ 폴더에 파일 추가

```bash
# 1. 새 .txt 파일 추가
echo "내용..." > profile/새파일.txt

# 2. 빌드 실행 (files.json 업데이트)
npm run build

# 3. 브라우저 새로고침 (F5)
```

**자동 감시 사용 시 (npm run dev):**
```bash
# 1. 새 .txt 파일 추가
echo "내용..." > profile/새파일.txt

# 2. files.json이 자동으로 업데이트됨
# 3. 브라우저 새로고침 (F5)
```

### UI/UX 수정

- **스타일**: Tailwind CSS CDN 사용 (`index.html`에서 클래스 수정)
- **커스텀 CSS**: `<style>` 태그에 추가 (토스트 애니메이션 참고)
- **JavaScript 로직**: `client.js` 수정

### 글자수 계산 로직

현재: `content.length` (공백, 줄바꿈 포함)

변경하려면: `client.js`의 `loadFiles()` 함수에서 `charCount` 계산 부분 수정

## 중요한 제약사항

### 동적 파일 목록
- ❌ 더 이상 `client.js`에 파일명 하드코딩 안 함
- ✅ `files.json`을 빌드 시 자동 생성
- ✅ 파일 추가/삭제 시 `npm run build`만 실행하면 됨

### 클라이언트 사이드 렌더링
- 순수 클라이언트에서 `fetch()`로 파일 로드
- 서버 사이드 코드 없음

### Vercel 정적 배포
- `@vercel/static` 빌더 사용
- `buildCommand: "npm run build"`가 필수
- `files.json`이 gitignore에 있지만 Git에 추적됨 (과거 커밋 때문)

## 코드 스타일

### JavaScript
- 초보자를 위한 상세한 한글 주석 포함
- 함수마다 구분선(`========`)과 이모지로 섹션 구분
- 변수명/함수명은 영어, 주석은 한국어

### HTML
- Tailwind CSS 클래스마다 한글 주석으로 역할 설명
- 시맨틱 HTML 태그 사용 (`<header>`, `<section>` 등)

### 커밋 메시지
- 한국어로 작성
- 형식: "기능/수정 내용 간략 설명"
- 예: "자소서 글자수 체크 앱 기능 개선 및 버그 수정"

## 문제 해결

### 파일 목록이 표시되지 않을 때
1. `files.json`이 생성되었는지 확인: `cat files.json`
2. `npm run build` 실행
3. 브라우저 강력 새로고침 (Cmd+Shift+R 또는 Ctrl+Shift+R)

### Vercel 배포에 최신 코드가 반영되지 않을 때

**자동 배포가 작동하지 않는 경우:**
1. Vercel Settings → Git 에서 Git Integration 연결 확인
2. GitHub 저장소: `season1zeepapa-cell/word-chk` 연결 확인
3. Production Branch: `main` 설정 확인
4. Ignored Build Step: 비활성화 확인

**수동 재배포:**
1. Vercel 대시보드 → Deployments
2. 최신 배포 → ⋮ 메뉴 → Redeploy
3. **중요:** "Use existing Build Cache" 체크 해제
4. 빌드 로그에서 `npm run build` 실행 확인
5. 빌드 시간이 0ms가 아닌지 확인 (0ms = 빌드 미실행)

### npm run dev가 작동하지 않을 때
- `npm install` 실행 (nodemon 설치)
- Python 3가 설치되어 있는지 확인
- 포트 3001이 이미 사용 중인지 확인: `lsof -ti:3001`

## 프로젝트 구조

```
word-chk/
├── index.html          # 메인 HTML (UI 레이아웃)
├── client.js           # 메인 JavaScript (파일 로딩 및 UI 로직)
├── generate-files.js   # 빌드 스크립트 (files.json 생성)
├── watch.js            # 개발 서버 스크립트 (파일 감시 + 웹 서버)
├── files.json          # 빌드 시 자동 생성 (파일 목록)
├── profile/            # 자소서 텍스트 파일들 (.txt)
├── package.json        # npm 설정 및 스크립트
├── vercel.json         # Vercel 배포 설정
└── .gitignore          # Git 무시 파일 (files.json 포함)
```
