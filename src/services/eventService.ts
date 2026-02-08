import { supabase } from '../lib/supabase'
import type { Event } from '../types/event'

export class EventService {
  /**
   * 특정 이벤트 ID로 전체 데이터 가져오기
   */
  static async getEventById(eventId: string): Promise<Event | null> {
    try {
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (eventError || !event) {
        return null
      }

      // 메인 콘텐츠
      const { data: mainContent } = await supabase
        .from('main_content')
        .select('*')
        .eq('event_id', event.id)
        .order('display_order', { ascending: true })

      // 일정
      const { data: daySchedules } = await supabase
        .from('day_schedules')
        .select(`*, schedule_items (*)`)
        .eq('event_id', event.id)
        .order('day', { ascending: true })

      // 위치 정보
      const { data: location } = await supabase
        .from('locations')
        .select(`*, transport_routes (*)`)
        .eq('event_id', event.id)
        .single()

      // 데이터 변환
      const schedules = (daySchedules || []).map((ds: any) => ({
        day: ds.day,
        date: ds.date,
        items: (ds.schedule_items || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((item: any) => ({
            id: item.id,
            order: item.display_order,
            time: item.time,
            duration: item.duration || '',
            title: item.title,
            subtitle: item.subtitle || '',
            isHighlight: item.is_highlight || false,
          })),
      }))

      // 교통편 그룹화
      const transportMap = new Map<string, any[]>()
      if (location?.transport_routes) {
        ;(location.transport_routes || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .forEach((route: any) => {
            if (!transportMap.has(route.type)) {
              transportMap.set(route.type, [])
            }
            transportMap.get(route.type)!.push({
              from: route.from_place,
              to: route.to_place,
              time: route.time,
            })
          })
      }

      const transport = Array.from(transportMap.entries()).map(
        ([type, routes]) => ({
          type,
          routes,
        })
      )

      return {
        id: event.id,
        title: event.title,
        subtitle: event.subtitle || undefined,
        isActive: event.is_active,
        mainContent: (mainContent || []).map((c: any) => ({
          id: c.id,
          icon: c.icon,
          title: c.title,
          description: c.description,
        })),
        schedules,
        location: location
          ? {
              name: location.name,
              address: location.address,
              naverMapUrl: location.naver_map_url || undefined,
              kakaoMapUrl: location.kakao_map_url || undefined,
              transport,
              note: location.note || undefined,
            }
          : {
              name: '',
              address: '',
              transport: [],
            },
      }
    } catch (error) {
      console.error('Error in getEventById:', error)
      return null
    }
  }

  /**
   * 활성화된 이벤트 가져오기
   */
  static async getActiveEvent(): Promise<Event | null> {
    try {
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .single()

      if (eventError || !event) {
        return null
      }

      // 메인 콘텐츠 가져오기
      const { data: mainContent, error: mainContentError } = await supabase
        .from('main_content')
        .select('*')
        .eq('event_id', event.id)
        .order('display_order', { ascending: true })

      if (mainContentError) {
        console.error('Error fetching main content:', mainContentError)
        return null
      }

      // 일정 가져오기
      const { data: daySchedules, error: daySchedulesError } = await supabase
        .from('day_schedules')
        .select(
          `
          *,
          schedule_items (*)
        `
        )
        .eq('event_id', event.id)
        .order('day', { ascending: true })

      if (daySchedulesError) {
        console.error('Error fetching schedules:', daySchedulesError)
        return null
      }

      // 위치 정보 가져오기
      const { data: location, error: locationError } = await supabase
        .from('locations')
        .select(
          `
          *,
          transport_routes (*)
        `
        )
        .eq('event_id', event.id)
        .single()

      if (locationError || !location) {
        console.error('Error fetching location:', locationError)
        return null
      }

      // 데이터 변환
      const schedules = daySchedules.map((ds: any) => ({
        day: ds.day,
        date: ds.date,
        items: (ds.schedule_items || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((item: any) => ({
            id: item.id,
            order: item.display_order,
            time: item.time,
            duration: item.duration || '',
            title: item.title,
            subtitle: item.subtitle || '',
            isHighlight: item.is_highlight || false,
          })),
      }))

      // 교통편 그룹화
      const transportMap = new Map<string, any[]>()
      ;(location.transport_routes || []).forEach((route: any) => {
        if (!transportMap.has(route.type)) {
          transportMap.set(route.type, [])
        }
        transportMap.get(route.type)!.push({
          from: route.from_place,
          to: route.to_place,
          time: route.time,
        })
      })

      const transport = Array.from(transportMap.entries()).map(
        ([type, routes]) => ({
          type,
          routes,
        })
      )

      return {
        id: event.id,
        title: event.title,
        subtitle: event.subtitle || undefined,
        isActive: event.is_active,
        mainContent: mainContent.map((c: any) => ({
          id: c.id,
          icon: c.icon,
          title: c.title,
          description: c.description,
        })),
        schedules,
        location: {
          name: location.name,
          address: location.address,
          naverMapUrl: location.naver_map_url || undefined,
          kakaoMapUrl: location.kakao_map_url || undefined,
          transport,
          note: location.note || undefined,
        },
      }
    } catch (error) {
      console.error('Error in getActiveEvent:', error)
      return null
    }
  }

  /**
   * 모든 이벤트 목록 가져오기
   */
  static async getAllEvents(): Promise<Event[]> {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select(
          `
          *,
          main_content (count),
          day_schedules (count)
        `
        )
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching events:', error)
        return []
      }

      return events.map((e: any) => ({
        id: e.id,
        title: e.title,
        subtitle: e.subtitle,
        isActive: e.is_active,
        mainContent: [],
        schedules: [],
        location: {
          name: '',
          address: '',
          transport: [],
        },
      }))
    } catch (error) {
      console.error('Error in getAllEvents:', error)
      return []
    }
  }

  /**
   * 이벤트 활성화/비활성화
   */
  static async setActiveEvent(eventId: string): Promise<boolean> {
    try {
      // 모든 이벤트 비활성화
      await supabase
        .from('events')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000')

      // 선택한 이벤트 활성화
      const { error } = await supabase
        .from('events')
        .update({ is_active: true })
        .eq('id', eventId)

      if (error) {
        console.error('Error setting active event:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in setActiveEvent:', error)
      return false
    }
  }

  /**
   * 이벤트 생성 (기본 정보만)
   */
  static async createEvent(
    title: string,
    subtitle?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title,
          subtitle,
          is_active: false,
        })
        .select()
        .single()

      if (error || !data) {
        console.error('Error creating event:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('Error in createEvent:', error)
      return null
    }
  }

  /**
   * 이벤트 삭제
   */
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('events').delete().eq('id', eventId)

      if (error) {
        console.error('Error deleting event:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteEvent:', error)
      return false
    }
  }

  /**
   * 이벤트 전체 데이터 저장 (upsert 방식)
   * createEvent와 달리 mainContent, schedules, location 등 전체 데이터를 DB에 저장
   */
  static async saveFullEvent(event: Event): Promise<string | null> {
    try {
      // 1. events 테이블 upsert
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .upsert({
          id: event.id || undefined,
          title: event.title,
          subtitle: event.subtitle || null,
          is_active: event.isActive ?? false,
        })
        .select()
        .single()

      if (eventError || !eventData) {
        console.error('Error saving event:', eventError)
        return null
      }

      const eventId = eventData.id

      // 2. 기존 관련 데이터 삭제 (cascade가 아닌 경우 수동 삭제)
      await supabase.from('main_content').delete().eq('event_id', eventId)

      // day_schedules 삭제 시 schedule_items도 함께 삭제해야 함
      const { data: existingSchedules } = await supabase
        .from('day_schedules')
        .select('id')
        .eq('event_id', eventId)

      if (existingSchedules && existingSchedules.length > 0) {
        const scheduleIds = existingSchedules.map((s: any) => s.id)
        await supabase
          .from('schedule_items')
          .delete()
          .in('day_schedule_id', scheduleIds)
      }
      await supabase.from('day_schedules').delete().eq('event_id', eventId)

      // locations & transport_routes 삭제
      const { data: existingLocations } = await supabase
        .from('locations')
        .select('id')
        .eq('event_id', eventId)

      if (existingLocations && existingLocations.length > 0) {
        const locationIds = existingLocations.map((l: any) => l.id)
        await supabase
          .from('transport_routes')
          .delete()
          .in('location_id', locationIds)
      }
      await supabase.from('locations').delete().eq('event_id', eventId)

      // 3. main_content 삽입
      if (event.mainContent && event.mainContent.length > 0) {
        const mainContentRows = event.mainContent.map((c, i) => ({
          event_id: eventId,
          icon: c.icon,
          title: c.title,
          description: c.description,
          display_order: i + 1,
        }))
        const { error: mcError } = await supabase
          .from('main_content')
          .insert(mainContentRows)
        if (mcError) console.error('Error saving main_content:', mcError)
      }

      // 4. day_schedules + schedule_items 삽입
      if (event.schedules && event.schedules.length > 0) {
        for (const schedule of event.schedules) {
          const { data: dsData, error: dsError } = await supabase
            .from('day_schedules')
            .insert({
              event_id: eventId,
              day: schedule.day,
              date: schedule.date,
            })
            .select()
            .single()

          if (dsError || !dsData) {
            console.error('Error saving day_schedule:', dsError)
            continue
          }

          if (schedule.items && schedule.items.length > 0) {
            const itemRows = schedule.items.map((item, i) => ({
              day_schedule_id: dsData.id,
              display_order: item.order || i + 1,
              time: item.time,
              duration: item.duration || null,
              title: item.title,
              subtitle: item.subtitle || null,
              is_highlight: item.isHighlight || false,
            }))
            const { error: siError } = await supabase
              .from('schedule_items')
              .insert(itemRows)
            if (siError) console.error('Error saving schedule_items:', siError)
          }
        }
      }

      // 5. location + transport_routes 삽입
      if (event.location && event.location.name) {
        const { data: locData, error: locError } = await supabase
          .from('locations')
          .insert({
            event_id: eventId,
            name: event.location.name,
            address: event.location.address,
            naver_map_url: event.location.naverMapUrl || null,
            kakao_map_url: event.location.kakaoMapUrl || null,
            note: event.location.note || null,
          })
          .select()
          .single()

        if (locError || !locData) {
          console.error('Error saving location:', locError)
        } else if (
          event.location.transport &&
          event.location.transport.length > 0
        ) {
          const transportRows: any[] = []
          let order = 1
          for (const t of event.location.transport) {
            for (const route of t.routes) {
              transportRows.push({
                location_id: locData.id,
                type: t.type,
                from_place: route.from,
                to_place: route.to,
                time: route.time,
                display_order: order++,
              })
            }
          }
          if (transportRows.length > 0) {
            const { error: trError } = await supabase
              .from('transport_routes')
              .insert(transportRows)
            if (trError)
              console.error('Error saving transport_routes:', trError)
          }
        }
      }

      return eventId
    } catch (error) {
      console.error('Error in saveFullEvent:', error)
      return null
    }
  }

  /**
   * 이벤트 업데이트 (기본 정보만)
   */
  static async updateEvent(
    eventId: string,
    updates: { title?: string; subtitle?: string; is_active?: boolean }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)

      if (error) {
        console.error('Error updating event:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateEvent:', error)
      return false
    }
  }
}
