import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack, IoMdAdd, IoMdTrash } from 'react-icons/io';
import { MdSave } from 'react-icons/md';
import { useEventStore } from '../store/useEventStore';
import { EventService } from '../services/eventService';
import type { Event, ContentCard, DaySchedule, ScheduleItem } from '../types/event';
import styles from './EventCreate.module.css';

const generateId = () => crypto.randomUUID();

export const EventCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent, isAdmin } = useEventStore();

  // 권한 확인
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // 기본 상태
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  
  // 메인 콘텐츠
  const [mainContent, setMainContent] = useState<ContentCard[]>([
    { id: generateId(), icon: '', title: '', description: '' }
  ]);

  // 일정
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { day: 1, date: '', items: [] }
  ]);

  // 위치 정보
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [naverMapUrl, setNaverMapUrl] = useState('');
  const [kakaoMapUrl, setKakaoMapUrl] = useState('');
  const [locationNote, setLocationNote] = useState('');

  // 교통편
  const [transportTypes, setTransportTypes] = useState<Array<{ type: string; routes: Array<{ from: string; to: string; time: string }> }>>([
    { type: '', routes: [{ from: '', to: '', time: '' }] }
  ]);

  // 메인 콘텐츠 추가
  const addMainContent = () => {
    setMainContent([...mainContent, { id: generateId(), icon: '', title: '', description: '' }]);
  };

  const removeMainContent = (id: string) => {
    setMainContent(mainContent.filter(c => c.id !== id));
  };

  const updateMainContent = (id: string, field: keyof ContentCard, value: string) => {
    setMainContent(mainContent.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // 일정 추가
  const addDay = () => {
    setSchedules([...schedules, { day: schedules.length + 1, date: '', items: [] }]);
  };

  const removeDay = (day: number) => {
    setSchedules(schedules.filter(s => s.day !== day));
  };

  const updateDayDate = (day: number, date: string) => {
    setSchedules(schedules.map(s => s.day === day ? { ...s, date } : s));
  };

  const addScheduleItem = (day: number) => {
    setSchedules(schedules.map(s => 
      s.day === day 
        ? { ...s, items: [...s.items, { id: generateId(), order: s.items.length + 1, time: '', duration: '', title: '', subtitle: '' }] }
        : s
    ));
  };

  const removeScheduleItem = (day: number, itemId: string) => {
    setSchedules(schedules.map(s => 
      s.day === day 
        ? { ...s, items: s.items.filter(i => i.id !== itemId) }
        : s
    ));
  };

  const updateScheduleItem = (day: number, itemId: string, field: keyof ScheduleItem, value: string | number) => {
    setSchedules(schedules.map(s => 
      s.day === day 
        ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) }
        : s
    ));
  };

  // 교통편 추가
  const addTransportType = () => {
    setTransportTypes([...transportTypes, { type: '', routes: [{ from: '', to: '', time: '' }] }]);
  };

  const removeTransportType = (index: number) => {
    setTransportTypes(transportTypes.filter((_, i) => i !== index));
  };

  const updateTransportType = (index: number, type: string) => {
    setTransportTypes(transportTypes.map((t, i) => i === index ? { ...t, type } : t));
  };

  const addTransportRoute = (typeIndex: number) => {
    setTransportTypes(transportTypes.map((t, i) => 
      i === typeIndex 
        ? { ...t, routes: [...t.routes, { from: '', to: '', time: '' }] }
        : t
    ));
  };

  const removeTransportRoute = (typeIndex: number, routeIndex: number) => {
    setTransportTypes(transportTypes.map((t, i) => 
      i === typeIndex 
        ? { ...t, routes: t.routes.filter((_, ri) => ri !== routeIndex) }
        : t
    ));
  };

  const updateTransportRoute = (typeIndex: number, routeIndex: number, field: 'from' | 'to' | 'time', value: string) => {
    setTransportTypes(transportTypes.map((t, i) => 
      i === typeIndex 
        ? { ...t, routes: t.routes.map((r, ri) => ri === routeIndex ? { ...r, [field]: value } : r) }
        : t
    ));
  };

  // 저장
  const handleSave = async () => {
    if (!title.trim()) {
      alert('이벤트 제목을 입력해주세요.');
      return;
    }

    const newEvent: Omit<Event, 'id'> = {
      title,
      subtitle: subtitle || undefined,
      isActive: false,
      mainContent: mainContent.filter(c => c.title.trim() && c.description.trim()),
      schedules: schedules
        .filter(s => s.date.trim() && s.items.length > 0)
        .map(s => ({
          ...s,
          items: s.items.filter(i => i.title.trim() && i.time.trim())
        })),
      location: {
        name: locationName,
        address: locationAddress,
        naverMapUrl: naverMapUrl || undefined,
        kakaoMapUrl: kakaoMapUrl || undefined,
        transport: transportTypes
          .filter(t => t.type.trim() && t.routes.some(r => r.from.trim() && r.to.trim()))
          .map(t => ({
            type: t.type,
            routes: t.routes.filter(r => r.from.trim() && r.to.trim())
          })),
        note: locationNote || undefined,
      }
    };

    const id = createEvent(newEvent as Event);
    if (id) {
      // Supabase에도 저장 (기본 정보만)
      try {
        await EventService.createEvent(newEvent.title, newEvent.subtitle);
        alert('이벤트가 생성되었습니다!');
        navigate('/admin/dashboard');
      } catch (error) {
        console.error('Supabase 저장 실패:', error);
        // 로컬 스토리지에는 저장되었으니 계속 진행
        alert('이벤트가 생성되었습니다! (로컬 저장)');
        navigate('/admin/dashboard');
      }
    } else {
      alert('이벤트 생성에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} className={styles.backBtn}>
          <IoMdArrowBack size={24} />
          <span>돌아가기</span>
        </button>
        <h1>이벤트 만들기</h1>
        <button onClick={handleSave} className={styles.saveBtn}>
          <MdSave size={24} />
          <span>저장</span>
        </button>
      </header>

      <div className={styles.content}>
        {/* Editor - Left Side */}
        <div className={styles.editor}>
          {/* 기본 정보 */}
          <section className={styles.section}>
            <h2>기본 정보</h2>
            <div className={styles.formGroup}>
              <label>이벤트 제목 *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 강릉 2박 3일 여행"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>부제목 (선택)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="예: 동해바다와 함께하는 힐링"
                className={styles.input}
              />
            </div>
          </section>

          {/* 메인 콘텐츠 */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>메인 콘텐츠</h2>
              <button onClick={addMainContent} className={styles.addBtn}>
                <IoMdAdd size={20} />
                추가
              </button>
            </div>
            {mainContent.map((card, index) => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span>카드 {index + 1}</span>
                  {mainContent.length > 1 && (
                    <button onClick={() => removeMainContent(card.id)} className={styles.deleteBtn}>
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>아이콘 (이모지)</label>
                  <input
                    type="text"
                    value={card.icon}
                    onChange={(e) => updateMainContent(card.id, 'icon', e.target.value)}
                    placeholder="예: 🌊"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>제목</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateMainContent(card.id, 'title', e.target.value)}
                    placeholder="예: 아름다운 동해바다"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>설명</label>
                  <textarea
                    value={card.description}
                    onChange={(e) => updateMainContent(card.id, 'description', e.target.value)}
                    placeholder="예: 정동진, 안목해변에서 펼쳐지는 푸른 바다"
                    className={styles.textarea}
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* 일정 */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>타임테이블</h2>
              <button onClick={addDay} className={styles.addBtn}>
                <IoMdAdd size={20} />
                Day 추가
              </button>
            </div>
            {schedules.map((day) => (
              <div key={day.day} className={styles.dayCard}>
                <div className={styles.cardHeader}>
                  <span>Day {day.day}</span>
                  {schedules.length > 1 && (
                    <button onClick={() => removeDay(day.day)} className={styles.deleteBtn}>
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>날짜</label>
                  <input
                    type="text"
                    value={day.date}
                    onChange={(e) => updateDayDate(day.day, e.target.value)}
                    placeholder="예: 3/14 (금)"
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.scheduleItems}>
                  <div className={styles.sectionHeader}>
                    <h4>일정</h4>
                    <button onClick={() => addScheduleItem(day.day)} className={styles.addSmallBtn}>
                      <IoMdAdd size={16} />
                    </button>
                  </div>
                  {day.items.map((item) => (
                    <div key={item.id} className={styles.scheduleItem}>
                      <div className={styles.scheduleItemHeader}>
                        <span>{item.order}</span>
                        <button onClick={() => removeScheduleItem(day.day, item.id)} className={styles.deleteSmallBtn}>
                          <IoMdTrash size={14} />
                        </button>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>시간</label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => updateScheduleItem(day.day, item.id, 'time', e.target.value)}
                            placeholder="07:00"
                            className={styles.inputSmall}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>소요시간</label>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={(e) => updateScheduleItem(day.day, item.id, 'duration', e.target.value)}
                            placeholder="60분"
                            className={styles.inputSmall}
                          />
                        </div>
                      </div>
                      <div className={styles.formGroup}>
                        <label>제목</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateScheduleItem(day.day, item.id, 'title', e.target.value)}
                          placeholder="서울 출발"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>부제목</label>
                        <input
                          type="text"
                          value={item.subtitle}
                          onChange={(e) => updateScheduleItem(day.day, item.id, 'subtitle', e.target.value)}
                          placeholder="KTX 이용"
                          className={styles.input}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* 위치 정보 */}
          <section className={styles.section}>
            <h2>오시는 길</h2>
            <div className={styles.formGroup}>
              <label>장소명</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="강릉역"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>주소</label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="강원도 강릉시 진경대로 1"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>네이버 지도 URL</label>
              <input
                type="url"
                value={naverMapUrl}
                onChange={(e) => setNaverMapUrl(e.target.value)}
                placeholder="https://naver.me/..."
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>카카오맵 URL</label>
              <input
                type="url"
                value={kakaoMapUrl}
                onChange={(e) => setKakaoMapUrl(e.target.value)}
                placeholder="https://place.map.kakao.com/..."
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>참고사항</label>
              <textarea
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                placeholder="* KTX는 사전 예약 필수"
                className={styles.textarea}
                rows={2}
              />
            </div>

            {/* 교통편 */}
            <div className={styles.sectionHeader}>
              <h3>교통편</h3>
              <button onClick={addTransportType} className={styles.addBtn}>
                <IoMdAdd size={20} />
                추가
              </button>
            </div>
            {transportTypes.map((transport, tIndex) => (
              <div key={tIndex} className={styles.transportCard}>
                <div className={styles.cardHeader}>
                  <input
                    type="text"
                    value={transport.type}
                    onChange={(e) => updateTransportType(tIndex, e.target.value)}
                    placeholder="예: KTX, 시외버스"
                    className={styles.inputInline}
                  />
                  {transportTypes.length > 1 && (
                    <button onClick={() => removeTransportType(tIndex)} className={styles.deleteBtn}>
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
                <div className={styles.routes}>
                  {transport.routes.map((route, rIndex) => (
                    <div key={rIndex} className={styles.routeItem}>
                      <input
                        type="text"
                        value={route.from}
                        onChange={(e) => updateTransportRoute(tIndex, rIndex, 'from', e.target.value)}
                        placeholder="출발지"
                        className={styles.inputSmall}
                      />
                      <span>→</span>
                      <input
                        type="text"
                        value={route.to}
                        onChange={(e) => updateTransportRoute(tIndex, rIndex, 'to', e.target.value)}
                        placeholder="도착지"
                        className={styles.inputSmall}
                      />
                      <input
                        type="text"
                        value={route.time}
                        onChange={(e) => updateTransportRoute(tIndex, rIndex, 'time', e.target.value)}
                        placeholder="시간"
                        className={styles.inputSmall}
                      />
                      {transport.routes.length > 1 && (
                        <button onClick={() => removeTransportRoute(tIndex, rIndex)} className={styles.deleteSmallBtn}>
                          <IoMdTrash size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addTransportRoute(tIndex)} className={styles.addSmallBtn}>
                    <IoMdAdd size={16} />
                    노선 추가
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Preview - Right Side */}
        <div className={styles.preview}>
          <div className={styles.previewSticky}>
            <h3>미리보기</h3>
            <div className={styles.previewContent}>
              {/* Header */}
              <div className={styles.previewHeader}>
                <h1>{title || '이벤트 제목'}</h1>
                {subtitle && <p>{subtitle}</p>}
              </div>

              {/* Main Content */}
              {mainContent.some(c => c.title || c.description) && (
                <div className={styles.previewSection}>
                  {mainContent.filter(c => c.title || c.description).map(card => (
                    <div key={card.id} className={styles.previewCard}>
                      <div className={styles.previewIcon}>{card.icon || '❓'}</div>
                      <div>
                        <h4>{card.title || '제목 없음'}</h4>
                        <p>{card.description || '설명 없음'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Schedule */}
              {schedules.some(s => s.date && s.items.length > 0) && (
                <div className={styles.previewSection}>
                  <h3>타임테이블</h3>
                  {schedules.filter(s => s.date && s.items.length > 0).map(day => (
                    <div key={day.day} className={styles.previewDay}>
                      <div className={styles.previewDayHeader}>
                        <span>Day {day.day}</span>
                        <span>{day.date}</span>
                      </div>
                      {day.items.map(item => (
                        <div key={item.id} className={styles.previewScheduleItem}>
                          <div className={styles.previewOrder}>{item.order}</div>
                          <div>
                            <div className={styles.previewTime}>
                              {item.time} {item.duration && <span>{item.duration}</span>}
                            </div>
                            <div className={styles.previewTitle}>{item.title}</div>
                            {item.subtitle && <div className={styles.previewSubtitle}>{item.subtitle}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Location */}
              {(locationName || locationAddress) && (
                <div className={styles.previewSection}>
                  <h3>오시는 길</h3>
                  <div className={styles.previewLocation}>
                    <h4>{locationName || '장소명'}</h4>
                    <p>{locationAddress || '주소'}</p>
                    {transportTypes.some(t => t.type && t.routes.length > 0) && (
                      <div className={styles.previewTransport}>
                        {transportTypes.filter(t => t.type && t.routes.length > 0).map((transport, i) => (
                          <div key={i}>
                            <strong>{transport.type}</strong>
                            {transport.routes.map((route, ri) => (
                              <div key={ri} className={styles.previewRoute}>
                                {route.from} → {route.to}: {route.time}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
