# 연금계산기 웹 애플리케이션

## 소개
- React 기반의 토스 스타일 연금계산기 웹 애플리케이션
- 직관적이고 사용자 친화적인 UI/UX 구현
- 단계별 입력 방식의 계산기 인터페이스

## 주요 기능

### 메인 페이지
- 슬라이드 형식의 페이지 전환 효과
- IBM Plex Sans KR(제목/부제목)과 Pretendard(본문) 폰트 적용
- 위/아래 화살표 버튼으로 페이지 이동
- 오른쪽 하단 "맨 위로" 버튼
- 배경색: #527e66

### 계산기 페이지
- 12개 입력 항목 구현
  - 생년월일
  - 예상 수명
  - 직업 정보 등
- 사용자 친화적 입력 방식
  - "잘 모르겠어요" 옵션 제공
  - 입력 완료 시 초록색 체크 표시
  - 금액 입력 시 "만원" 단위 표시
- 이전/다음 버튼으로 항목 간 이동

### 진행 상태 표시
- 왼쪽 세로형 진행바 (주황색 #f69516)
- 상태별 색상 구분
  - 완료 항목: #444
  - "잘 모르겠어요" 선택: #d94a38
  - 현재 항목: #f69516

## 기술 스택
- React 18
- TypeScript
- Vite
- Emotion, styled-components
- React Router v6

## 폴더 구조
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/             # 이미지, 아이콘 등 정적 파일
│   ├── components/         # 공통 컴포넌트
│   ├── pages/             # 주요 페이지
│   ├── styles/            # 전역 스타일
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 설치 및 실행
```bash
# 프로젝트 설치
cd frontend
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview
```

## 디자인 가이드
### 색상
- 메인 배경: #527e66
- 진행바 (활성): #f69516
- 완료 항목: #444
- 오류/미입력: #d94a38

### 폰트
- 제목/부제목: IBM Plex Sans KR
- 본문: Pretendard 