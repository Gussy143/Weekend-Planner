import { useNavigate } from 'react-router-dom'
import { Hero, ListSection, ListItem, Button } from '@components'
import { useTravelStore } from '@store/travelStore'
import dayjs from 'dayjs'
import styles from './Screen.module.css'

export const TripListScreen = () => {
  const navigate = useNavigate()
  const trips = useTravelStore(state => state.trips)

  const now = dayjs()
  const upcomingTrips = trips.filter(trip => dayjs(trip.endDate).isAfter(now))
  const pastTrips = trips.filter(trip => dayjs(trip.endDate).isBefore(now))

  const formatDateRange = (start, end) => {
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    return `${startDate.format('YYYY년 M월 D일')} – ${endDate.format('M월 D일')}`
  }

  return (
    <div className={styles.screen}>
      <Hero title="여행" subtitle="다가오는 여행" />

      <div className={styles.contentWrapper}>
        {upcomingTrips.length > 0 ? (
          <ListSection>
            {upcomingTrips.map(trip => (
              <ListItem
                key={trip.id}
                title={trip.name}
                subtitle={`${formatDateRange(trip.startDate, trip.endDate)} · 참가자 ${trip.participants.length}명`}
                chevron
                onClick={() => navigate(`/trip/${trip.id}`)}
              />
            ))}
          </ListSection>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateTitle}>예정된 여행이 없습니다</div>
            <div className={styles.emptyStateText}>
              새로운 여행을 만들어보세요
            </div>
          </div>
        )}

        {pastTrips.length > 0 && (
          <ListSection header="지난 여행">
            {pastTrips.map(trip => (
              <ListItem
                key={trip.id}
                title={trip.name}
                subtitle={formatDateRange(trip.startDate, trip.endDate)}
                chevron
                onClick={() => navigate(`/trip/${trip.id}`)}
              />
            ))}
          </ListSection>
        )}
      </div>

      <div className={styles.actionBar}>
        <Button fullWidth onClick={() => navigate('/trip/new')}>
          새로운 여행 만들기
        </Button>
      </div>
    </div>
  )
}
