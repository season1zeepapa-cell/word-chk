# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

자소서(자기소개서) 글자수 체크 웹 애플리케이션입니다. `profile/` 폴더에 있는 텍스트 파일들을 읽어서 각 파일의 글자수를 카운트하고, 전체 통계를 시각적으로 보여줍니다.

### 기술 스택
- **프론트엔드**: Vanilla JavaScript (ES6+), HTML5, Tailwind CSS (CDN)
- **배포**: Vercel (정적 사이트 호스팅)
- **개발 도구**: Playwright (스크린샷 자동화)

## 프로젝트 구조

```
word-chk/
├── index.html          # 메인 HTML (UI 레이아웃 및 구조)
├── client.js           # 메인 JavaScript (파일 로딩 및 UI 로직)
├── profile/            # 자소서 텍스트 파일들 (.txt)
├── screenshot.js       # Playwright 스크린샷 자동화 스크립트
├── vercel.json         # Vercel 배포 설정
└── .agent-screenshots/ # 자동 생성된 스크린샷 저장 폴더
```

## 핵심 아키텍처

### 파일 로딩 플로우
1. **페이지 로드** (`DOMContentLoaded`) → `loadFiles()` 호출
2. **파일 읽기**: `client.js`의 `profileFiles` 배열에 정의된 파일명을 기반으로 `fetch()` API로 `profile/` 폴더의 `.txt` 파일 로드
3. **데이터 저장**: `filesData` 배열에 파일명, 내용, 글자수 저장
4. **UI 렌더링**: `renderFileList()`로 파일 카드 생성, `updateStats()`로 통계 업데이트

### UI 컴포넌트
- **통계 요약 카드**: 총 파일 개수 및 총 글자수 표시
- **파일 카드**: 각 파일의 이름, 글자수, 내용 미리보기 (클릭 시 모달 표시)
- **모달 창**: 파일 전체 내용 및 글자수 상세 표시 (ESC 키 또는 배경 클릭으로 닫기)

### 중요한 제약사항
- **정적 파일 목록**: `client.js`의 `profileFiles` 배열에 파일명이 하드코딩되어 있음 (동적 디렉토리 스캔 없음)
- **클라이언트 사이드 렌더링**: 서버 없이 순수 클라이언트에서 `fetch()`로 텍스트 파일 로드
- **Vercel 정적 배포**: `@vercel/static` 빌더 사용, 서버 사이드 코드 없음

## 개발 명령어

### 로컬 개발
```bash
# 간단한 로컬 서버 실행 (Python 3)
python3 -m http.server 3001

# 또는 Node.js http-server 사용
npx http-server -p 3001
```

브라우저에서 `http://localhost:3001` 접속

### 스크린샷 생성
```bash
# Playwright를 사용한 자동 스크린샷 (로컬 서버 실행 중이어야 함)
node screenshot.js

# 또는 macOS screencapture 사용
./take-screenshot.sh
```

### 배포
```bash
# Vercel CLI를 통한 배포
vercel --prod

# 또는 Git push로 자동 배포 (Vercel GitHub 연동 시)
git push origin main
```

## 파일 추가/수정 시 주의사항

### profile/ 폴더에 파일 추가 시
1. `profile/` 폴더에 `.txt` 파일 추가
2. `client.js`의 `profileFiles` 배열에 파일명 추가 (예: `'새파일.txt'`)
3. 배열 순서가 화면 표시 순서가 됨

### 스타일 수정 시
- Tailwind CSS CDN 사용 중이므로 `index.html`에서 직접 Tailwind 클래스 수정
- 커스텀 CSS 필요 시 `<style>` 태그 추가 또는 별도 CSS 파일 생성 고려

### 글자수 계산 로직
- 현재 `content.length` 사용 (공백, 줄바꿈 포함)
- 다른 계산 방식 필요 시 `client.js`의 `charCount` 계산 부분 수정

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
