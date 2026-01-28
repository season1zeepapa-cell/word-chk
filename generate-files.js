// ========================================
// 📂 profile 폴더 스캔 및 files.json 생성 스크립트
// ========================================
// 설명: 이 스크립트는 profile 폴더의 모든 .txt 파일을 찾아서
//       files.json 파일로 저장합니다.
// 실행 시점: 배포 전 빌드 시 (npm run build)

const fs = require('fs');
const path = require('path');

// ========================================
// 🎯 메인 로직
// ========================================

try {
    // 1단계: profile 폴더 경로 만들기
    // __dirname: 현재 스크립트가 있는 폴더 경로
    // path.join: 경로를 안전하게 합쳐주는 함수
    const profileDir = path.join(__dirname, 'profile');

    console.log('📂 profile 폴더 스캔 시작:', profileDir);

    // 2단계: profile 폴더에 있는 모든 파일 읽기
    // fs.readdirSync: 폴더의 모든 파일 이름을 배열로 가져옴
    const allFiles = fs.readdirSync(profileDir);
    console.log('📋 발견된 모든 파일:', allFiles);

    // 3단계: .txt 파일만 필터링하고 알파벳순으로 정렬
    // filter: 조건에 맞는 것만 남기는 함수
    // sort: 알파벳순으로 정렬하는 함수
    const txtFiles = allFiles
        .filter(file => {
            // .txt로 끝나는 파일만 선택
            return file.endsWith('.txt');
        })
        .sort(); // 가나다순 정렬 (한글도 정렬됨!)

    console.log(`✅ ${txtFiles.length}개의 .txt 파일 발견:`, txtFiles);

    // 4단계: files.json 파일로 저장
    // JSON.stringify: JavaScript 배열을 JSON 문자열로 변환
    //   - 변경: 배열이 아닌 객체로 변경 (타임스탬프 포함)
    //   - files: 파일 목록 배열
    //   - lastModified: 마지막 수정 시간 (Unix timestamp, 밀리초)
    //   - null: 특별한 설정 없음
    //   - 2: 들여쓰기 2칸 (보기 좋게 정리)
    const jsonContent = JSON.stringify({
        files: txtFiles,
        lastModified: Date.now() // 현재 시간을 밀리초로 저장
    }, null, 2);

    // fs.writeFileSync: 파일에 내용 쓰기
    fs.writeFileSync('files.json', jsonContent);

    console.log('💾 files.json 생성 완료!');
    console.log('');
    console.log('생성된 파일 내용:');
    console.log(jsonContent);

} catch (error) {
    // 오류가 발생하면 여기로 옵니다
    console.error('❌ 오류 발생:', error.message);

    // 프로세스 종료 (오류 코드 1 = 실패)
    // 이렇게 하면 빌드가 실패했다는 것을 알 수 있어요
    process.exit(1);
}
