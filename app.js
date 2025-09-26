// 공통 유틸리티 함수들

// 날짜를 YYYYMMDD 형식으로 변환
function formatDateForAPI(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// 날짜를 YYYY.MM.DD 형식으로 변환
function formatDateForDisplay(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// 화면 전환 함수들

// 홈 화면 표시
function showHomeScreen() {
    document.getElementById('homeScreen').style.display = 'block';
    document.getElementById('mealScreen').style.display = 'none';
    document.getElementById('timetableScreen').style.display = 'none';
    updateHomeScreen();
}

// 시간표 화면 표시
function showTimetableScreen() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('mealScreen').style.display = 'none';
    document.getElementById('timetableScreen').style.display = 'block';
    
    // 저장된 학년/반 정보가 있는지 확인
    if (loadGradeClass()) {
        showTimetableDisplay();
    } else {
        showGradeClassInput();
    }
}

// 급식 화면 표시
function showMealScreen(date) {
    selectedDate = new Date(date);
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('mealScreen').style.display = 'block';
    document.getElementById('timetableScreen').style.display = 'none';
    currentDate = new Date(selectedDate);
    updateMealScreen();
}

// 캘린더 (급식) 화면 표시
function showCalendar() {
    // 이 함수는 더 이상 사용하지 않지만 호환성을 위해 유지
    updateHomeScreen();
}

// 초기 로드
window.addEventListener('load', () => {
    showHomeScreen();
});

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (event) => {
    const modal = document.getElementById('ddayModal');
    if (event.target === modal) {
        closeDdayModal();
    }
});