class GameManager {
    constructor() {
        this.currentScene = 0;
        this.inventory = [];
        this.scenarios = {};
        this.isLoaded = false;
    }

    async loadScenario() {
        try {
            const response = await fetch('scenario.json');
            const data = await response.json();
            
            // 시나리오 데이터를 장면 번호를 키로 하는 객체로 변환
            this.scenarios = data.reduce((acc, scene) => {
                acc[scene.sceneNumber] = scene;
                return acc;
            }, {});
            
            this.isLoaded = true;
            if (this.onLoad) this.onLoad();
            
            console.log('시나리오 로드 완료');
        } catch (error) {
            console.error('시나리오 로드 실패:', error);
        }
    }

    updateScene(sceneNumber) {
        const scene = this.scenarios[sceneNumber];
        if (!scene) {
            console.error(`장면 ${sceneNumber}를 찾을 수 없습니다.`);
            return;
        }

        // 이미지 업데이트
        const gameImage = document.querySelector('.game-image');
        gameImage.src = `image/${scene.image}`;

        // 텍스트 업데이트
        const textContainer = document.querySelector('.text-container');
        textContainer.innerHTML = ''; // 기존 내용 초기화

        // 상황 텍스트 추가
        if (scene.situation) {
            const situationText = document.createElement('div');
            situationText.textContent = scene.situation;
            textContainer.appendChild(situationText);
        }

        // 대화 텍스트 추가
        if (scene.dialogue) {
            const dialogueText = document.createElement('div');
            dialogueText.textContent = scene.dialogue;
            dialogueText.style.marginTop = '10px';
            textContainer.appendChild(dialogueText);
        }

        // 선택지 버튼 생성
        this.createChoiceButtons(scene);

        // 주관식 입력창 생성
        if (scene.subjective) {
            this.createSubjectiveInput(scene);
        }

        // 아이템 업데이트
        if (scene.item) {
            this.updateInventory(scene);
        }
    }

    createChoiceButtons(scene) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        for (let i = 1; i <= 4; i++) {
            const choice = scene[`choice${i}`];
            const path = scene[`path${i}`];
            if (choice && path) {
                const button = document.createElement('button');
                button.textContent = choice;
                button.onclick = () => this.handleChoice(path);
                buttonContainer.appendChild(button);
            }
        }

        const textContainer = document.querySelector('.text-container');
        textContainer.appendChild(buttonContainer);
    }

    createSubjectiveInput(scene) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'subjective-container';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = scene.subjective;

        const submitButton = document.createElement('button');
        submitButton.textContent = '확인';
        submitButton.onclick = () => this.handleSubjectiveAnswer(input.value, scene);

        inputContainer.appendChild(input);
        inputContainer.appendChild(submitButton);

        const textContainer = document.querySelector('.text-container');
        textContainer.appendChild(inputContainer);
    }

    handleChoice(path) {
        if (typeof path === 'number') {
            this.updateScene(path);
        } else {
            // 이벤트 처리
            this.handleEvent(path);
        }
    }

    handleSubjectiveAnswer(answer, scene) {
        if (answer === scene.subjectiveAnswer) {
            this.handleChoice(scene.subjectiveAnswerPath);
        } else {
            this.handleChoice(scene.subjectiveWrongPath);
        }
    }

    handleEvent(event) {
        // 이벤트 처리 로직
        console.log('이벤트 발생:', event);
    }

    updateInventory(scene) {
        if (scene.item) {
            this.inventory.push({
                name: scene.item,
                description: scene.itemDescription
            });
            this.renderInventory();
        }
    }

    renderInventory() {
        const itemContainer = document.querySelector('.item-container');
        itemContainer.innerHTML = '';

        this.inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.title = item.description;
            itemContainer.appendChild(itemElement);
        });
    }
}

// 게임 매니저 인스턴스 생성
const gameManager = new GameManager();

// 게임 시작 시 시나리오 로드
window.onload = () => {
    gameManager.loadScenario();
}; 