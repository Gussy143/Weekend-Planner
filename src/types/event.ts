export interface ContentCard {
  id: string
  icon: string
  title: string
  description: string
  imageUrl?: string        // 아이콘 대신 이미지 사용 시
  detailText?: string      // 상세 팝업 텍스트
  detailImageUrl?: string  // 상세 팝업 이미지
  isHighlight?: boolean    // 하이라이트 표시
}

export interface ScheduleItem {
  id: string
  order: number
  time: string
  duration: string // "60분"
  title: string
  subtitle?: string
  isHighlight?: boolean
}

export interface DaySchedule {
  day: number
  date: string // "2/27 (금)"
  items: ScheduleItem[]
}

export interface TransportInfo {
  type: string // "첫째날 [금]", "돌째날 [토]"
  routes: {
    from: string
    to: string
    time: string
  }[]
}

export interface LocationInfo {
  name: string
  address: string
  mapUrl?: string
  naverMapUrl?: string
  kakaoMapUrl?: string
  transport: TransportInfo[]
  note?: string
  pensionUrl?: string
  pensionLinkTitle?: string
}

export interface Event {
  id: string
  title: string
  subtitle?: string
  isActive: boolean // 현재 표시할 이벤트인지
  backgroundType?: 'default' | 'color' | 'gradient' | 'image'
  backgroundValue?: string
  mainContent: ContentCard[]
  schedules: DaySchedule[]
  location: LocationInfo
}

export interface EventStore {
  events: Event[]
  activeEventId: string | null

  // Event actions
  getActiveEvent: () => Event | undefined
  setActiveEvent: (eventId: string) => void
  createEvent: (event: Omit<Event, 'id'>) => string
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void

  // Admin
  isAdmin: boolean
  login: (username: string, password: string) => boolean
  logout: () => void

  // Seed demo data
  seedDemoEvent: () => string
}
