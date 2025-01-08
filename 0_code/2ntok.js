// JSON ������ �о���� �Լ�
function loadSeatData(file) {
    fetch(file)  // JSON ������ ��θ� ����
        .then(response => response.json())  // JSON �����ͷ� ��ȯ
        .then(seatData => {
            // �¼� ������Ʈ �Լ� ȣ��
            updateSeats(seatData);
        })
        .catch(error => {
            console.error('Error loading seat data:', error);
        });
}


let currentImageIndex = 0;
let seatImages = [];  // ���� ���õ� �¼��� �̹�����

// �¼��� ���¿� �̹����� ������Ʈ�ϴ� �Լ�
function updateSeats(seatData) {
    seatData.forEach(seat => {
        const seatElement = document.getElementById(seat.seat_id);

        if (seatElement) {
            // ���� seat_id�� ���� ������ ���͸��Ͽ� ���� ���� ���
            const relatedImages = seatData.filter(data => data.seat_id === seat.seat_id);
            const imageCount = relatedImages.length; // ���� ����
            
            // ���� ������ ���� ���� ����
            if (imageCount === 1) {
                seatElement.style.backgroundImage = `url('../0_input/ic_seat4.gif')`;
            } else if (imageCount <= 2) {
                seatElement.style.backgroundImage = `url('../0_input/ic_seat5.gif')`; // ���� 2��
            } else if (imageCount <= 3) {
                seatElement.style.backgroundImage = `url('../0_input/ic_seat3.gif')`; // ���� 3��
            } else {
                seatElement.style.backgroundImage = `url('../0_input/ic_seat6.gif')`; // ���� 4�� �̻�
            }
            
            // ���� ���� ���ο� ���� ��ư Ȱ��ȭ
            if (seat.available) {
                seatElement.style.cursor = "pointer"; // Ȱ��ȭ�� �¼�
            } else {
                seatElement.style.cursor = "not-allowed"; // ��Ȱ��ȭ�� �¼�
            }

            // ���� �߰� (���� ����)
            seatElement.title = `${seat.seatNumber}`;

            // ���콺 Ŭ�� �̺�Ʈ ���� (click �̺�Ʈ�� �˾� ǥ��)
            seatElement.addEventListener("click", function(event) {
                // �¼��� �ش��ϴ� ���� �迭�� ����
                showPopupImage(event, seat, seatData);  // �¼��� �ش��ϴ� ���� �迭�� ����
            });
        }
    });
}


// �˾� �̹����� ���� ����� �Լ�
function showPopupImage(event, seatData, allSeatData) {
    // ���� seat_id�� �ش��ϴ� ��� �̹����� ã��
    seatImages = allSeatData.filter(seat => seat.seat_id === seatData.seat_id).map(seat => seat.image);

    if (seatImages.length === 0) {
        console.error("No images available for this seat.");
        return;
    }

    currentImageIndex = 0;  // ù ��° �������� ����

    const popup = document.getElementById("popupImage");
    const img = document.getElementById("popupImg");
    const currentImageText = document.getElementById("currentImageIndex");
    const totalImageText = document.getElementById("totalImageCount");

    // �¼� ������ �Կ� ����
    const performanceName = document.getElementById("performanceName");
    const performanceDate = document.getElementById("performanceDate");
    const seatNumber = document.getElementById("seatNumber");

    const cameraModel = document.getElementById("cameraModel");
    const focalLength = document.getElementById("focalLength");
    const copyright = document.getElementById("copyright");

    // �ش� �̹����� ���� �� ���� ã��
    const seatInfo = allSeatData.filter(seat => seat.image === seatImages[currentImageIndex])[0];


    // �˾� ���� ����
    img.src = seatImages[currentImageIndex];  // ù ��° �̹����� ����
    currentImageText.textContent = currentImageIndex + 1;
    totalImageText.textContent = seatImages.length;

    // �¼� ���� ����
    performanceName.textContent = seatInfo.performanceName || "���� ����";
    performanceDate.textContent = seatInfo.performanceDate || "���� ����";
    seatNumber.textContent = seatInfo.seatNumber || "���� ����";
    Grade.textContent = seatInfo.Grade || "���� ����";

    // �Կ� ���� ����
    cameraModel.textContent = seatInfo.model || "���� ����";
    focalLength.textContent = seatInfo.focal || "���� ����";
    copyright.textContent = seatInfo.copyright || "���� ����";

    // �˾� ǥ��
    popup.style.display = "block";
    
    
    // `changeImage` �Լ��� `allSeatData`�� ����
    window.changeImage = function(direction) {
        // �̹��� �ѱ��
        currentImageIndex = (currentImageIndex + direction + seatImages.length) % seatImages.length;
        const img = document.getElementById("popupImg");
        const currentImageText = document.getElementById("currentImageIndex");
        const seatInfo = allSeatData.filter(seat => seat.image === seatImages[currentImageIndex])[0];

        // �̹��� ������Ʈ
        img.src = seatImages[currentImageIndex];
        currentImageText.textContent = currentImageIndex + 1;

        // �¼� ���� ������Ʈ
        document.getElementById("performanceName").textContent = seatInfo.performanceName || "���� ����";
        document.getElementById("performanceDate").textContent = seatInfo.performanceDate || "���� ����";
        document.getElementById("seatNumber").textContent = seatInfo.seatNumber || "���� ����";
        document.getElementById("Grade").textContent = seatInfo.Grade || "���� ����";

        // �Կ� ���� ������Ʈ
        document.getElementById("cameraModel").textContent = seatInfo.model || "���� ����";
        document.getElementById("focalLength").textContent = seatInfo.focal || "���� ����";
        document.getElementById("copyright").textContent = seatInfo.copyright || "���� ����";
    }
}

// �˾� â�� �ݴ� �Լ�
function closePopup() {
    const popup = document.getElementById("popupImage");
    popup.style.display = "none";
}


// �˾� �ݱ� ��ư Ŭ�� ��
document.getElementById("closePopupBtn").addEventListener("click", closePopup);

// �¿� ����Ű�� �̹��� �ѱ��
document.getElementById("prevBtn").addEventListener("click", function() {
    changeImage(-1);  // ���� �̹���
});

document.getElementById("nextBtn").addEventListener("click", function() {
    changeImage(1);  // ���� �̹���
});


// ���� �ٲٱ�
document.getElementById('hae').addEventListener('click', function() {
    window.location.href = '3hae.html'; // �̵��� HTML �������� ���
});

document.getElementById('dal').addEventListener('click', function() {
    window.location.href = '3dal.html'; // �̵��� HTML �������� ���
});

document.getElementById('ha').addEventListener('click', function() {
    window.location.href = '3ha.html'; // �̵��� HTML �������� ���
});

document.getElementById('main').addEventListener('click', function() {
    window.location.href = '3main.html'; // �̵��� HTML �������� ���
});

function createSeatLegend() {
    const legendData = [
        { image: '../0_input/ic_seat4.gif', text: '1��' },
        { image: '../0_input/ic_seat5.gif', text: '2��' },
        { image: '../0_input/ic_seat3.gif', text: '3��' },
        { image: '../0_input/ic_seat6.gif', text: '4�� �̻�' }
    ];

    const legendContainer = document.getElementById('seatLegend');
    legendContainer.innerHTML = ''; // ���� ���� �ʱ�ȭ

    legendData.forEach(legend => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-box';

        // �̹��� �߰�
        const img = document.createElement('img');
        img.className = 'legend-image';
        img.src = legend.image;
        img.alt = legend.text;

        // �ؽ�Ʈ �߰�
        const text = document.createElement('span');
        text.className = 'legend-text';
        text.textContent = legend.text;

        // ��� ����
        legendItem.appendChild(img);
        legendItem.appendChild(text);

        // ���� �����̳ʿ� �߰�
        legendContainer.appendChild(legendItem);
    });
}

// ���� ���� �Լ� ȣ��
createSeatLegend();
