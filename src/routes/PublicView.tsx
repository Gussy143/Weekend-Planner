import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IoSettingsSharp,
  IoLocationSharp,
  IoCopyOutline,
  IoChevronBack,
  IoChevronForward,
  IoShareSocial,
} from 'react-icons/io5'
import {
  MdAdminPanelSettings,
  MdDarkMode,
  MdLightMode,
  MdDirectionsBus,
} from 'react-icons/md'
import { IoMdClose } from 'react-icons/io'
import { getIconComponent } from '../components/IconPicker'
import { LuSparkles } from 'react-icons/lu'
import { useEventStore } from '../store/useEventStore'
import { useThemeStore, COLOR_THEMES, type ColorTheme } from '../store/useThemeStore'
import { EventService } from '../services/eventService'
import { KakaoMap } from '../components/KakaoMap'
import styles from './PublicView.module.css'

export const PublicView: React.FC = () => {
  const navigate = useNavigate()
  const { getActiveEvent, seedDemoEvent, events } = useEventStore()
  const { theme, mode, toggleTheme, colorTheme, setColorTheme, setCustomColors, customColors } = useThemeStore()
  const [event, setEvent] = useState(getActiveEvent())
  const [showMenu, setShowMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  )
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  )
  const [copied, setCopied] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // 카카오 SDK 초기화
  useEffect(() => {
    const w = window as any
    if (w.Kakao && !w.Kakao.isInitialized()) {
      w.Kakao.init(import.meta.env.VITE_KAKAO_MAP_APP_KEY)
    }
  }, [])

  // 카카오톡 공유
  const handleKakaoShare = useCallback(() => {
    const w = window as any
    if (!w.Kakao) {
      alert('카카오 SDK를 불러올 수 없습니다.')
      return
    }
    if (!event) return

    w.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: event.title,
        description: event.subtitle || '주말 여행 일정을 확인해보세요!',
        imageUrl: 'https://img.icons8.com/fluency/512/calendar.png',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '일정 확인하기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    })
    setShowMenu(false)
  }, [event])

  // 주소 복사 핸들러
  const handleCopyAddress = useCallback(async () => {
    if (!event) return
    try {
      await navigator.clipboard.writeText(event.location.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = event.location.address
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    }
  }, [event])

  // 스와이프 핸들러
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !event) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      setHasInteracted(true)
      if (distanceX > 0 && currentCardIndex < event.schedules.length - 1) {
        // 왼쪽으로 스와이프 (다음 카드)
        setCurrentCardIndex(prev => prev + 1)
      } else if (distanceX < 0 && currentCardIndex > 0) {
        // 오른쪽으로 스와이프 (이전 카드)
        setCurrentCardIndex(prev => prev - 1)
      }
    }
  }

  useEffect(() => {
    const loadEvent = async () => {
      // 먼저 Supabase에서 시도
      const dbEvent = await EventService.getActiveEvent()

      if (dbEvent) {
        // DB에 데이터가 있으면 사용
        setEvent(dbEvent)
      } else {
        // DB에 없으면 로컬 스토리지 사용
        if (events.length === 0) {
          seedDemoEvent()
        }
        setEvent(getActiveEvent())
      }

      setIsLoading(false)
    }

    loadEvent()
  }, [events, getActiveEvent, seedDemoEvent])

  // 테마는 App.tsx에서 전역으로 관리됨

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>{event.title}</h1>
        {event.subtitle && <p className={styles.subtitle}>{event.subtitle}</p>}
      </header>

      {/* Main Content Cards */}
      <section id="main" className={styles.section}>
        <div className={styles.cards}>
          {event.mainContent.map(card => {
            const IconComponent = getIconComponent(card.icon) || LuSparkles

            return (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardIcon}>
                  <IconComponent size={24} />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>{card.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Timetable */}
      <section id="timetable" className={styles.section}>
        <h2 className={styles.sectionTitle}>타임테이블</h2>
        <div className={styles.carouselWrapper}>
          {/* 페이지 인디케이터 */}
          <div className={styles.pageIndicator}>
            {event.schedules.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.pageDot} ${idx === currentCardIndex ? styles.pageDotActive : ''}`}
                onClick={() => setCurrentCardIndex(idx)}
                aria-label={`Day ${idx + 1}로 이동`}
              />
            ))}
          </div>

          <div className={styles.carouselNav}>
            {/* 이전 화살표 */}
            {currentCardIndex > 0 && (
              <button
                className={styles.navArrow}
                onClick={() => { setHasInteracted(true); setCurrentCardIndex(prev => prev - 1) }}
                aria-label="이전 Day"
              >
                <IoChevronBack size={20} />
              </button>
            )}
            {currentCardIndex === 0 && <div className={styles.navArrowPlaceholder} />}

            {/* 다음 화살표 (유도 애니메이션) */}
            {currentCardIndex < event.schedules.length - 1 && (
              <button
                className={`${styles.navArrow} ${styles.navArrowRight} ${!hasInteracted ? styles.navArrowHint : ''}`}
                onClick={() => { setHasInteracted(true); setCurrentCardIndex(prev => prev + 1) }}
                aria-label="다음 Day"
              >
                <IoChevronForward size={20} />
              </button>
            )}
            {currentCardIndex >= event.schedules.length - 1 && <div className={styles.navArrowPlaceholder} />}
          </div>

          <div
            className={styles.carouselContainer}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className={styles.carouselTrack}
              style={{
                transform: `translateX(-${currentCardIndex * 100}%)`,
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {event.schedules.map(daySchedule => (
                <div key={daySchedule.day} className={styles.carouselSlide}>
                  <div className={styles.dayHeader}>
                    <div className={styles.dayTitle}>Day {daySchedule.day}</div>
                    <div className={styles.dayDate}>{daySchedule.date}</div>
                  </div>
                  <div className={styles.timelineItems}>
                    {daySchedule.items.map(item => (
                      <div key={item.id} className={`${styles.timelineItem} ${item.isHighlight ? styles.timelineItemHighlight : ''}`}>
                        <div
                          className={
                            item.isHighlight
                              ? styles.timelineDotHighlight
                              : styles.timelineDot
                          }
                        >
                          {item.order}
                        </div>
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineTime}>
                            {item.time}
                            {item.duration && (
                              <span className={styles.timelineDuration}>
                                {' '}
                                · {item.duration}
                              </span>
                            )}
                          </div>
                          <h4 className={styles.timelineTitle}>{item.title}</h4>
                          {item.subtitle && (
                            <p className={styles.timelineSubtitle}>
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className={styles.section}>
        <h2 className={styles.sectionTitle}>오시는 길</h2>
        <div className={styles.locationCard}>
          <div className={styles.locationHeader}>
            <div className={styles.locationIcon}>
              <IoLocationSharp size={24} />
            </div>
            <div className={styles.locationInfo}>
              <h3 className={styles.locationName}>{event.location.name}</h3>
              <div className={styles.locationAddressRow}>
                <p className={styles.locationAddress}>
                  {event.location.address}
                </p>
                <button
                  className={styles.copyButton}
                  onClick={handleCopyAddress}
                  title="주소 복사"
                >
                  <IoCopyOutline size={18} />
                </button>
              </div>

              {event.location.pensionUrl && (
                <a
                  href={event.location.pensionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pensionLink}
                >
                  {event.location.pensionLinkTitle || '펜션 정보 바로가기'} &gt;
                </a>
              )}
            </div>
          </div>

          {/* Kakao Map Embed - 버튼 위에 배치 */}
          <div className={styles.mapContainer}>
            <KakaoMap
              address={event.location.address}
              placeName={event.location.name}
            />
          </div>

          {/* 맵 버튼들을 더 눈에 띄게 */}
          <div className={styles.mapButtons}>
            <a
              href={event.location.naverMapUrl || '#'}
              target={event.location.naverMapUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={styles.mapButton}
              onClick={e => {
                if (!event.location.naverMapUrl) {
                  e.preventDefault()
                  alert('연결된 링크가 없습니다')
                }
              }}
            >
              네이버 지도
            </a>
            <a
              href={event.location.kakaoMapUrl || '#'}
              target={event.location.kakaoMapUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={styles.mapButton}
              onClick={e => {
                if (!event.location.kakaoMapUrl) {
                  e.preventDefault()
                  alert('연결된 링크가 없습니다')
                }
              }}
            >
              카카오맵
            </a>
          </div>

          <div className={styles.transportInfo}>
            <h4 className={styles.transportTitle}>
              <MdDirectionsBus size={20} style={{ marginRight: '6px' }} />
              대중교통
            </h4>
            {event.location.transport.map((info, idx) => (
              <div key={idx} className={styles.transportSection}>
                <ul className={styles.transportList}>
                  {info.routes.map((route, ridx) => (
                    <li key={ridx} className={styles.transportItem}>
                      <span className={styles.transportType}>{info.type}</span>
                      <span className={styles.transportDivider}>|</span>
                      <span className={styles.transportRoute}>
                        {route.from} → {route.to}
                      </span>
                      <span className={styles.transportTime}>{route.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {event.location.note && (
              <p className={styles.transportNote}>{event.location.note}</p>
            )}
          </div>
        </div>
      </section>

      {/* Settings Button */}
      <button
        className={styles.settingsButton}
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? <IoMdClose size={24} /> : <IoSettingsSharp size={24} />}
      </button>

      {/* 토스트 팝업 */}
      {copied && <div className={styles.toast}>복사가 완료되었습니다!</div>}

      {/* Settings Menu */}
      {showMenu && (
        <div className={styles.settingsMenu}>
          <button
            className={styles.menuItem}
            onClick={handleKakaoShare}
          >
            <IoShareSocial size={20} />
            <span>카카오톡 공유</span>
          </button>
          <button
            className={styles.menuItem}
            onClick={() => navigate('/admin/login')}
          >
            <MdAdminPanelSettings size={20} />
            <span>관리자</span>
          </button>
          <button
            className={styles.menuItem}
            onClick={() => {
              toggleTheme()
              setShowMenu(false)
            }}
          >
            {mode === 'system' ? (
              <MdDarkMode size={20} />
            ) : mode === 'dark' ? (
              <MdLightMode size={20} />
            ) : (
              <MdDarkMode size={20} />
            )}
            <span>
              {mode === 'system'
                ? '다크 모드'
                : mode === 'dark'
                  ? '라이트 모드'
                  : '시스템'}
            </span>
          </button>

          {/* 컬러 테마 */}
          <div className={styles.colorThemeSection}>
            <span className={styles.colorThemeLabel}>컬러 테마</span>
            <div className={styles.colorThemePicker}>
              {(Object.keys(COLOR_THEMES) as Array<Exclude<ColorTheme, 'custom'>>).map(key => (
                <button
                  key={key}
                  className={`${styles.colorThemeDot} ${colorTheme === key ? styles.colorThemeDotActive : ''}`}
                  style={{ background: COLOR_THEMES[key].primary }}
                  onClick={() => setColorTheme(key)}
                  title={COLOR_THEMES[key].name}
                />
              ))}
              <button
                className={`${styles.colorThemeDot} ${styles.colorThemeCustom} ${colorTheme === 'custom' ? styles.colorThemeDotActive : ''}`}
                onClick={() => {
                  const color = prompt('메인 색상 HEX 코드 (예: #ff6b6b)', customColors.primary)
                  if (color && /^#[0-9a-fA-F]{6}$/.test(color)) {
                    const accent = prompt('강조 색상 HEX 코드 (예: #e55a5a)', customColors.accent)
                    if (accent && /^#[0-9a-fA-F]{6}$/.test(accent)) {
                      setCustomColors({ primary: color, accent, bg: customColors.bg })
                    }
                  }
                }}
                title="커스텀 테마"
              >
                ✎
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
