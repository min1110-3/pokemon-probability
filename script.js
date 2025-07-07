// DOM 요소
const deckSizeInput = document.getElementById('deckSize');
const handSizeInput = document.getElementById('handSize');
const cardNameInput = document.getElementById('cardName');
const cardCountInput = document.getElementById('cardCount');
const addCardButton = document.getElementById('addCard');
const cardListContainer = document.getElementById('cardListContainer');
const probabilityContainer = document.getElementById('probabilityContainer');
const currentCardCountSpan = document.getElementById('currentCardCount');
const errorMessageP = document.getElementById('errorMessage');

// 상태 관리
let cards = [];

// 현재 덱에 있는 총 카드 수 계산
function getCurrentTotalCards() {
    return cards.reduce((sum, card) => sum + card.count, 0);
}

// 카드 추가
function addCard() {
    const name = cardNameInput.value.trim();
    const count = parseInt(cardCountInput.value);
    const deckSize = parseInt(deckSizeInput.value);
    const currentTotal = getCurrentTotalCards();

    // 유효성 검사
    if (!name) {
        showError('카드 이름을 입력해주세요.');
        return;
    }

    if (count < 1 || count > 20) {
        showError('카드 장수는 1-20장 사이여야 합니다.');
        return;
    }

    if (currentTotal + count > deckSize) {
        showError(`덱 크기(${deckSize}장)를 초과할 수 없습니다. 현재 ${currentTotal}장이 추가되어 있습니다.`);
        return;
    }

    // 카드 추가
    cards.push({ name, count });
    cardNameInput.value = '';
    cardCountInput.value = '1';
    errorMessageP.textContent = '';
    updateUI();
}

// 에러 메시지 표시
function showError(message) {
    errorMessageP.textContent = message;
}

// 카드 삭제
function removeCard(index) {
    cards = cards.filter((_, i) => i !== index);
    updateUI();
}

// 확률 계산
function calculateProbability(cardCount, deckSize, handSize) {
    // 초기확률 계산 (초기확률 = 1 - 카드를 한장도 뽑지 못할 확률)
    const notDrawingProbability = Array.from({ length: handSize }, (_, i) => {
        return ((deckSize - cardCount - i) / (deckSize - i));
    }).reduce((acc, curr) => acc * curr, 1);

    return (1 - notDrawingProbability) * 100;
}

// UI 업데이트
function updateUI() {
    // 현재 카드 수 업데이트
    const currentTotal = getCurrentTotalCards();
    currentCardCountSpan.textContent = currentTotal;

    // 카드 목록 업데이트
    cardListContainer.innerHTML = cards.map((card, index) => `
        <div class="card-item">
            <span>${card.name} (${card.count}장)</span>
            <button class="delete" onclick="removeCard(${index})">삭제</button>
        </div>
    `).join('');

    // 확률 계산 결과 업데이트
    const deckSize = parseInt(deckSizeInput.value);
    const handSize = parseInt(handSizeInput.value);

    probabilityContainer.innerHTML = cards.map(card => `
        <div class="probability-item">
            <h3>${card.name}</h3>
            <p>첫 ${handSize}장에서 1장 이상 뽑을 확률: ${calculateProbability(card.count, deckSize, handSize).toFixed(2)}%</p>
        </div>
    `).join('');
}

// 이벤트 리스너
addCardButton.addEventListener('click', addCard);
cardNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addCard();
});

[deckSizeInput, handSizeInput].forEach(input => {
    input.addEventListener('change', updateUI);
});

// 초기 UI 업데이트
updateUI();
