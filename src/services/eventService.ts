import { supabase } from '../lib/supabase';
import type { Event } from '../types/event';

export class EventService {
  /**
   * 활성화된 이벤트 가져오기
   */
  static async getActiveEvent(): Promise<Event | null> {
    try {
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .single();

      if (eventError || !event) {
        return null;
      }

      // 메인 콘텐츠 가져오기
      const { data: mainContent, error: mainContentError } = await supabase
        .from('main_content')
        .select('*')
        .eq('event_id', event.id)
        .order('display_order', { ascending: true });

      if (mainContentError) {
        console.error('Error fetching main content:', mainContentError);
        return null;
      }

      // 일정 가져오기
      const { data: daySchedules, error: daySchedulesError } = await supabase
        .from('day_schedules')
        .select(`
          *,
          schedule_items (*)
        `)
        .eq('event_id', event.id)
        .order('day', { ascending: true });

      if (daySchedulesError) {
        console.error('Error fetching schedules:', daySchedulesError);
        return null;
      }

      // 위치 정보 가져오기
      const { data: location, error: locationError } = await supabase
        .from('locations')
        .select(`
          *,
          transport_routes (*)
        `)
        .eq('event_id', event.id)
        .single();

      if (locationError || !location) {
        console.error('Error fetching location:', locationError);
        return null;
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
          })),
      }));

      // 교통편 그룹화
      const transportMap = new Map<string, any[]>();
      (location.transport_routes || []).forEach((route: any) => {
        if (!transportMap.has(route.type)) {
          transportMap.set(route.type, []);
        }
        transportMap.get(route.type)!.push({
          from: route.from_place,
          to: route.to_place,
          time: route.time,
        });
      });

      const transport = Array.from(transportMap.entries()).map(([type, routes]) => ({
        type,
        routes,
      }));

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
      };
    } catch (error) {
      console.error('Error in getActiveEvent:', error);
      return null;
    }
  }

  /**
   * 모든 이벤트 목록 가져오기
   */
  static async getAllEvents(): Promise<Event[]> {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          main_content (count),
          day_schedules (count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
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
      }));
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      return [];
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
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // 선택한 이벤트 활성화
      const { error } = await supabase
        .from('events')
        .update({ is_active: true })
        .eq('id', eventId);

      if (error) {
        console.error('Error setting active event:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in setActiveEvent:', error);
      return false;
    }
  }

  /**
   * 이벤트 생성 (기본 정보만)
   */
  static async createEvent(title: string, subtitle?: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title,
          subtitle,
          is_active: false,
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating event:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in createEvent:', error);
      return null;
    }
  }

  /**
   * 이벤트 삭제
   */
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      return false;
    }
  }
}
