import { useParams, useNavigate } from 'react-router-dom'
import { Hero, NavBar, ListSection, ListItem } from '@components'
import { useTravelStore } from '@store/travelStore'
import dayjs from 'dayjs'
import styles from './Screen.module.css'

export const TripDetailScreen = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const trip = useTravelStore(state => state.getTrip(tripId))
  const isOrganizer = useTravelStore(state => state.isOrganizer(tripId))

  if (!trip) {
    return (
      <div className={styles.screen}>
        <NavBar showBack backLabel="여행" />
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>여행을 찾을 수 없습니다</div>
        </div>
      </div>
    )
  }

  const formatDateRange = (start, end) => {
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    return `${startDate.format('YYYY년 M월 D일')} – ${endDate.format('M월 D일')}`
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount)
  }

  return (
    <div className={styles.screen}>
      <NavBar showBack backLabel="여행" />

      <Hero title={trip.name} subtitle={formatDateRange(trip.startDate, trip.endDate)} />

      <div className={styles.contentWrapper}>
        {/* Trip Info */}
        <ListSection header="여행 정보">
          <ListItem label="참가자" value={`${trip.participants.length}명`} />
          {trip.budget && (
            <ListItem label="총 예산" value={formatCurrency(trip.budget)} />
          )}
          {trip.accommodation && (
            <ListItem label="숙소" value={trip.accommodation} />
          )}
        </ListSection>

        {/* Schedules */}
        <ListSection header="일정">
          {trip.schedules.length > 0 ? (
            trip.schedules.map(schedule => (
              <ListItem
                key={schedule.id}
                title={schedule.title}
                subtitle={schedule.description}
                chevron
                onClick={() => navigate(`/trip/${tripId}/schedule/${schedule.id}`)}
              />
            ))
          ) : (
            <ListItem title="일정이 없습니다" disabled />
          )}
          {isOrganizer && (
            <ListItem
              title="일정 추가하기"
              action
              onClick={() => navigate(`/trip/${tripId}/schedule/new`)}
            />
          )}
        </ListSection>

        {/* Participants */}
        <ListSection header="참가자">
          {trip.participants.map(participant => (
            <ListItem
              key={participant.id}
              title={participant.name}
              subtitle={participant.role === 'organizer' ? '주최자' : '참가자'}
            />
          ))}
          {isOrganizer && (
            <ListItem
              title="참가자 초대하기"
              action
              onClick={() => navigate(`/trip/${tripId}/invite`)}
            />
          )}
        </ListSection>

        {/* Actions */}
        <ListSection>
          <ListItem title="여행 공유하기" chevron action />
          {isOrganizer && (
            <>
              <ListItem
                title="여행 편집"
                chevron
                onClick={() => navigate(`/trip/${tripId}/edit`)}
              />
              <ListItem title="여행 삭제" destructive />
            </>
          )}
        </ListSection>
      </div>
    </div>
  )
}
