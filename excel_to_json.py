import pandas as pd
import json
import os

def excel_to_json():
    # 현재 스크립트의 디렉토리 경로 가져오기
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 엑셀 파일 경로 설정
    excel_path = os.path.join(current_dir, 'scenario.xlsx')
    
    # 엑셀 파일 읽기
    df = pd.read_excel(excel_path)
    
    # 데이터프레임을 딕셔너리 리스트로 변환
    scenarios = []
    for _, row in df.iterrows():
        scene = {}
        
        # 기본 정보
        if pd.notna(row['장면번호']):
            scene['sceneNumber'] = str(row['장면번호'])
        if pd.notna(row['이미지파일']):
            scene['image'] = row['이미지파일']
        if pd.notna(row['상황']):
            scene['situation'] = row['상황']
        if pd.notna(row['대화']):
            scene['dialogue'] = row['대화']
            
        # 선택지와 경로
        for i in range(1, 5):
            choice_key = f'선택{i}'
            path_key = f'경로{i}'
            if pd.notna(row[choice_key]) and pd.notna(row[path_key]):
                scene[f'choice{i}'] = row[choice_key]
                # 경로가 숫자인 경우 정수로 변환
                try:
                    scene[f'path{i}'] = int(row[path_key])
                except ValueError:
                    scene[f'path{i}'] = row[path_key]
        
        # 주관식 관련
        if pd.notna(row['주관식']):
            scene['subjective'] = row['주관식']
        if pd.notna(row['주관식정답']):
            scene['subjectiveAnswer'] = row['주관식정답']
            scene['subjectiveAnswerPath'] = row['주관식정답']
        if pd.notna(row['주관식오답']):
            scene['subjectiveWrongPath'] = row['주관식오답']
        
        # 아이템 관련
        if pd.notna(row['아이템']):
            scene['item'] = row['아이템']
        if pd.notna(row['아이템설명']):
            scene['itemDescription'] = row['아이템설명']
        
        scenarios.append(scene)
    
    # JSON 파일 경로 설정
    json_path = os.path.join(current_dir, 'scenario.json')
    
    # JSON 파일로 저장
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(scenarios, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    excel_to_json() 