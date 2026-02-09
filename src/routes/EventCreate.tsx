import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowBack, IoMdAdd, IoMdTrash, IoMdEye } from 'react-icons/io'
import { IoLocationSharp, IoClose } from 'react-icons/io5'
import { MdSave, MdDirectionsBus } from 'react-icons/md'
import { useEventStore } from '../store/useEventStore'
import { EventService } from '../services/eventService'
import { IconPicker, getIconComponent } from '../components/IconPicker'
import type {
  Event,
  ContentCard,
  DaySchedule,
  ScheduleItem,
} from '../types/event'
import styles from './EventCreate.module.css'

const generateId = () => crypto.randomUUID()

export const EventCreate: React.FC = () => {
  const navigate = useNavigate()
  const { createEvent, isAdmin } = useEventStore()

  // 권한 확인
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login')
    }
  }, [isAdmin, navigate])

  // 기본 상태
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')

  // 메인 콘텐츠
  const [mainContent, setMainContent] = useState<ContentCard[]>([
    { id: generateId(), icon: '', title: '', description: '' },
  ])

  // 일정
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { day: 1, date: '', items: [] },
  ])

  // 위치 정보
  const [locationName, setLocationName] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [naverMapUrl, setNaverMapUrl] = useState('')
  const [kakaoMapUrl, setKakaoMapUrl] = useState('')
  const [locationNote, setLocationNote] = useState('')
  const [pensionUrl, setPensionUrl] = useState('')
  const [pensionLinkTitle, setPensionLinkTitle] = useState('')

  // 모바일 미리보기
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  // 교통편
  const [transportTypes, setTransportTypes] = useState<
    Array<{
      type: string
      routes: Array<{ from: string; to: string; time: string }>
    }>
  >([{ type: '', routes: [{ from: '', to: '', time: '' }] }])

  // 메인 콘텐츠 추가
  const addMainContent = () => {
    setMainContent([
      ...mainContent,
      { id: generateId(), icon: '', title: '', description: '' },
    ])
  }

  const removeMainContent = (id: string) => {
    setMainContent(mainContent.filter(c => c.id !== id))
  }

  const updateMainContent = (
    id: string,
    field: keyof ContentCard,
    value: string
  ) => {
    setMainContent(
      mainContent.map(c => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  // 일정 추가
  const addDay = () => {
    setSchedules([
      ...schedules,
      { day: schedules.length + 1, date: '', items: [] },
    ])
  }

  const removeDay = (day: number) => {
    setSchedules(schedules.filter(s => s.day !== day))
  }

  const updateDayDate = (day: number, date: string) => {
    setSchedules(schedules.map(s => (s.day === day ? { ...s, date } : s)))
  }

  const addScheduleItem = (day: number) => {
    setSchedules(
      schedules.map(s =>
        s.day === day
          ? {
              ...s,
              items: [
                ...s.items,
                {
                  id: generateId(),
                  order: s.items.length + 1,
                  time: '',
                  duration: '',
                  title: '',
                  subtitle: '',
                  isHighlight: false,
                },
              ],
            }
          : s
      )
    )
  }

  const removeScheduleItem = (day: number, itemId: string) => {
    setSchedules(
      schedules.map(s =>
        s.day === day
          ? { ...s, items: s.items.filter(i => i.id !== itemId) }
          : s
      )
    )
  }

  const updateScheduleItem = (
    day: number,
    itemId: string,
    field: keyof ScheduleItem,
    value: string | number | boolean
  ) => {
    setSchedules(
      schedules.map(s =>
        s.day === day
          ? {
              ...s,
              items: s.items.map(i =>
                i.id === itemId ? { ...i, [field]: value } : i
              ),
            }
          : s
      )
    )
  }

  // 교통편 추가
  const addTransportType = () => {
    setTransportTypes([
      ...transportTypes,
      { type: '', routes: [{ from: '', to: '', time: '' }] },
    ])
  }

  const removeTransportType = (index: number) => {
    setTransportTypes(transportTypes.filter((_, i) => i !== index))
  }

  const updateTransportType = (index: number, type: string) => {
    setTransportTypes(
      transportTypes.map((t, i) => (i === index ? { ...t, type } : t))
    )
  }

  const addTransportRoute = (typeIndex: number) => {
    setTransportTypes(
      transportTypes.map((t, i) =>
        i === typeIndex
          ? { ...t, routes: [...t.routes, { from: '', to: '', time: '' }] }
          : t
      )
    )
  }

  const removeTransportRoute = (typeIndex: number, routeIndex: number) => {
    setTransportTypes(
      transportTypes.map((t, i) =>
        i === typeIndex
          ? { ...t, routes: t.routes.filter((_, ri) => ri !== routeIndex) }
          : t
      )
    )
  }

  const updateTransportRoute = (
    typeIndex: number,
    routeIndex: number,
    field: 'from' | 'to' | 'time',
    value: string
  ) => {
    setTransportTypes(
      transportTypes.map((t, i) =>
        i === typeIndex
          ? {
              ...t,
              routes: t.routes.map((r, ri) =>
                ri === routeIndex ? { ...r, [field]: value } : r
              ),
            }
          : t
      )
    )
  }

  // 저장
  const handleSave = async () => {
    if (!title.trim()) {
      alert('이벤트 제목을 입력해주세요.')
      return
    }

    const newEvent: Event = {
      id: generateId(),
      title,
      subtitle: subtitle || undefined,
      isActive: false,
      mainContent: mainContent.filter(
        c => c.title.trim() && c.description.trim()
      ),
      schedules: schedules
        .filter(s => s.date.trim() && s.items.length > 0)
        .map(s => ({
          ...s,
          items: s.items.filter(i => i.title.trim() && i.time.trim()),
        })),
      location: {
        name: locationName,
        address: locationAddress,
        naverMapUrl: naverMapUrl || undefined,
        kakaoMapUrl: kakaoMapUrl || undefined,
        transport: transportTypes
          .filter(
            t =>
              t.type.trim() && t.routes.some(r => r.from.trim() && r.to.trim())
          )
          .map(t => ({
            type: t.type,
            routes: t.routes.filter(r => r.from.trim() && r.to.trim()),
          })),
        note: locationNote || undefined,
        pensionUrl: pensionUrl || undefined,
        pensionLinkTitle: pensionLinkTitle || undefined,
      },
    }

    try {
      const savedId = await EventService.saveFullEvent(newEvent)
      if (savedId) {
        // 로컬 스토어에도 저장
        createEvent(newEvent)
        alert('이벤트가 생성되었습니다!')
        navigate('/admin/dashboard')
      } else {
        alert('이벤트 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('저장 실패:', error)
      // 로컬 스토리지에 폴백 저장
      const id = createEvent(newEvent)
      if (id) {
        alert('이벤트가 생성되었습니다! (로컬 저장)')
        navigate('/admin/dashboard')
      } else {
        alert('이벤트 생성에 실패했습니다.')
      }
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className={styles.backBtn}
        >
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
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 강릉 2박 3일 여행"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>부제목 (선택)</label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
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
                    <button
                      onClick={() => removeMainContent(card.id)}
                      className={styles.deleteBtn}
                    >
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>아이콘</label>
                  <IconPicker
                    value={card.icon}
                    onChange={iconName =>
                      updateMainContent(card.id, 'icon', iconName)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>제목</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={e =>
                      updateMainContent(card.id, 'title', e.target.value)
                    }
                    placeholder="예: 아름다운 동해바다"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>설명</label>
                  <textarea
                    value={card.description}
                    onChange={e =>
                      updateMainContent(card.id, 'description', e.target.value)
                    }
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
            {schedules.map(day => (
              <div key={day.day} className={styles.dayCard}>
                <div className={styles.cardHeader}>
                  <span>Day {day.day}</span>
                  {schedules.length > 1 && (
                    <button
                      onClick={() => removeDay(day.day)}
                      className={styles.deleteBtn}
                    >
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>날짜</label>
                  <input
                    type="text"
                    value={day.date}
                    onChange={e => updateDayDate(day.day, e.target.value)}
                    placeholder="예: 3/14 (금)"
                    className={styles.input}
                  />
                </div>

                <div className={styles.scheduleItems}>
                  <div className={styles.sectionHeader}>
                    <h4>일정</h4>
                    <button
                      onClick={() => addScheduleItem(day.day)}
                      className={styles.addSmallBtn}
                    >
                      <IoMdAdd size={16} />
                    </button>
                  </div>
                  {day.items.map(item => (
                    <div key={item.id} className={styles.scheduleItem}>
                      <div className={styles.scheduleItemHeader}>
                        <span>{item.order}</span>
                        <div
                          style={{
                            display: 'flex',
                            gap: '4px',
                            alignItems: 'center',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              updateScheduleItem(
                                day.day,
                                item.id,
                                'isHighlight',
                                !item.isHighlight
                              )
                            }
                            title="중요 일정 하이라이트"
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: item.isHighlight
                                ? '2px solid #667eea'
                                : '2px solid var(--ios-separator)',
                              background: item.isHighlight
                                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                : 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              color: item.isHighlight
                                ? 'white'
                                : 'var(--ios-label-tertiary)',
                              padding: 0,
                              transition: 'all 0.2s',
                            }}
                          >
                            ★
                          </button>
                          <button
                            onClick={() => removeScheduleItem(day.day, item.id)}
                            className={styles.deleteSmallBtn}
                          >
                            <IoMdTrash size={14} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>시간</label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={e =>
                              updateScheduleItem(
                                day.day,
                                item.id,
                                'time',
                                e.target.value
                              )
                            }
                            placeholder="07:00"
                            className={styles.inputSmall}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>소요시간</label>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={e =>
                              updateScheduleItem(
                                day.day,
                                item.id,
                                'duration',
                                e.target.value
                              )
                            }
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
                          onChange={e =>
                            updateScheduleItem(
                              day.day,
                              item.id,
                              'title',
                              e.target.value
                            )
                          }
                          placeholder="서울 출발"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>부제목</label>
                        <input
                          type="text"
                          value={item.subtitle}
                          onChange={e =>
                            updateScheduleItem(
                              day.day,
                              item.id,
                              'subtitle',
                              e.target.value
                            )
                          }
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
                onChange={e => setLocationName(e.target.value)}
                placeholder="강릉역"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>주소</label>
              <input
                type="text"
                value={locationAddress}
                onChange={e => setLocationAddress(e.target.value)}
                placeholder="강원도 강릉시 진경대로 1"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>네이버 지도 URL</label>
              <input
                type="url"
                value={naverMapUrl}
                onChange={e => setNaverMapUrl(e.target.value)}
                placeholder="https://naver.me/..."
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>카카오맵 URL</label>
              <input
                type="url"
                value={kakaoMapUrl}
                onChange={e => setKakaoMapUrl(e.target.value)}
                placeholder="https://place.map.kakao.com/..."
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>참고사항</label>
              <textarea
                value={locationNote}
                onChange={e => setLocationNote(e.target.value)}
                placeholder="* KTX는 사전 예약 필수"
                className={styles.textarea}
                rows={2}
              />
            </div>
            <div className={styles.formGroup}>
              <label>외부 링크 제목</label>
              <input
                type="text"
                value={pensionLinkTitle}
                onChange={e => setPensionLinkTitle(e.target.value)}
                placeholder="예: 펜션 정보 바로가기"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>외부 링크 URL</label>
              <input
                type="url"
                value={pensionUrl}
                onChange={e => setPensionUrl(e.target.value)}
                placeholder="https://..."
                className={styles.input}
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
                    onChange={e => updateTransportType(tIndex, e.target.value)}
                    placeholder="예: KTX, 시외버스"
                    className={styles.inputInline}
                  />
                  {transportTypes.length > 1 && (
                    <button
                      onClick={() => removeTransportType(tIndex)}
                      className={styles.deleteBtn}
                    >
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
                        onChange={e =>
                          updateTransportRoute(
                            tIndex,
                            rIndex,
                            'from',
                            e.target.value
                          )
                        }
                        placeholder="출발지"
                        className={styles.inputSmall}
                      />
                      <span>→</span>
                      <input
                        type="text"
                        value={route.to}
                        onChange={e =>
                          updateTransportRoute(
                            tIndex,
                            rIndex,
                            'to',
                            e.target.value
                          )
                        }
                        placeholder="도착지"
                        className={styles.inputSmall}
                      />
                      <input
                        type="text"
                        value={route.time}
                        onChange={e =>
                          updateTransportRoute(
                            tIndex,
                            rIndex,
                            'time',
                            e.target.value
                          )
                        }
                        placeholder="시간"
                        className={styles.inputSmall}
                      />
                      {transport.routes.length > 1 && (
                        <button
                          onClick={() => removeTransportRoute(tIndex, rIndex)}
                          className={styles.deleteSmallBtn}
                        >
                          <IoMdTrash size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addTransportRoute(tIndex)}
                    className={styles.addSmallBtn}
                  >
                    <IoMdAdd size={16} />
                    노선 추가
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Preview - Right Side (PublicView 동일 디자인) */}
        <div className={styles.preview}>
          <div className={styles.previewSticky}>
            <div className={styles.previewLabel}>미리보기</div>
            <div className={styles.previewPhone}>
              {/* Header */}
              <div className={styles.previewHeader}>
                <h1>{title || '이벤트 제목'}</h1>
                {subtitle && <p>{subtitle}</p>}
              </div>

              {/* Main Content Cards */}
              {mainContent.some(c => c.title || c.description) && (
                <div className={styles.previewSection}>
                  <div className={styles.previewCards}>
                    {mainContent
                      .filter(c => c.title || c.description)
                      .map(card => (
                        <div key={card.id} className={styles.previewCard}>
                          <div className={styles.previewCardIcon}>
                            {(() => {
                              const IC = getIconComponent(card.icon)
                              return IC ? <IC size={22} /> : '❓'
                            })()}
                          </div>
                          <div className={styles.previewCardContent}>
                            <h4>{card.title || '제목 없음'}</h4>
                            <p>{card.description || '설명 없음'}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Timetable */}
              {schedules.some(s => s.date && s.items.length > 0) && (
                <div className={styles.previewSection}>
                  <h2 className={styles.previewSectionTitle}>타임테이블</h2>
                  {schedules
                    .filter(s => s.date && s.items.length > 0)
                    .map(day => (
                      <div key={day.day} className={styles.previewDayCard}>
                        <div className={styles.previewDayHeader}>
                          <span className={styles.previewDayTitle}>
                            Day {day.day}
                          </span>
                          <span className={styles.previewDayDate}>
                            {day.date}
                          </span>
                        </div>
                        <div className={styles.previewTimelineItems}>
                          {day.items.map(item => (
                            <div
                              key={item.id}
                              className={`${styles.previewTimelineItem} ${item.isHighlight ? styles.previewTimelineItemHighlight : ''}`}
                            >
                              <div
                                className={
                                  item.isHighlight
                                    ? styles.previewTimelineDotHighlight
                                    : styles.previewTimelineDot
                                }
                              >
                                {item.order}
                              </div>
                              <div className={styles.previewTimelineContent}>
                                <div className={styles.previewTime}>
                                  {item.time}
                                  {item.duration && (
                                    <span
                                      className={styles.previewTimeDuration}
                                    >
                                      {' '}
                                      · {item.duration}
                                    </span>
                                  )}
                                </div>
                                <div className={styles.previewTimelineTitle}>
                                  {item.title}
                                </div>
                                {item.subtitle && (
                                  <div
                                    className={styles.previewTimelineSubtitle}
                                  >
                                    {item.subtitle}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Location */}
              {(locationName || locationAddress) && (
                <div className={styles.previewSection}>
                  <h2 className={styles.previewSectionTitle}>오시는 길</h2>
                  <div className={styles.previewLocation}>
                    <div className={styles.previewLocationHeader}>
                      <div className={styles.previewLocationIcon}>
                        <IoLocationSharp size={24} />
                      </div>
                      <div>
                        <h3 className={styles.previewLocationName}>
                          {locationName || '장소명'}
                        </h3>
                        <p className={styles.previewLocationAddress}>
                          {locationAddress || '주소'}
                        </p>
                      </div>
                    </div>

                    <div className={styles.previewMapButtons}>
                      <span className={styles.previewMapButton}>
                        네이버 지도
                      </span>
                      <span className={styles.previewMapButton}>카카오맵</span>
                    </div>

                    {transportTypes.some(
                      t => t.type && t.routes.some(r => r.from || r.to)
                    ) && (
                      <div className={styles.previewTransportInfo}>
                        <h4 className={styles.previewTransportTitle}>
                          <MdDirectionsBus
                            size={20}
                            style={{ marginRight: '6px' }}
                          />
                          대중교통
                        </h4>
                        {transportTypes
                          .filter(t => t.type && t.routes.length > 0)
                          .map((transport, idx) => (
                            <div key={idx}>
                              {transport.routes.map((route, ridx) => (
                                <div
                                  key={ridx}
                                  className={styles.previewTransportItem}
                                >
                                  <span className={styles.previewTransportType}>
                                    {transport.type}
                                  </span>
                                  <span
                                    className={styles.previewTransportDivider}
                                  >
                                    |
                                  </span>
                                  <span
                                    className={styles.previewTransportRoute}
                                  >
                                    {route.from} → {route.to}
                                  </span>
                                  <span className={styles.previewTransportTime}>
                                    {route.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        {locationNote && (
                          <p className={styles.previewTransportNote}>
                            {locationNote}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview FAB */}
      <button
        className={styles.mobilePreviewFab}
        onClick={() => setShowMobilePreview(true)}
        title="미리보기"
      >
        <IoMdEye />
      </button>

      {/* Mobile Preview Overlay */}
      <div className={`${styles.mobilePreviewOverlay} ${showMobilePreview ? styles.mobilePreviewOverlayOpen : ''}`}>
        <div className={styles.mobilePreviewHeader}>
          <span>미리보기</span>
          <button className={styles.mobilePreviewCloseBtn} onClick={() => setShowMobilePreview(false)}>
            <IoClose size={18} />
            닫기
          </button>
        </div>
        <div className={styles.mobilePreviewBody}>
          <div className={styles.previewPhone}>
            {/* Header */}
            <div className={styles.previewHeader}>
              <h1>{title || '이벤트 제목'}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>

            {/* Main Content Cards */}
            {mainContent.some(c => c.title || c.description) && (
              <div className={styles.previewSection}>
                <div className={styles.previewCards}>
                  {mainContent
                    .filter(c => c.title || c.description)
                    .map(card => (
                      <div key={card.id} className={styles.previewCard}>
                        <div className={styles.previewCardIcon}>
                          {(() => {
                            const IC = getIconComponent(card.icon)
                            return IC ? <IC size={22} /> : '❓'
                          })()}
                        </div>
                        <div className={styles.previewCardContent}>
                          <h4>{card.title || '제목 없음'}</h4>
                          <p>{card.description || '설명 없음'}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Timetable */}
            {schedules.some(s => s.date && s.items.length > 0) && (
              <div className={styles.previewSection}>
                <h2 className={styles.previewSectionTitle}>타임테이블</h2>
                {schedules
                  .filter(s => s.date && s.items.length > 0)
                  .map(day => (
                    <div key={day.day} className={styles.previewDayCard}>
                      <div className={styles.previewDayHeader}>
                        <span className={styles.previewDayTitle}>Day {day.day}</span>
                        <span className={styles.previewDayDate}>{day.date}</span>
                      </div>
                      <div className={styles.previewTimelineItems}>
                        {day.items.map(item => (
                          <div
                            key={item.id}
                            className={`${styles.previewTimelineItem} ${item.isHighlight ? styles.previewTimelineItemHighlight : ''}`}
                          >
                            <div className={item.isHighlight ? styles.previewTimelineDotHighlight : styles.previewTimelineDot}>
                              {item.order}
                            </div>
                            <div className={styles.previewTimelineContent}>
                              <div className={styles.previewTime}>
                                {item.time}
                                {item.duration && <span className={styles.previewTimeDuration}> · {item.duration}</span>}
                              </div>
                              <div className={styles.previewTimelineTitle}>{item.title}</div>
                              {item.subtitle && <div className={styles.previewTimelineSubtitle}>{item.subtitle}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Location */}
            {(locationName || locationAddress) && (
              <div className={styles.previewSection}>
                <h2 className={styles.previewSectionTitle}>오시는 길</h2>
                <div className={styles.previewLocation}>
                  <div className={styles.previewLocationHeader}>
                    <div className={styles.previewLocationIcon}>
                      <IoLocationSharp size={24} />
                    </div>
                    <div>
                      <h3 className={styles.previewLocationName}>{locationName || '장소명'}</h3>
                      <p className={styles.previewLocationAddress}>{locationAddress || '주소'}</p>
                    </div>
                  </div>
                  <div className={styles.previewMapButtons}>
                    <span className={styles.previewMapButton}>네이버 지도</span>
                    <span className={styles.previewMapButton}>카카오맵</span>
                  </div>
                  {transportTypes.some(t => t.type && t.routes.some(r => r.from || r.to)) && (
                    <div className={styles.previewTransportInfo}>
                      <h4 className={styles.previewTransportTitle}>
                        <MdDirectionsBus size={20} style={{ marginRight: '6px' }} />
                        대중교통
                      </h4>
                      {transportTypes
                        .filter(t => t.type && t.routes.length > 0)
                        .map((transport, idx) => (
                          <div key={idx}>
                            {transport.routes.map((route, ridx) => (
                              <div key={ridx} className={styles.previewTransportItem}>
                                <span className={styles.previewTransportType}>{transport.type}</span>
                                <span className={styles.previewTransportDivider}>|</span>
                                <span className={styles.previewTransportRoute}>{route.from} → {route.to}</span>
                                <span className={styles.previewTransportTime}>{route.time}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      {locationNote && <p className={styles.previewTransportNote}>{locationNote}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
