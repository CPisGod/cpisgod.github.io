// 시간표화면 관련 변수
let currentWeekStart = new Date();
let currentGrade = null;
let currentClass = null;

// 학년/반 정보 저장 및 불러오기
function saveGradeClass(grade, classNum) {
    const gradeClassData = { grade: grade, class: classNum };
    localStorage.setItem('gradeClass', JSON.stringify(gradeClassData));
    currentGrade = grade;
    currentClass = classNum;
    console.log('학년/반 저장됨:', currentGrade, currentClass);
}

function loadGradeClass() {
    const saved = localStorage.getItem('gradeClass');
    if (saved) {
        const data = JSON.parse(saved);
        currentGrade = data.grade;
        currentClass = data.class;
        console.log('학년/반 불러옴:', currentGrade, currentClass);
        return true;
    }
    return false;
}

// 학년/반 입력 화면 표시
function showGradeClassInput() {
    document.getElementById('gradeClassInput').style.display = 'block';
    document.getElementById('timetableDisplay').style.display = 'none';
    
    // 기존에 저장된 정보가 있으면 미리 입력
    if (currentGrade && currentClass) {
        document.getElementById('gradeInput').value = currentGrade;
        document.getElementById('classInput').value = currentClass;
    }
    
    hideInputError();
}

// 시간표 표시 화면 표시
function showTimetableDisplay() {
    document.getElementById('gradeClassInput').style.display = 'none';
    document.getElementById('timetableDisplay').style.display = 'block';
    
    // 학년/반 정보 표시
    document.getElementById('classInfo').textContent = `${currentGrade}학년 ${currentClass}반`;
    
    console.log('시간표 표시 시작, 학년/반:', currentGrade, currentClass);
    
    initializeCurrentWeek();
    updateTimetableScreen();
}

// 입력 오류 메시지 표시/숨기기
function showInputError(message = '올바른 학년과 반을 입력해주세요.') {
    const errorDiv = document.getElementById('inputError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideInputError() {
    document.getElementById('inputError').style.display = 'none';
}

// 학년/반 유효성 검사 및 시간표 표시
async function validateAndShowTimetable() {
    const grade = document.getElementById('gradeInput').value;
    const classNum = document.getElementById('classInput').value;
    
    console.log('유효성 검사 시작:', grade, classNum);
    
    hideInputError();
    
    // 입력 유효성 검사
    if (!grade || !classNum) {
        showInputError('학년과 반을 모두 입력해주세요.');
        return;
    }
    
    if (classNum < 1 || classNum > 20) {
        showInputError('반은 1~20 사이의 숫자를 입력해주세요.');
        return;
    }
    
    // 학년/반 정보 바로 저장
    saveGradeClass(grade, classNum);
    
    console.log('유효성 검사 통과, 시간표 표시');
    showTimetableDisplay();
}

// 주의 시작일 계산 (월요일 기준)
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// 현재 주 초기화
function initializeCurrentWeek() {
    const today = new Date();
    currentWeekStart = getWeekStart(today);
    console.log('현재 주 초기화:', currentWeekStart);
}

// 주 변경
function changeWeek(direction) {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + (direction * 7));
    
    // 현재 연도 제한
    const currentYear = new Date().getFullYear();
    if (newWeekStart.getFullYear() === currentYear) {
        currentWeekStart = newWeekStart;
        updateTimetableScreen();
    }
}

// 샘플 시간표 데이터 생성
function getSampleTimetableData() {
    console.log('샘플 시간표 데이터 생성 중...');
    
    // 실제 중학교/고등학교 과목들
    const weeklySchedule = {
        1: ['국어', '수학', '영어', '한국사', '체육', '과학', '창체'], // 월요일
        2: ['영어', '국어', '수학', '사회', '음악', '기술가정', '진로'], // 화요일  
        3: ['수학', '과학', '국어', '영어', '미술', '도덕', '자습'], // 수요일
        4: ['사회', '영어', '수학', '체육', '국어', '과학', '동아리'], // 목요일
        5: ['과학', '한국사', '영어', '정보', '국어', '수학', '종례'] // 금요일
    };
    
    const sampleData = [];
    
    // 월요일부터 금요일까지 (1~5)
    for (let day = 1; day <= 5; day++) {
        const daySchedule = weeklySchedule[day];
        
        // 1교시부터 7교시까지
        for (let period = 1; period <= 7; period++) {
            const subject = daySchedule[period - 1];
            
            sampleData.push({
                DGHT_CRSE_SC_NM: day.toString(),
                PERIO: period.toString(),
                ITRT_CNTNT: subject,
                CLRM_NM: `${currentGrade}-${currentClass}`
            });
        }
    }
    
    console.log('샘플 데이터 생성 완료:', sampleData.length, '개 항목');
    console.log('주간 시간표:', weeklySchedule);
    return sampleData;
}

// 시간표 데이터 가져오기
async function fetchTimetableData(weekStart) {
    console.log('=== 시간표 데이터 요청 시작 ===');
    console.log('학년:', currentGrade, '반:', currentClass);
    
    if (!currentGrade || !currentClass) {
        console.error('학년/반 정보가 없습니다! 샘플 데이터를 사용합니다.');
        return getSampleTimetableData();
    }
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const formatDate = (date) => {
        const year = new Date().getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };
    
    const baseUrl = 'https://open.neis.go.kr/hub/hisTimetable';
    const params = new URLSearchParams({
        Type: 'json',
        ATPT_OFCDC_SC_CODE: 'N10',
        SD_SCHUL_CODE: '8140038',
        AY: new Date().getFullYear().toString(),
        GRADE: currentGrade.toString(),
        CLASS_NM: currentClass.toString(),
        TI_FROM_YMD: formatDate(weekStart),
        TI_TO_YMD: formatDate(weekEnd)
    });
    
    const apiUrl = `${baseUrl}?${params}`;
    console.log('API 요청 URL:', apiUrl);
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log('API 응답:', data);
        
        if (data.hisTimetable && data.hisTimetable[1] && data.hisTimetable[1].row) {
            console.log('실제 시간표 데이터 사용:', data.hisTimetable[1].row.length, '개 항목');
            return data.hisTimetable[1].row;
        } else {
            console.log('API에서 데이터 없음, 샘플 데이터 사용');
            return getSampleTimetableData();
        }
    } catch (error) {
        console.error('API 호출 실패:', error);
        console.log('샘플 데이터 사용');
        return getSampleTimetableData();
    }
}

// 시간표 화면 업데이트
async function updateTimetableScreen() {
    console.log('시간표 화면 업데이트 시작');
    
    // 주간 정보 업데이트
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 4);
    
    const formatDisplayDate = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}.${day}`;
    };
    
    document.getElementById('weekInfo').textContent = 
        `${formatDisplayDate(currentWeekStart)} ~ ${formatDisplayDate(weekEnd)}`;
    
    // 로딩 표시
    document.getElementById('timetableBody').innerHTML = 
        '<tr><td colspan="6" class="loading">시간표를 불러오는 중...</td></tr>';
    
    // 시간표 데이터 가져오기 및 표시
    const timetableData = await fetchTimetableData(currentWeekStart);
    displayTimetable(timetableData);
}

// 시간표 표시
function displayTimetable(data) {
    console.log('=== 시간표 표시 시작 ===');
    console.log('받은 데이터:', data);
    
    const tbody = document.getElementById('timetableBody');
    const maxPeriods = 7;
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-period">시간표 데이터가 없습니다</td></tr>';
        return;
    }
    
    // 요일별, 교시별로 데이터 정리
    const schedule = {};
    
    data.forEach((item, index) => {
        console.log(`\n--- 시간표 항목 ${index + 1} ---`);
        console.log('전체 항목:', item);
        
        // 모든 키 출력해서 확인
        console.log('사용 가능한 모든 키:', Object.keys(item));
        
        let dayOfWeek, period, subject;
        
        // 교시 정보 파싱 (가장 확실한 것부터)
        if (item.PERIO) {
            period = parseInt(item.PERIO);
            console.log('✅ 교시 발견:', period);
        }
        
        // 과목 정보 파싱
        if (item.ITRT_CNTNT) {
            subject = item.ITRT_CNTNT;
            console.log('✅ 과목 발견:', subject);
        } else if (item.SUBJECT_NM) {
            subject = item.SUBJECT_NM;
            console.log('✅ 과목(SUBJECT_NM):', subject);
        }
        
        // 요일 정보 파싱 (여러 방법 시도)
        if (item.DGHT_CRSE_SC_NM) {
            dayOfWeek = parseInt(item.DGHT_CRSE_SC_NM);
            console.log('✅ 요일(DGHT_CRSE_SC_NM):', dayOfWeek);
        } else if (item.ALL_TI_YMD) {
            const dateStr = item.ALL_TI_YMD;
            console.log('날짜 문자열:', dateStr);
            const year = parseInt(dateStr.substring(0,4));
            const month = parseInt(dateStr.substring(4,6)) - 1;
            const day = parseInt(dateStr.substring(6,8));
            const date = new Date(year, month, day);
            dayOfWeek = date.getDay();
            if (dayOfWeek === 0) dayOfWeek = 7; // 일요일을 7로
            console.log('✅ 요일 계산됨:', dayOfWeek, '(', year, month+1, day, ')');
            if (dayOfWeek > 5) {
                console.log('⚠️ 토/일요일 제외');
                return;
            }
        } else {
            // 다른 가능한 요일 필드들도 확인
            console.log('❌ 요일 정보를 찾을 수 없음. 다른 필드들:');
            Object.keys(item).forEach(key => {
                if (key.includes('DAY') || key.includes('WEEK') || key.includes('YMD')) {
                    console.log(`  ${key}: ${item[key]}`);
                }
            });
            
            // 요일 정보가 없으면 월요일(1)로 가정
            console.log('⚠️ 요일 정보 없음, 월요일(1)로 가정');
            dayOfWeek = 1;
        }
        
        console.log(`파싱 결과: 요일=${dayOfWeek}, 교시=${period}, 과목=${subject}`);
        
        // 스케줄에 추가 (요일이 없어도 교시와 과목이 있으면 추가)
        if (period && subject) {
            if (!schedule[period]) {
                schedule[period] = {};
            }
            
            schedule[period][dayOfWeek || 1] = {
                subject: subject
            };
            console.log(`✅ 스케줄 추가: ${period}교시 ${dayOfWeek || 1}요일 ${subject}`);
        } else {
            console.log('❌ 필수 정보 누락 (교시 또는 과목)');
        }
    });
    
    console.log('\n=== 정리된 스케줄 ===');
    console.log(schedule);
    
    // HTML 테이블 생성
    let html = '';
    let hasData = false;
    
    for (let period = 1; period <= maxPeriods; period++) {
        html += '<tr>';
        html += `<td class="time-cell">${period}교시</td>`;
        
        for (let day = 1; day <= 5; day++) {
            const classInfo = schedule[period] && schedule[period][day];
            
            if (classInfo) {
                html += `<td class="subject-cell">
                    <div class="subject-name">${classInfo.subject}</div>
                </td>`;
                hasData = true;
            } else {
                html += '<td class="subject-cell empty-period">-</td>';
            }
        }
        
        html += '</tr>';
    }
    
    if (!hasData) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-period">파싱된 시간표 데이터가 없습니다<br>콘솔 로그를 확인해주세요</td></tr>';
        console.log('❌ 파싱된 데이터 없음');
    } else {
        tbody.innerHTML = html;
        console.log('✅ 시간표 렌더링 완료');
    }
    
    console.log('=== 시간표 표시 완료 ===');
}