// 홈화면 관련 변수
let currentCalendarDate = new Date(); // 캘린더에서 현재 보고 있는 월

// 홈 화면 업데이트
function updateHomeScreen() {
    const today = new Date();
    document.getElementById('homeDate').textContent = formatDateForDisplay(today);
    currentCalendarDate = new Date(today); // 현재 월로 초기화
    generateCalendar(currentCalendarDate);
    updateDdayList();
}

// 달 변경
function changeMonth(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    generateCalendar(currentCalendarDate);
}

// 캘린더 생성
function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    const ddayDates = getDdayDates();
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    document.getElementById('calendarMonth').textContent = monthNames[month];
    document.getElementById('calendarYear').textContent = `${year}.${String(month + 1).padStart(2, '0')}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    for (let i = 0; i < 42; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (currentDay.getMonth() !== month) {
            dayElement.className += ' empty';
            // 빈 칸은 아무 내용도 표시하지 않음
        } else {
            dayElement.textContent = currentDay.getDate();
            
            // 요일별 색상
            if (currentDay.getDay() === 0) {
                dayElement.className += ' sunday';
            } else if (currentDay.getDay() === 6) {
                dayElement.className += ' saturday';
            }
            
            // 오늘 날짜 표시
            if (currentDay.toDateString() === today.toDateString()) {
                dayElement.className += ' today';
            }
            
            // D-Day가 있는 날짜 표시
            const dateString = currentDay.toISOString().split('T')[0];
            if (ddayDates.includes(dateString)) {
                dayElement.className += ' has-dday';
            }
            
            // 클릭 이벤트
            dayElement.addEventListener('click', () => {
                showMealScreen(currentDay);
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// D-Day 목록 업데이트
function updateDdayList() {
    const savedDdays = JSON.parse(localStorage.getItem('ddays') || '[]');
    const container = document.getElementById('ddayContainer');
    
    if (savedDdays.length === 0) {
        container.innerHTML = '<div class="dday-box empty-dday">등록된 D-Day가 없습니다</div>';
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 날짜 순으로 정렬
    savedDdays.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    container.innerHTML = '';
    
    savedDdays.forEach((ddayData, index) => {
        const ddayDate = new Date(ddayData.date);
        ddayDate.setHours(0, 0, 0, 0);
        const diffTime = ddayDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let displayText = ddayData.title;
        if (diffDays > 0) {
            displayText += ` D-${diffDays}`;
        } else if (diffDays === 0) {
            displayText += ` D-Day`;
        } else {
            displayText += ` D+${Math.abs(diffDays)}`;
        }
        
        const ddayElement = document.createElement('div');
        ddayElement.className = 'dday-box';
        ddayElement.innerHTML = `
            ${displayText}
            <button class="delete-btn" onclick="deleteDday(${index})" title="삭제">×</button>
        `;
        
        container.appendChild(ddayElement);
    });
}

// D-Day 삭제
function deleteDday(index) {
    const savedDdays = JSON.parse(localStorage.getItem('ddays') || '[]');
    savedDdays.splice(index, 1);
    localStorage.setItem('ddays', JSON.stringify(savedDdays));
    updateDdayList();
    generateCalendar(currentCalendarDate); // 현재 보고 있는 월 기준으로 업데이트
}

// 캘린더에서 D-Day가 있는 날짜 표시
function getDdayDates() {
    const savedDdays = JSON.parse(localStorage.getItem('ddays') || '[]');
    return savedDdays.map(dday => dday.date);
}

// D-Day 모달 열기
function openDdayModal() {
    document.getElementById('ddayModal').style.display = 'block';
    document.getElementById('ddayDate').value = new Date().toISOString().split('T')[0];
}

// D-Day 모달 닫기
function closeDdayModal() {
    document.getElementById('ddayModal').style.display = 'none';
    document.getElementById('ddayTitle').value = '';
    document.getElementById('ddayDate').value = '';
}

// D-Day 저장
function saveDday() {
    const title = document.getElementById('ddayTitle').value.trim();
    const date = document.getElementById('ddayDate').value;
    
    if (title && date) {
        const savedDdays = JSON.parse(localStorage.getItem('ddays') || '[]');
        const newDday = { title, date };
        savedDdays.push(newDday);
        localStorage.setItem('ddays', JSON.stringify(savedDdays));
        updateDdayList();
        generateCalendar(currentCalendarDate); // 현재 보고 있는 월 기준으로 업데이트
        closeDdayModal();
    } else {
        alert('제목과 날짜를 모두 입력해주세요.');
    }
}