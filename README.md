# 🗓️ Weekend Planner

> 주말 여행·모임 일정을 한눈에 공유하는 웹 앱

## 🚀 배포

| 환경 | URL |
|------|-----|
| **Vercel (Main)** | [weekend-planner-2026.vercel.app](https://weekend-planner-2026.vercel.app) |
| **Surge** | [weekend-planner.surge.sh](https://weekend-planner.surge.sh) |

## 📸 주요 기능

- **이벤트 생성 / 편집** — 메인 콘텐츠 카드, 타임테이블(Day별), 위치 정보, 교통편을 관리
- **실시간 미리보기** — 데스크톱 사이드바 프리뷰 + 모바일 풀스크린 오버레이
- **Lucide 아이콘 피커** — 검색 기반 아이콘 선택
- **카드 하이라이트** — 타임라인 아이템에 시각적 강조 표시
- **컬러 테마** — 4개 프리셋(🌊 오션 · 🌅 선셋 · 🌿 포레스트 · 💜 라벤더) + 커스텀 테마
- **카카오톡 공유** — 이벤트 링크를 카카오톡으로 바로 공유
- **다크 모드** — 시스템 설정 연동 / 수동 전환
- **외부 링크(펜션 등)** — 편집 가능한 외부 링크 바로가기
- **Day 화살표 네비게이션** — 스와이프 대신 좌우 화살표로 일정 탐색 (초기 힌트 애니메이션)

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 18 · TypeScript · Vite 5 |
| Styling | CSS Modules · CSS Custom Properties |
| State | Zustand (persist middleware) |
| Backend | Supabase (PostgreSQL · Row Level Security) |
| Maps | Kakao Maps SDK · Kakao JS SDK |
| Icons | react-icons (Lucide · Ionicons · Material) |
| Deploy | Vercel · Surge |

## 📁 프로젝트 구조

```
src/
├── components/     # 재사용 컴포넌트 (KakaoMap, IconPicker 등)
├── lib/            # Supabase 클라이언트
├── routes/         # 페이지 (PublicView, AdminDashboard, EventCreate, EventEdit, AdminLogin)
├── services/       # API 서비스 레이어 (eventService)
├── store/          # Zustand 스토어 (useEventStore, useThemeStore)
├── styles/         # 글로벌 CSS · 디자인 토큰
├── types/          # TypeScript 타입 정의
└── utils/          # 유틸리티 함수
```

## 🏃 로컬 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_KAKAO_MAP_APP_KEY=your_kakao_app_key

# 개발 서버
npm run dev
```

---

## 🗺️ Roadmap — 추후 고도화 예정

### Phase 1: 다중 사용자 인증
- [ ] Supabase Auth 연동 (카카오 / Google 소셜 로그인)
- [ ] 로그인 / 회원가입 UI 구현
- [ ] 세션 관리 및 토큰 갱신

### Phase 2: 사용자별 이벤트 관리
- [ ] DB 스키마 리팩토링 — `events` 테이블에 `user_id` FK 추가
- [ ] RLS 정책 강화 — 본인 이벤트만 CRUD 가능
- [ ] 이벤트 목록 페이지 (내 이벤트 / 공유받은 이벤트)

### Phase 3: 고유 URL 기반 공유
- [ ] URL 구조 변경: `/event/[eventId]` 또는 `/event/[slug]`
- [ ] 이벤트별 고유 공유 링크 생성
- [ ] 비공개 / 공개 이벤트 설정

### Phase 4: UX 개선
- [ ] 드래그 앤 드롭으로 일정 순서 변경
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 참석자 RSVP 기능
- [ ] 알림 기능 (이벤트 D-Day 리마인더)

### Phase 5: 성능 & 인프라
- [ ] React Query (TanStack Query) 도입 — 서버 상태 캐싱
- [ ] 코드 스플리팅 최적화
- [ ] PWA 지원 (오프라인 캐싱)
- [ ] CI/CD 파이프라인 구축 (GitHub Actions)

---

## 📝 License

MIT
