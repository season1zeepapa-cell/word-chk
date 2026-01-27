// ========================================
// 📚 전역 변수 선언
// ========================================
// 파일 목록은 files.json에서 동적으로 가져옵니다 (빌드 시 자동 생성)
// 설명: profile 폴더의 모든 .txt 파일 목록이 files.json에 저장되어 있어요
let profileFiles = [];

// 각 파일의 내용을 저장할 배열 (나중에 파일을 읽어서 채울 예정)
let filesData = [];

// ========================================
// 🚀 페이지가 로드되면 자동으로 실행되는 함수
// ========================================
// 설명: 웹 페이지가 완전히 로드된 후에 파일들을 읽어옵니다
document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드 완료! 파일을 불러옵니다...');
    loadFiles();
});

// ========================================
// 📂 파일들을 불러오는 메인 함수
// ========================================
// 설명: files.json에서 파일 목록을 가져온 후, 각 파일을 읽어서 화면에 표시합니다
async function loadFiles() {
    // 1단계: 파일 목록을 담을 HTML 영역을 찾습니다
    const fileListElement = document.getElementById('fileList');

    // 2단계: 로딩 표시를 제거합니다
    fileListElement.innerHTML = '';

    // 🆕 3단계: files.json에서 파일 목록 가져오기
    // 설명: 빌드 시 자동으로 생성된 files.json 파일을 읽어옵니다
    try {
        console.log('📂 files.json 로딩 중...');
        const filesResponse = await fetch('files.json');

        // JSON 파일의 내용을 JavaScript 배열로 변환
        profileFiles = await filesResponse.json();

        console.log('✅ 파일 목록 로드 완료:', profileFiles);
        console.log(`📊 총 ${profileFiles.length}개 파일 발견`);

    } catch (error) {
        // files.json을 읽지 못하면 오류 메시지 표시
        console.error('❌ files.json 로드 실패:', error);

        // 화면에 오류 메시지 표시
        fileListElement.innerHTML = `
            <div class="text-center py-12 bg-white rounded-xl shadow-md">
                <p class="text-red-500 text-lg mb-2">파일 목록을 불러올 수 없습니다 😢</p>
                <p class="text-gray-600 text-sm">files.json 파일이 없거나 읽을 수 없습니다.</p>
                <p class="text-gray-500 text-xs mt-2">힌트: npm run build를 실행해보세요!</p>
            </div>
        `;
        return; // 더 이상 진행하지 않고 함수 종료
    }

    // 4단계: 각 파일을 순서대로 읽습니다
    for (const fileName of profileFiles) {
        try {
            // 파일 경로 만들기 (예: profile/자기소개서1.txt)
            const filePath = `profile/${fileName}`;

            console.log(`📄 ${fileName} 로딩 중...`);

            // 파일 내용 읽어오기 (서버에서 가져옴)
            const response = await fetch(filePath);
            const content = await response.text();

            // 글자수 계산 (공백, 줄바꿈 모두 포함)
            const charCount = content.length;

            // 파일 정보를 저장
            filesData.push({
                name: fileName,
                content: content,
                charCount: charCount
            });

            console.log(`✅ ${fileName} 로드 완료: ${charCount}자`);

        } catch (error) {
            // 파일을 읽는 중 오류가 발생하면 콘솔에 표시
            console.error(`❌ ${fileName} 로드 실패:`, error);
        }
    }

    // 5단계: 모든 파일을 읽은 후 화면에 표시
    console.log('🎨 UI 렌더링 시작...');
    renderFileList();
    updateStats();
    console.log('🎉 모든 파일 로딩 완료!');
}

// ========================================
// 🎨 파일 목록을 화면에 그리는 함수
// ========================================
// 설명: filesData 배열의 정보를 예쁜 카드 형태로 만들어 화면에 보여줍니다
function renderFileList() {
    const fileListElement = document.getElementById('fileList');

    // 파일이 없으면 안내 메시지 표시
    if (filesData.length === 0) {
        fileListElement.innerHTML = `
            <div class="text-center py-12 bg-white rounded-xl shadow-md">
                <p class="text-gray-500 text-lg">파일이 없습니다 📭</p>
            </div>
        `;
        return;
    }

    // 각 파일마다 카드를 만들어서 추가합니다
    fileListElement.innerHTML = filesData.map((file, index) => `
        <!-- 파일 카드: 클릭하면 상세 내용을 볼 수 있습니다 -->
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer transform hover:scale-105 transition-transform"
             onclick="showFileContent(${index})">

            <!-- 카드 상단: 파일 이름과 아이콘 -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <!-- 파일 아이콘 -->
                    <div class="bg-indigo-100 rounded-full p-3">
                        <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <!-- 파일 이름 -->
                    <h3 class="text-xl font-semibold text-gray-800">${file.name}</h3>
                </div>

                <!-- 화살표 아이콘 (클릭 가능함을 표시) -->
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>

            <!-- 카드 하단: 글자수 정보 -->
            <div class="flex items-center space-x-2">
                <span class="text-gray-600">글자수:</span>
                <span class="text-2xl font-bold text-purple-600">${file.charCount.toLocaleString()}</span>
                <span class="text-gray-600">자</span>
            </div>

            <!-- 내용 미리보기 (첫 50자만) -->
            <div class="mt-4 pt-4 border-t border-gray-100">
                <p class="text-gray-500 text-sm line-clamp-2">
                    ${file.content.substring(0, 50)}${file.content.length > 50 ? '...' : ''}
                </p>
            </div>
        </div>
    `).join('');
}

// ========================================
// 📊 통계 정보를 업데이트하는 함수
// ========================================
// 설명: 상단의 "총 파일 개수"와 "총 글자수"를 계산해서 표시합니다
function updateStats() {
    // 총 파일 개수 계산
    const totalFiles = filesData.length;

    // 총 글자수 계산 (모든 파일의 글자수를 합침)
    const totalChars = filesData.reduce((sum, file) => sum + file.charCount, 0);

    // HTML 요소를 찾아서 값을 업데이트
    document.getElementById('totalFiles').textContent = totalFiles;
    document.getElementById('totalChars').textContent = totalChars.toLocaleString();
}

// ========================================
// 👁️ 파일 상세 내용을 모달로 보여주는 함수
// ========================================
// 설명: 파일 카드를 클릭했을 때 전체 내용을 팝업 창에 표시합니다
function showFileContent(index) {
    // 클릭한 파일의 정보 가져오기
    const file = filesData[index];

    // 모달 창의 각 부분에 파일 정보 채우기
    document.getElementById('modalFileName').textContent = file.name;
    document.getElementById('modalFileContent').textContent = file.content;
    document.getElementById('modalCharCount').textContent = file.charCount.toLocaleString();

    // 모달 창 보이기 (hidden 클래스 제거)
    document.getElementById('fileModal').classList.remove('hidden');

    console.log(`${file.name} 상세 내용 표시`);
}

// ========================================
// ❌ 모달 창을 닫는 함수
// ========================================
// 설명: 모달의 X 버튼을 클릭하면 팝업을 숨깁니다
function closeModal() {
    // 모달 창 숨기기 (hidden 클래스 추가)
    document.getElementById('fileModal').classList.add('hidden');
}

// ========================================
// ⌨️ 키보드 이벤트 처리
// ========================================
// 설명: ESC 키를 누르면 모달이 닫히도록 합니다
document.addEventListener('keydown', function(event) {
    // ESC 키의 코드는 'Escape'
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ========================================
// 🖱️ 모달 배경 클릭 시 닫기
// ========================================
// 설명: 모달 바깥 어두운 부분을 클릭하면 모달이 닫힙니다
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('fileModal');

    modal.addEventListener('click', function(event) {
        // 모달의 배경(검은 반투명 영역)을 클릭한 경우
        if (event.target === modal) {
            closeModal();
        }
    });
});
