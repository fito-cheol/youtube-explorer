# YouTube Explorer

YouTube Explorer는 YouTube API를 활용하여 비디오를 검색하고 시청할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- YouTube 비디오 검색
- 비디오 상세 정보 조회
- 채널별 인기 비디오 추천
- 반응형 디자인

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS
- YouTube Data API v3

## 시작하기

### 필수 조건

- Node.js 14.0 이상
- YouTube Data API v3 API 키

### 설치

1. 저장소 클론
```bash
git clone https://github.com/fito-cheol/youtube-explorer.git
cd youtube-explorer
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가합니다:
```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
```

4. 개발 서버 실행
```bash
npm run dev
```

## 사용 방법

1. 검색창에 키워드를 입력하여 비디오를 검색합니다.
2. 검색 결과에서 원하는 비디오를 클릭하여 상세 정보를 확인합니다.
3. 비디오 모달에서 관련 채널의 인기 비디오를 확인할 수 있습니다.

## 라이센스

MIT 