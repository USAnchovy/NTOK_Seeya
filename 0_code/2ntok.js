// JSON 파일을 읽어오는 함수
function loadSeatData(file) {
    fetch(file)  // JSON 파일의 경로를 지정
        .then(response => response.json())  // JSON 데이터로 변환
        .then(seatData => {
            // 좌석 업데이트 함수 호출
            updateSeats(seatData);
        })
        .catch(error => {
            console.error('Error loading seat data:', error);
        });
}


let currentImageIndex = 0;
let seatImages = [];  // 현재 선택된 좌석의 이미지들

// 좌석의 상태와 이미지를 업데이트하는 함수
function updateSeats(seatData) {
    seatData.forEach(seat => {
        const seatElement = document.getElementById(seat.seat_id);

        if (seatElement) {
            // 같은 seat_id를 가진 데이터 필터링하여 사진 개수 계산
            const relatedImages = seatData.filter(data => data.seat_id === seat.seat_id);
            const imageCount = relatedImages.length; // 사진 개수
            
            // 사진 개수에 따라 색상 변경
            if (imageCount === 1) {
                seatElement.style.backgroundImage = `url('../0_input/ic_seat4.gif')`;
            } else if (imageCount <= 2) {
                seatElement.style.backgroundImage = `url('../0_input/ic_seat5.gif')`; // 사진 2개
            } else if (imageCount <= 3) {
                seatElement.style.backgroundImage = `url('../0_input/ic_seat3.gif')`; // 사진 3개
            } else {
                seatElement.style.backgroundImage = `url('../0_input/ic_seat6.gif')`; // 사진 4개 이상
            }
            
            // 예약 가능 여부에 따라 버튼 활성화
            if (seat.available) {
                seatElement.style.cursor = "pointer"; // 활성화된 좌석
            } else {
                seatElement.style.cursor = "not-allowed"; // 비활성화된 좌석
            }

            // 툴팁 추가 (선택 사항)
            seatElement.title = `${seat.seatNumber}`;

            // 마우스 클릭 이벤트 설정 (click 이벤트로 팝업 표시)
            seatElement.addEventListener("click", function(event) {
                // 좌석에 해당하는 사진 배열을 전달
                showPopupImage(event, seat, seatData);  // 좌석에 해당하는 사진 배열을 전달
            });
        }
    });
}


// 팝업 이미지를 띄우고 숨기는 함수
function showPopupImage(event, seatData, allSeatData) {
    // 같은 seat_id에 해당하는 모든 이미지를 찾기
    seatImages = allSeatData.filter(seat => seat.seat_id === seatData.seat_id).map(seat => seat.image);

    if (seatImages.length === 0) {
        console.error("No images available for this seat.");
        return;
    }

    currentImageIndex = 0;  // 첫 번째 사진부터 시작

    const popup = document.getElementById("popupImage");
    const img = document.getElementById("popupImg");
    const currentImageText = document.getElementById("currentImageIndex");
    const totalImageText = document.getElementById("totalImageCount");

    // 좌석 정보와 촬영 정보
    const performanceName = document.getElementById("performanceName");
    const performanceDate = document.getElementById("performanceDate");
    const seatNumber = document.getElementById("seatNumber");

    const cameraModel = document.getElementById("cameraModel");
    const focalLength = document.getElementById("focalLength");
    const copyright = document.getElementById("copyright");

    // 해당 이미지에 대한 상세 정보 찾기
    const seatInfo = allSeatData.filter(seat => seat.image === seatImages[currentImageIndex])[0];


    // 팝업 내용 설정
    img.src = seatImages[currentImageIndex];  // 첫 번째 이미지로 설정
    currentImageText.textContent = currentImageIndex + 1;
    totalImageText.textContent = seatImages.length;

    // 좌석 정보 설정
    performanceName.textContent = seatInfo.performanceName || "정보 없음";
    performanceDate.textContent = seatInfo.performanceDate || "정보 없음";
    seatNumber.textContent = seatInfo.seatNumber || "정보 없음";
    Grade.textContent = seatInfo.Grade || "정보 없음";

    // 촬영 정보 설정
    cameraModel.textContent = seatInfo.model || "정보 없음";
    focalLength.textContent = seatInfo.focal || "정보 없음";
    copyright.textContent = seatInfo.copyright || "정보 없음";

    // 팝업 표시
    popup.style.display = "block";
    
    
    // `changeImage` 함수에 `allSeatData`를 전달
    window.changeImage = function(direction) {
        // 이미지 넘기기
        currentImageIndex = (currentImageIndex + direction + seatImages.length) % seatImages.length;
        const img = document.getElementById("popupImg");
        const currentImageText = document.getElementById("currentImageIndex");
        const seatInfo = allSeatData.filter(seat => seat.image === seatImages[currentImageIndex])[0];

        // 이미지 업데이트
        img.src = seatImages[currentImageIndex];
        currentImageText.textContent = currentImageIndex + 1;

        // 좌석 정보 업데이트
        document.getElementById("performanceName").textContent = seatInfo.performanceName || "정보 없음";
        document.getElementById("performanceDate").textContent = seatInfo.performanceDate || "정보 없음";
        document.getElementById("seatNumber").textContent = seatInfo.seatNumber || "정보 없음";
        document.getElementById("Grade").textContent = seatInfo.Grade || "정보 없음";

        // 촬영 정보 업데이트
        document.getElementById("cameraModel").textContent = seatInfo.model || "정보 없음";
        document.getElementById("focalLength").textContent = seatInfo.focal || "정보 없음";
        document.getElementById("copyright").textContent = seatInfo.copyright || "정보 없음";
    }
}

// 팝업 창을 닫는 함수
function closePopup() {
    const popup = document.getElementById("popupImage");
    popup.style.display = "none";
}


// 팝업 닫기 버튼 클릭 시
document.getElementById("closePopupBtn").addEventListener("click", closePopup);

// 좌우 방향키로 이미지 넘기기
document.getElementById("prevBtn").addEventListener("click", function() {
    changeImage(-1);  // 이전 이미지
});

document.getElementById("nextBtn").addEventListener("click", function() {
    changeImage(1);  // 다음 이미지
});


// 극장 바꾸기
document.getElementById('hae').addEventListener('click', function() {
    window.location.href = '3hae.html'; // 이동할 HTML 페이지의 경로
});

document.getElementById('dal').addEventListener('click', function() {
    window.location.href = '3dal.html'; // 이동할 HTML 페이지의 경로
});

document.getElementById('ha').addEventListener('click', function() {
    window.location.href = '3ha.html'; // 이동할 HTML 페이지의 경로
});

document.getElementById('main').addEventListener('click', function() {
    window.location.href = '3main.html'; // 이동할 HTML 페이지의 경로
});

function createSeatLegend() {
    const legendData = [
        { image: '../0_input/ic_seat4.gif', text: '1개' },
        { image: '../0_input/ic_seat5.gif', text: '2개' },
        { image: '../0_input/ic_seat3.gif', text: '3개' },
        { image: '../0_input/ic_seat6.gif', text: '4개 이상' }
    ];

    const legendContainer = document.getElementById('seatLegend');
    legendContainer.innerHTML = ''; // 기존 내용 초기화

    legendData.forEach(legend => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-box';

        // 이미지 추가
        const img = document.createElement('img');
        img.className = 'legend-image';
        img.src = legend.image;
        img.alt = legend.text;

        // 텍스트 추가
        const text = document.createElement('span');
        text.className = 'legend-text';
        text.textContent = legend.text;

        // 요소 결합
        legendItem.appendChild(img);
        legendItem.appendChild(text);

        // 범례 컨테이너에 추가
        legendContainer.appendChild(legendItem);
    });
}

// 범례 생성 함수 호출
createSeatLegend();
