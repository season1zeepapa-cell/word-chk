# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

자기소개서(자소서) 파일의 글자수를 체크하는 간단한 웹 애플리케이션입니다. `profile/` 폴더에 있는 `.txt` 파일들을 자동으로 읽어서 글자수를 계산하고 통계를 보여줍니다.

## 개발 워크플로우

### 로컬 개발 시작하기

```bash
# 개발 서버 실행 (파일 감시 + 웹 서버)
npm run dev
```

이 명령어는 다음 두 가지를 동시에 실행합니다:
- Python 웹 서버 (포트 3001)
- Nodemon을 통한 `profile/` 폴더 감시

브라우저에서 http://localhost:3001 으로 접속하면 앱을 확인할 수 있습니다.

### 빌드 프로세스

```bash
# profile 폴더를 스캔하여 files.json 생성
npm run build
```

**중요**: `profile/` 폴더에 `.txt` 파일을 추가/삭제한 후에는 반드시 빌드를 실행해야 합니다.
- `generate-files.js`가 `profile/` 폴더를 스캔
- `.txt` 파일 목록을 `files.json`에 저장 (가나다순 정렬)
- 클라이언트 측 JavaScript가 이 파일을 읽어서 파일 목록을 표시

### 자동 새로고침

개발 모드(`npm run dev`)에서는:
- `profile/` 폴더의 `.txt` 파일이 변경되면 자동으로 `files.json` 재생성
- **브라우저가 5초마다 변경사항을 체크하여 자동으로 새로고침** ✨
- 변경 감지 시 "파일 목록이 업데이트되었습니다!" 알림 표시
- 수동 새로고침 버튼도 여전히 사용 가능

## 아키텍처

### 파일 구조

```
/
├── index.html              # 메인 HTML (Tailwind CSS 사용)
├── client.js               # 프론트엔드 로직 (Vanilla JavaScript)
├── generate-files.js       # 빌드 스크립트 (files.json 생성)
├── watch.js               # 개발 서버 + 파일 감시 통합 스크립트
├── screenshot.js          # Playwright를 이용한 스크린샷 자동화
├── files.json            # 빌드 결과물 (Git에 포함됨)
└── profile/              # 자소서 파일들 (.txt)
    ├── 김철수.txt
    ├── 이영희.txt
    └── ...
```

### 데이터 흐름

1. **빌드 시**: `generate-files.js` → `profile/` 스캔 → `files.json` 생성 (타임스탬프 포함)
2. **런타임**: `client.js` → `files.json` 로드 → 각 파일 fetch → 화면 렌더링
3. **통계 계산**: 총 파일 개수, 총 글자수, 평균/최대/최소 글자수
4. **🆕 자동 갱신**: 5초마다 `files.json` 타임스탬프 체크 → 변경 감지 시 자동 새로고침

### 주요 컴포넌트

#### `client.js`의 핵심 함수들

- `loadFiles()`: files.json에서 파일 목록을 가져온 후 각 파일을 fetch로 읽어옴
- `renderFileList()`: 파일 카드를 동적으로 생성하여 화면에 표시
- `updateStats()`: 통계 정보 계산 및 표시 (총 파일, 총 글자수 등)
- `updateAdvancedStats()`: 평균/최대/최소 글자수 계산
- `showFileContent()`: 파일 클릭 시 모달로 전체 내용 표시
- `checkFileStatus()`: localStorage를 사용하여 새로운 파일 여부 확인 (NEW 배지)
- `refreshFiles()`: 새로고침 버튼 클릭 시 파일 목록 다시 로드
- **🆕 `checkForUpdates()`**: files.json의 타임스탬프를 체크하여 변경 감지
- **🆕 `startAutoRefresh()`**: 5초마다 자동으로 변경사항 체크 시작

#### `generate-files.js`

- Node.js의 `fs` 모듈로 `profile/` 폴더 읽기
- `.txt` 파일만 필터링하고 알파벳순(한글 가나다순) 정렬
- **🆕 타임스탬프를 포함한 JSON 객체로 `files.json`에 저장**
  ```json
  {
    "files": ["파일1.txt", "파일2.txt"],
    "lastModified": 1706428800000
  }
  ```

#### `watch.js`

- `spawn`으로 Python HTTP 서버와 Nodemon을 동시 실행
- Nodemon이 `profile/*.txt` 변경 감지 시 `generate-files.js` 자동 실행
- `SIGINT` 시그널 처리로 깔끔한 종료

## 기술 스택

- **프론트엔드**: Vanilla JavaScript (ES6+), HTML5
- **스타일링**: Tailwind CSS (CDN)
- **빌드**: Node.js (fs 모듈)
- **개발 도구**:
  - Nodemon (파일 감시)
  - Python HTTP Server (정적 파일 서빙)
  - Playwright (스크린샷 자동화)

## 코딩 스타일

- **주석**: 모든 JavaScript 파일에 초보자 친화적인 한글 주석 작성
- **변수/함수명**: 영어 (camelCase)
- **커밋 메시지**: 한국어
- **섹션 구분**: 주석으로 명확한 섹션 구분 (`// ========================================`)

## 배포

이 프로젝트는 정적 웹사이트로 배포 가능합니다:
- Vercel, Netlify, GitHub Pages 등 정적 호스팅 플랫폼 사용 가능
- 빌드 커맨드: `npm run build`
- 배포 전 `files.json`이 최신 상태인지 확인 필요

## 로컬 스토리지 사용

`client.js`는 브라우저의 localStorage를 사용하여:
- 마지막 방문 시간 저장 (`lastVisit`)
- 이전 파일 목록 저장 (`fileList`)
- 새로운 파일에 NEW 배지 표시


<!-- Vercel 자동 배포 테스트: 새 프로젝트 연결 완료 -->