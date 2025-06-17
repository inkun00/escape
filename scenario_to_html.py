import json
import os

TEMPLATE = '''<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>방탈출 게임 - 장면 {sceneNumber}</title>
    <style>
        body {{
            margin: 0;
            padding: 0;
            background: #000;
            color: #fff;
            font-family: 'Noto Sans KR', sans-serif;
        }}
        .container {{
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            box-sizing: border-box;
            padding: 2vw;
        }}
        .image-container {{
            width: 100%;
            height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #fff;
            border-radius: 15px;
            background: #111;
            margin-bottom: 2vh;
        }}
        .game-image {{
            max-width: 100%;
            max-height: 100%;
            border-radius: 10px;
        }}
        .text-container {{
            width: 100%;
            height: 15vh;
            max-height: 20vh;
            min-height: 10vh;
            background: rgba(0,0,0,0.8);
            border: 2px solid #fff;
            border-radius: 15px;
            margin-bottom: 2vh;
            padding: 2vh 2vw;
            font-size: 1.1em;
            line-height: 1.6;
            overflow-y: auto;
            box-sizing: border-box;
        }}
        .button-container {{
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1vh;
            margin-bottom: 2vh;
        }}
        .button-container button {{
            padding: 1em;
            font-size: 1em;
            border-radius: 8px;
            border: none;
            background: #fff;
            color: #222;
            cursor: pointer;
            transition: background 0.2s;
        }}
        .button-container button:hover {{
            background: #eee;
        }}
        .item-container {{
            width: 100%;
            height: 6vh;
            background: rgba(40,40,40,0.9);
            border: 2px solid #fff;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 1vw;
            padding: 1vh 1vw;
            margin-bottom: 2vh;
            box-sizing: border-box;
        }}
        .item {{
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.1);
            border: 1px solid #fff;
            border-radius: 5px;
        }}
        .back-btn {{
            display: none !important;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="image-container">
            <img src="image/{image}" class="game-image" alt="scene image">
        </div>
        <div class="text-container">
            <div>{situation}</div>
            {dialogue_block}
        </div>
        {button_block}
        <div class="item-container">
            <!-- 아이템은 추후 구현 가능 -->
        </div>
    </div>
    <script>
        // 주소창, 뒤로가기 방지
        history.pushState(null, null, location.href);
        window.onpopstate = function() {{
            history.go(1);
        }};
    </script>
</body>
</html>
'''

def make_dialogue_block(dialogue):
    if dialogue:
        return f'<div style="margin-top:10px;">{dialogue}</div>'
    return ''

def make_button_block(scene):
    btns = []
    for i in range(1, 5):
        choice = scene.get(f'choice{i}')
        path = scene.get(f'path{i}')
        if choice and path != None:
            btns.append(f'<button onclick=\'parent.loadStage({path})\'>{choice}</button>')
    if btns:
        return f'<div class="button-container">' + ''.join(btns) + '</div>'
    return ''

def main():
    with open('escape/scenario.json', encoding='utf-8') as f:
        data = json.load(f)
    for scene in data:
        html = TEMPLATE.format(
            sceneNumber=scene.get('sceneNumber', ''),
            image=scene.get('image', ''),
            situation=scene.get('situation', ''),
            dialogue_block=make_dialogue_block(scene.get('dialogue', '')),
            button_block=make_button_block(scene)
        )
        with open(f'escape/stage{scene["sceneNumber"]}.html', 'w', encoding='utf-8') as out:
            out.write(html)

if __name__ == '__main__':
    main() 