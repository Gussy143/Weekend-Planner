import React, { useEffect, useState } from 'react'
import { useEventStore } from '../store/useEventStore'
import { EventService } from '../services/eventService'
import { useNavigate } from 'react-router-dom'
import { IoHome } from 'react-icons/io5'
import { MdLogout, MdEdit } from 'react-icons/md'
import styles from './AdminDashboard.module.css'

export const AdminDashboard: React.FC = () => {
  const { isAdmin, logout, events, activeEventId, setActiveEvent } =
    useEventStore()
  const navigate = useNavigate()
  const [dbEvents, setDbEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login')
    }
  }, [isAdmin, navigate])

  useEffect(() => {
    const loadEvents = async () => {
      const allEvents = await EventService.getAllEvents()
      if (allEvents && allEvents.length > 0) {
        setDbEvents(allEvents)
      }
      setIsLoading(false)
    }

    loadEvents()
  }, [])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('admin-credentials') // 자동 로그인 정보도 삭제
    navigate('/')
  }

  const activeEvent = events.find(e => e.id === activeEventId)
  const displayEvent = dbEvents.find(e => e.isActive) || activeEvent

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>관리자 페이지</h1>
        <div className={styles.headerButtons}>
          <button onClick={() => navigate('/')} className={styles.homeBtn}>
            <IoHome size={20} />
            <span>공지 화면</span>
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <MdLogout size={20} />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2>현재 공개된 이벤트</h2>
          {isLoading ? (
            <p className={styles.loading}>로딩 중...</p>
          ) : displayEvent ? (
            <div className={styles.activeEventCard}>
              <h3>{displayEvent.title}</h3>
              <p>이벤트 ID: {displayEvent.id}</p>
              <div className={styles.stats}>
                <span>
                  메인 콘텐츠:{' '}
                  {(displayEvent as any)._mainContentCount ??
                    displayEvent.mainContent?.length ??
                    0}
                  개
                </span>
                <span>
                  일정:{' '}
                  {(displayEvent as any)._daySchedulesCount ??
                    displayEvent.schedules?.length ??
                    0}
                  일
                </span>
              </div>
            </div>
          ) : (
            <p className={styles.noEvent}>공개된 이벤트가 없습니다</p>
          )}
        </section>

        <section className={styles.section}>
          <h2>이벤트 목록</h2>
          <div className={styles.eventList}>
            {dbEvents.length > 0
              ? dbEvents.map(event => (
                  <div
                    key={event.id}
                    className={`${styles.eventItem} ${event.isActive ? styles.active : ''}`}
                  >
                    <h3>{event.title}</h3>
                    <p>{event.subtitle || '부제목 없음'}</p>
                    <div className={styles.eventActions}>
                      <button
                        onClick={() =>
                          navigate(`/admin/event/edit/${event.id}`)
                        }
                        className={styles.editBtn}
                      >
                        <MdEdit size={16} />
                        편집
                      </button>
                      <button
                        onClick={async () => {
                          const success = await EventService.setActiveEvent(
                            event.id
                          )
                          if (success) {
                            const allEvents = await EventService.getAllEvents()
                            if (allEvents && allEvents.length > 0) {
                              setDbEvents(allEvents)
                            }
                          }
                        }}
                        className={styles.selectBtn}
                        disabled={event.isActive}
                      >
                        {event.isActive ? '공개 중' : '이 이벤트 공개하기'}
                      </button>
                    </div>
                  </div>
                ))
              : events.map(event => (
                  <div
                    key={event.id}
                    className={`${styles.eventCard} ${event.id === activeEventId ? styles.active : ''}`}
                  >
                    <div className={styles.eventInfo}>
                      <h3>{event.title}</h3>
                      <p>
                        {event.mainContent.length}개 콘텐츠 ·{' '}
                        {event.schedules.length}일 일정
                      </p>
                    </div>
                    <div className={styles.eventActions}>
                      {event.id !== activeEventId && (
                        <button
                          onClick={() => setActiveEvent(event.id)}
                          className={styles.activateBtn}
                        >
                          공개하기
                        </button>
                      )}
                      {event.id === activeEventId && (
                        <span className={styles.activeBadge}>공개중</span>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>새 이벤트 만들기</h2>
          <button
            className={styles.createBtn}
            onClick={() => navigate('/admin/event/create')}
          >
            이벤트 생성하기
          </button>
          <p className={styles.note}>
            * 새로운 이벤트를 만들어 공개할 수 있습니다
          </p>
        </section>
      </main>
    </div>
  )
}
