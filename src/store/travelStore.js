import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Mock data for initial development
const mockTrips = [
  {
    id: '1',
    name: '제주도 여름 여행',
    startDate: '2026-08-15',
    endDate: '2026-08-18',
    budget: 1200000,
    accommodation: '제주 OO 호텔',
    participants: [
      { id: 'u1', name: '김철수', role: 'organizer' },
      { id: 'u2', name: '이영희', role: 'participant' },
      { id: 'u3', name: '박민수', role: 'participant' },
      { id: 'u4', name: '정수진', role: 'participant' },
    ],
    schedules: [
      {
        id: 's1',
        day: 1,
        title: 'Day 1: 도착 및 중문',
        description: '공항 → 중문 해수욕장 → 저녁 식사',
        date: '2026-08-15',
      },
      {
        id: 's2',
        day: 2,
        title: 'Day 2: 성산 일출봉',
        description: '일출 → 성산 일출봉 → 섭지코지',
        date: '2026-08-16',
      },
      {
        id: 's3',
        day: 3,
        title: 'Day 3: 한라산 등반',
        description: '한라산 어리목 코스',
        date: '2026-08-17',
      },
    ],
    createdAt: '2026-02-01',
  },
  {
    id: '2',
    name: '부산 주말 여행',
    startDate: '2026-07-05',
    endDate: '2026-07-07',
    budget: 800000,
    accommodation: '해운대 호텔',
    participants: [
      { id: 'u1', name: '김철수', role: 'organizer' },
      { id: 'u5', name: '최민지', role: 'participant' },
      { id: 'u6', name: '강호동', role: 'participant' },
    ],
    schedules: [],
    createdAt: '2026-02-05',
  },
]

// == Zustand Store ==
export const useTravelStore = create(
  persist(
    (set, get) => ({
      // State
      trips: mockTrips,
      currentUser: { id: 'u1', name: '김철수' }, // Mock current user

      // Actions: Trip CRUD
      addTrip: trip => {
        const newTrip = {
          ...trip,
          id: Date.now().toString(),
          schedules: [],
          participants: [
            { ...get().currentUser, role: 'organizer' },
            ...(trip.participants || []),
          ],
          createdAt: new Date().toISOString(),
        }
        set(state => ({ trips: [...state.trips, newTrip] }))
        return newTrip.id
      },

      updateTrip: (tripId, updates) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId ? { ...trip, ...updates } : trip
          ),
        }))
      },

      deleteTrip: tripId => {
        set(state => ({
          trips: state.trips.filter(trip => trip.id !== tripId),
        }))
      },

      getTrip: tripId => {
        return get().trips.find(trip => trip.id === tripId)
      },

      // Actions: Schedule CRUD
      addSchedule: (tripId, schedule) => {
        const newSchedule = {
          ...schedule,
          id: Date.now().toString(),
        }
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? { ...trip, schedules: [...trip.schedules, newSchedule] }
              : trip
          ),
        }))
      },

      updateSchedule: (tripId, scheduleId, updates) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? {
                  ...trip,
                  schedules: trip.schedules.map(schedule =>
                    schedule.id === scheduleId
                      ? { ...schedule, ...updates }
                      : schedule
                  ),
                }
              : trip
          ),
        }))
      },

      deleteSchedule: (tripId, scheduleId) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? {
                  ...trip,
                  schedules: trip.schedules.filter(s => s.id !== scheduleId),
                }
              : trip
          ),
        }))
      },

      // Actions: Participant management
      addParticipant: (tripId, participant) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? {
                  ...trip,
                  participants: [
                    ...trip.participants,
                    { ...participant, role: 'participant' },
                  ],
                }
              : trip
          ),
        }))
      },

      removeParticipant: (tripId, participantId) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? {
                  ...trip,
                  participants: trip.participants.filter(
                    p => p.id !== participantId
                  ),
                }
              : trip
          ),
        }))
      },

      // Helper: Check if current user is organizer
      isOrganizer: tripId => {
        const trip = get().getTrip(tripId)
        if (!trip) return false
        const currentUserId = get().currentUser.id
        return trip.participants.some(
          p => p.id === currentUserId && p.role === 'organizer'
        )
      },
    }),
    {
      name: 'travel-planner-storage',
    }
  )
)
