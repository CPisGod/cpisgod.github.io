// 급식화면 관련 변수
let currentDate = new Date();
let selectedDate = new Date();

// 급식 데이터 가져오기
async function fetchMealData(date) {
    const formattedDate = formatDateForAPI(date);
    const baseUrl = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
    
    let allMealData = [];
    
    // 조식(1), 중식(2), 석식(3) 각각 가져오기
    const mealTypes = ['1', '2', '3'];
    
    for (const mealType of mealTypes) {
        const params = new URLSearchParams({
            Type: 'json',
            pIndex: 'e4cb6775010b4c58b15ffe9dc61ca903',
            pSize: '5',
            ATPT_OFCDC_SC_CODE: 'N10',
            SD_SCHUL_CODE: '8140038',
            MMEAL_SC_CODE: mealType,
            MLSV_YMD: formattedDate
        });
        
        try {
            const response = await fetch(`${baseUrl}?${params}`);
            const data = await response.json();
            
            if (data.mealServiceDietInfo && data.mealServiceDietInfo[1] && data.mealServiceDietInfo[1].row) {
                allMealData = allMealData.concat(data.mealServiceDietInfo[1].row);
            }
        } catch (error) {
            console.error(`${mealType}식 데이터를 가져오는데 실패했습니다:`, error);
        }
    }
    
    return allMealData.length > 0 ? allMealData : null;
}

// 급식 메뉴 파싱 (알레르기 정보 제거)
function parseMenu(menuString) {
    if (!menuString) return [];
    
    return menuString
        .split('<br/>')
        .map(item => item.replace(/\([^)]*\)/g, '').trim())
        .filter(item => item.length > 0);
}

// 급식 정보 표시
function displayMealInfo(mealData) {
    const mealTypes = ['1', '2', '3'];
    
    // 모든 식사 타입을 초기화
    mealTypes.forEach(mealType => {
        const container = document.querySelector(`[data-meal-type="${mealType}"] .meal-content`);
        if (container) {
            container.innerHTML = '<div class="meal-item">급식 정보가 없습니다</div>';
        }
    });
    
    if (mealData && mealData.length > 0) {
        mealData.forEach(meal => {
            const mealTypeCode = meal.MMEAL_SC_CODE;
            const menuItems = parseMenu(meal.DDISH_NM);
            const container = document.querySelector(`[data-meal-type="${mealTypeCode}"] .meal-content`);
            
            if (container && menuItems.length > 0) {
                container.innerHTML = menuItems.map(item => `<div class="meal-item">${item}</div>`).join('');
            }
        });
    }
}

// 날짜 변경
function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateMealScreen();
}

// 급식 화면 업데이트
async function updateMealScreen() {
    // 날짜 표시 업데이트
    document.getElementById('mealDate').textContent = formatDateForDisplay(currentDate);
    
    // 로딩 표시
    document.querySelectorAll('.meal-content').forEach(container => {
        container.innerHTML = '<div class="loading">불러오는 중...</div>';
    });
    
    // 급식 데이터 가져오기 및 표시
    const mealData = await fetchMealData(currentDate);
    displayMealInfo(mealData);
}