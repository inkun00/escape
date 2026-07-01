window.SCENARIO_V2 =
{
  "version": 2,
  "startScene": "door",
  "items": {
    "ball": {
      "name": "테니스공",
      "description": "바닥이나 벽에 던지면 잘 튀는 낡은 테니스공이다.",
      "image": "image/ball.png"
    }
  },
  "scenes": {
    "door": {
      "date": "현재",
      "location": "할아버지의 집 · 2층",
      "kicker": "오래된 방문 앞에서",
      "image": "image/opening.png",
      "imageAlt": "삐걱거리는 계단 끝에 있는 할아버지 방",
      "text": [
        "오랜만에 할아버지 집에 왔다. 벨을 눌러도 문을 열어주지 않으셔서 도어락 비밀번호 0629를 누르고 들어왔다.",
        "삐걱거리는 계단을 오르자 할아버지 방 문이 보인다. 평소라면 들렸을 코 고는 소리조차 없다."
      ],
      "dialogue": "“할아버지, 여기 계세요?”",
      "choices": [
        { "text": "방문을 열고 들어간다", "next": "room-enter", "set": { "enteredDirectly": true } },
        { "text": "조용히 문틈으로 방 안을 엿본다", "next": "room-peek", "set": { "enteredDirectly": false } }
      ]
    },
    "room-enter": {
      "date": "현재",
      "location": "할아버지의 방",
      "kicker": "처음 보는 물건",
      "image": "image/stage1.png",
      "imageAlt": "할아버지 방 바닥에 놓인 오래된 나무 상자",
      "text": [
        "할아버지는 방에 계시지 않는다. 익숙한 낡은 방 한가운데, 한 번도 본 적 없는 나무 상자가 놓여 있다.",
        "자물쇠와 모서리에 먼지가 앉아 있지만 누군가 오래도록 소중히 간직한 물건처럼 보인다."
      ],
      "choices": [
        { "text": "조심스럽게 상자를 연다", "next": "box-open", "set": { "askedPermission": false } },
        { "text": "할아버지를 기다리려다가 궁금함을 참지 못한다", "next": "box-hesitate", "set": { "askedPermission": true } }
      ]
    },
    "room-peek": {
      "date": "현재",
      "location": "할아버지의 방",
      "kicker": "비어 있는 방",
      "image": "image/stage1.png",
      "imageAlt": "할아버지 방 바닥에 놓인 오래된 나무 상자",
      "text": [
        "문틈으로 살펴보지만 할아버지는 보이지 않는다. 문을 열고 들어가자 방 한가운데 낯선 나무 상자가 눈에 들어온다.",
        "이 방에 여러 번 들어왔지만 한 번도 본 적 없는 물건이다."
      ],
      "choices": [
        { "text": "조심스럽게 상자를 연다", "next": "box-open", "set": { "askedPermission": false } },
        { "text": "할아버지를 기다리려다가 궁금함을 참지 못한다", "next": "box-hesitate", "set": { "askedPermission": true } }
      ]
    },
    "box-open": {
      "date": "현재",
      "location": "할아버지의 방",
      "kicker": "상자 속 태극기",
      "image": "image/stage2.png",
      "imageAlt": "상자 안에 빛바랜 태극기가 접혀 있는 모습",
      "text": ["상자 뚜껑을 들자 빛바랜 태극기 한 장이 가지런히 접혀 있다."],
      "choices": [
        { "text": "태극기를 가까이 들여다본다", "next": "flag-look" },
        { "text": "태극기에 밴 오래된 냄새를 맡아본다", "next": "flag-smell" }
      ]
    },
    "box-hesitate": {
      "date": "현재",
      "location": "할아버지의 방",
      "kicker": "상자 속 태극기",
      "image": "image/stage2.png",
      "imageAlt": "상자 안에 빛바랜 태극기가 접혀 있는 모습",
      "text": [
        "허락 없이 열어도 될까 잠시 망설인다. 하지만 상자가 왜 여기 있는지 궁금해 결국 뚜껑을 든다.",
        "안에는 빛바랜 태극기 한 장이 가지런히 접혀 있다."
      ],
      "choices": [
        { "text": "태극기를 가까이 들여다본다", "next": "flag-look" },
        { "text": "태극기에 밴 오래된 냄새를 맡아본다", "next": "flag-smell" }
      ]
    },
    "flag-look": {
      "date": "현재",
      "location": "할아버지의 방",
      "kicker": "기억이 흔들리는 순간",
      "image": "image/stage3.png",
      "imageAlt": "빛바랜 태극기를 가까이 바라보는 장면",
      "text": [
        "태극기에는 먼지가 내려앉아 있고 붉고 푸른 빛도 많이 바랬다.",
        "천 사이로 희미한 글씨가 비치는 순간, 귓속이 먹먹해지고 방바닥이 기울어진다."
      ],
      "choices": [{ "text": "눈을 감는다", "next": "arrival" }]
    },
    "flag-smell": {
      "date": "현재",
      "location": "할아버지의 방",
      "kicker": "기억이 흔들리는 순간",
      "image": "image/stage3.png",
      "imageAlt": "빛바랜 태극기를 가까이 든 장면",
      "text": [
        "태극기에서 오래된 천 냄새와 코끝을 찌르는 매운 냄새가 함께 난다.",
        "갑자기 기침이 터지고 귀가 먹먹해진다. 방 안의 소리가 멀어지며 시야가 흔들린다."
      ],
      "choices": [{ "text": "눈을 감는다", "next": "arrival" }]
    },
    "arrival": {
      "date": "1987년 6월 9일",
      "location": "서울의 한 거리",
      "kicker": "낯선 함성과 매운 공기",
      "image": "image/stage4.png",
      "imageAlt": "시민들 앞에 경찰차가 서 있고 연기가 피어오르는 거리",
      "text": [
        "수많은 사람의 함성과 발소리가 한꺼번에 밀려든다. 코를 찌르는 매운 공기 때문에 눈물이 흐른다.",
        "멀리 경찰 병력이 보인다. 분명 방 안에 있었는데, 낯선 거리 한복판에 서 있다."
      ],
      "dialogue": "“여기가 어디지…?”",
      "choices": [
        { "text": "가까운 사람에게 지금이 언제인지 묻는다", "legacy": "stage5.html" },
        { "text": "일단 골목으로 몸을 피한다", "legacy": "stage6.html" }
      ]
    }
  }
}
;
