import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EventStore, Event } from '../types/event';

const generateId = () => crypto.randomUUID();

// 스토어 버전 - 버전이 변경되면 localStorage 초기화
const STORE_VERSION = 4;

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: [],
      activeEventId: null,
      isAdmin: false,

      // Event actions
      getActiveEvent: () => {
        const { events, activeEventId } = get();
        return events.find((e) => e.id === activeEventId);
      },

      setActiveEvent: (eventId) => {
        set({ activeEventId: eventId });
      },

      createEvent: (event) => {
        const id = generateId();
        const newEvent: Event = { ...event, id };
        set((state) => ({
          events: [...state.events, newEvent],
          activeEventId: id,
        }));
        return id;
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          activeEventId: state.activeEventId === id ? null : state.activeEventId,
        }));
      },

      // Admin
      login: (username, password) => {
        if (username === 'admin' && password === 'admin12') {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAdmin: false });
      },

      // Seed demo data
      seedDemoEvent: () => {
        const id = generateId();
        const demoEvent: Event = {
          id,
          title: '강릉 2박 3일 여행',
          subtitle: '2.27(금) ~ 3.1(일) · 2박 3일',
          isActive: true,
          mainContent: [
            {
              id: generateId(),
              icon: '',
              title: '겨울 바다, 그 특별한 순간',
              description: '차가운 바람과 푸른 파도가 만드는 겨울 동해의 감성을 온몸으로 느껴보세요',
            },
            {
              id: generateId(),
              icon: '',
              title: '강릉의 맛, 미식 로드트립',
              description: '초당순두부, 활어회, 강릉 커피까지 — 입이 즐거운 미식 여정',
            },
            {
              id: generateId(),
              icon: '',
              title: '프레임 속 추억 한 컷',
              description: '경포대, 안목해변, 정동진에서 남기는 인생샷 스팟 투어',
            },
          ],
          schedules: [
            {
              day: 1,
              date: '2/27 (금)',
              items: [
                {
                  id: generateId(),
                  order: 1,
                  time: '07:00',
                  duration: '180분',
                  title: '서울 출발 → 강릉 도착',
                  subtitle: 'KTX 또는 버스 이용',
                },
                {
                  id: generateId(),
                  order: 2,
                  time: '10:00',
                  duration: '60분',
                  title: '숙소 체크인',
                  subtitle: '짐 풀고 휴식',
                },
                {
                  id: generateId(),
                  order: 3,
                  time: '11:00',
                  duration: '90분',
                  title: '초당순두부마을',
                  subtitle: '점심 식사',
                },
                {
                  id: generateId(),
                  order: 4,
                  time: '13:00',
                  duration: '120분',
                  title: '경포대 & 경포해변',
                  subtitle: '해변 산책 및 사진 촬영',
                },
                {
                  id: generateId(),
                  order: 5,
                  time: '15:30',
                  duration: '90분',
                  title: '안목커피거리',
                  subtitle: '커피 한 잔과 함께 바다 구경',
                },
                {
                  id: generateId(),
                  order: 6,
                  time: '17:30',
                  duration: '120분',
                  title: '저녁식사',
                  subtitle: '강릉 맛집 탐방',
                },
                {
                  id: generateId(),
                  order: 7,
                  time: '19:30',
                  duration: '',
                  title: '숙소 복귀 및 자유시간',
                  subtitle: '휴식 및 취침',
                },
              ],
            },
            {
              day: 2,
              date: '2/28 (토)',
              items: [
                {
                  id: generateId(),
                  order: 1,
                  time: '08:00',
                  duration: '60분',
                  title: '조식',
                  subtitle: '숙소 조식 또는 근처 식당',
                },
                {
                  id: generateId(),
                  order: 2,
                  time: '09:30',
                  duration: '150분',
                  title: '정동진 해돋이공원',
                  subtitle: '정동진역, 모래시계공원',
                },
                {
                  id: generateId(),
                  order: 3,
                  time: '12:00',
                  duration: '90분',
                  title: '주문진 수산시장',
                  subtitle: '점심식사 및 시장 구경',
                },
                {
                  id: generateId(),
                  order: 4,
                  time: '14:00',
                  duration: '120분',
                  title: '아르떼뮤지엄',
                  subtitle: '미디어 아트 체험',
                },
                {
                  id: generateId(),
                  order: 5,
                  time: '16:30',
                  duration: '90분',
                  title: '강문해변',
                  subtitle: '해변 산책',
                },
                {
                  id: generateId(),
                  order: 6,
                  time: '18:30',
                  duration: '120분',
                  title: '저녁식사',
                  subtitle: '회센터 또는 물회',
                },
                {
                  id: generateId(),
                  order: 7,
                  time: '20:30',
                  duration: '',
                  title: '숙소 복귀',
                  subtitle: '휴식 및 취침',
                },
              ],
            },
            {
              day: 3,
              date: '3/1 (일)',
              items: [
                {
                  id: generateId(),
                  order: 1,
                  time: '08:00',
                  duration: '60분',
                  title: '조식 및 체크아웃',
                  subtitle: '짐 정리',
                },
                {
                  id: generateId(),
                  order: 2,
                  time: '09:30',
                  duration: '120분',
                  title: '오죽헌/시립박물관',
                  subtitle: '역사 문화 탐방',
                },
                {
                  id: generateId(),
                  order: 3,
                  time: '12:00',
                  duration: '90분',
                  title: '점심식사',
                  subtitle: '강릉 명물 음식',
                },
                {
                  id: generateId(),
                  order: 4,
                  time: '14:00',
                  duration: '180분',
                  title: '강릉 출발 → 서울 도착',
                  subtitle: '귀가',
                },
              ],
            },
          ],
          location: {
            name: '강릉 위스테이독채펜션',
            address: '강원 강릉시 성산면 송두길 46-23',
            naverMapUrl: 'https://naver.me/GdTsE1UE',
            kakaoMapUrl: 'https://place.map.kakao.com/1116450593',
            transport: [
              {
                type: 'KTX',
                routes: [
                  { from: '서울역', to: '강릉역', time: '약 2시간 (최단 112분)' },
                ],
              },
              {
                type: '시외버스',
                routes: [
                  { from: '동서울터미널', to: '강릉터미널', time: '약 3시간' },
                ],
              },
              {
                type: '펜션 이동',
                routes: [
                  { from: '강릉역', to: '위스테이독채펜션', time: '차량 12km (약 20분) / 택시 15,000원' },
                ],
              },
            ],
            note: '* KTX는 사전 예약 필수 / 주말은 예매가 빠르니 미리 구매하세요',
          },
        };

        set((state) => ({
          events: [...state.events, demoEvent],
          activeEventId: id,
        }));

        return id;
      },
    }),
    {
      name: 'event-storage',
      version: STORE_VERSION,
      // 버전이 변경되면 자동으로 초기화되고 마이그레이션 실행
      migrate: (persistedState: any, version: number) => {
        if (version < STORE_VERSION) {
          // 버전이 낮으면 기존 데이터 삭제하고 초기 상태 반환
          return {
            events: [],
            activeEventId: null,
            isAdmin: false,
          };
        }
        return persistedState;
      },
    }
  )
);
