import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSettingsSharp, IoLocationSharp, IoCopyOutline } from 'react-icons/io5';
import { MdAdminPanelSettings, MdDarkMode, MdLightMode, MdDirectionsBus, MdWaves, MdRestaurant, MdCameraAlt } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { useEventStore } from '../store/useEventStore';
import { useThemeStore } from '../store/useThemeStore';
import { EventService } from '../services/eventService';
import { KakaoMap } from '../components/KakaoMap';
import styles from './PublicView.module.css';

export const PublicView: React.FC = () => {
  const navigate = useNavigate();
  const { getActiveEvent, seedDemoEvent, events } = useEventStore();
  const { theme, toggleTheme } = useThemeStore();
  const [event, setEvent] = useState(getActiveEvent());
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);

  // 주소 복사 핸들러
  const handleCopyAddress = useCallback(async () => {
    if (!event) return;
    try {
      await navigator.clipboard.writeText(event.location.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = event.location.address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [event]);

  // 스와이프 핸들러
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !event) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    
    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0 && currentCardIndex < event.schedules.length - 1) {
        // 왼쪽으로 스와이프 (다음 카드)
        setCurrentCardIndex(prev => prev + 1);
      } else if (distanceX < 0 && currentCardIndex > 0) {
        // 오른쪽으로 스와이프 (이전 카드)
        setCurrentCardIndex(prev => prev - 1);
      }
    }
  };

  useEffect(() => {
    const loadEvent = async () => {
      // 먼저 Supabase에서 시도
      const dbEvent = await EventService.getActiveEvent();
      
      if (dbEvent) {
        // DB에 데이터가 있으면 사용
        setEvent(dbEvent);
      } else {
        // DB에 없으면 로컬 스토리지 사용
        if (events.length === 0) {
          seedDemoEvent();
        }
        setEvent(getActiveEvent());
      }
      
      setIsLoading(false);
    };

    loadEvent();
  }, [events, getActiveEvent, seedDemoEvent]);

  // 테마 적용
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!event) {
    return <div>Loading...</div>;
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
          {event.mainContent.map((card, index) => {
            // 아이콘 매핑 (index로 구분)
            const IconComponent = index === 0 ? MdWaves : index === 1 ? MdRestaurant : MdCameraAlt;
            
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
            );
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
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {event.schedules.map((daySchedule) => (
                <div key={daySchedule.day} className={styles.carouselSlide}>
                  <div className={styles.dayHeader}>
                    <div className={styles.dayTitle}>Day {daySchedule.day}</div>
                    <div className={styles.dayDate}>{daySchedule.date}</div>
                  </div>
                  <div className={styles.timelineItems}>
                    {daySchedule.items.map((item) => (
                      <div key={item.id} className={styles.timelineItem}>
                        <div className={styles.timelineDot}>{item.order}</div>
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineTime}>
                            {item.time}
                            {item.duration && (
                              <span className={styles.timelineDuration}> · {item.duration}</span>
                            )}
                          </div>
                          <h4 className={styles.timelineTitle}>{item.title}</h4>
                          {item.subtitle && (
                            <p className={styles.timelineSubtitle}>{item.subtitle}</p>
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
                <p className={styles.locationAddress}>{event.location.address}</p>
                <button 
                  className={styles.copyButton} 
                  onClick={handleCopyAddress}
                  title="주소 복사"
                >
                  <IoCopyOutline size={18} />
                </button>
              </div>
              {copied && <span style={{ fontSize: '11px', color: 'var(--ios-green)', marginTop: '2px', display: 'block' }}>복사됨!</span>}
              <a 
                href="https://nol.yanolja.com/stay/domestic/10067499?checkInDate=2026-02-08&checkOutDate=2026-02-09&adultPax=2"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pensionLink}
              >
                펜션 정보 바로가기 &gt;
              </a>
            </div>
          </div>

          {/* Kakao Map Embed - 버튼 위에 배치 */}
          <div className={styles.mapContainer}>
            <KakaoMap address={event.location.address} placeName={event.location.name} />
          </div>

          {/* 맵 버튼들을 더 눈에 띄게 */}
          <div className={styles.mapButtons}>
            {event.location.naverMapUrl && (
              <a
                href={event.location.naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapButton}
              >
                네이버 지도
              </a>
            )}
            {event.location.kakaoMapUrl && (
              <a
                href={event.location.kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapButton}
              >
                카카오맵
              </a>
            )}
          </div>

          <div className={styles.transportInfo}>
            <h4 className={styles.transportTitle}>
              <MdDirectionsBus size={20} style={{ marginRight: '6px' }} />
              대중교통
            </h4>
            {event.location.transport.map((info, idx) => (
              <div key={idx} className={styles.transportSection}>
                <div className={styles.transportType}>{info.type}</div>
                <ul className={styles.transportList}>
                  {info.routes.map((route, ridx) => (
                    <li key={ridx} className={styles.transportItem}>
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

      {/* Settings Menu */}
      {showMenu && (
        <div className={styles.settingsMenu}>
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
              toggleTheme();
              setShowMenu(false);
            }}
          >
            {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
            <span>{theme === 'light' ? '다크 모드' : '라이트 모드'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

