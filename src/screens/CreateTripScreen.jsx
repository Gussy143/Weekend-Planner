import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, ListSection, Input, Button } from '@components'
import { useTravelStore } from '@store/travelStore'
import dayjs from 'dayjs'
import styles from './Screen.module.css'

export const CreateTripScreen = () => {
  const navigate = useNavigate()
  const addTrip = useTravelStore(state => state.addTrip)

  const [formData, setFormData] = useState({
    name: '',
    startDate: dayjs().add(1, 'week').format('YYYY-MM-DD'),
    endDate: dayjs().add(1, 'week').add(3, 'day').format('YYYY-MM-DD'),
    budget: '',
    accommodation: '',
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('여행 이름과 날짜를 입력해주세요')
      return
    }

    const tripData = {
      ...formData,
      budget: formData.budget ? Number(formData.budget) : null,
    }

    const tripId = addTrip(tripData)
    navigate(`/trip/${tripId}`)
  }

  const isValid = formData.name && formData.startDate && formData.endDate

  return (
    <div className={styles.screen}>
      <NavBar
        leftButton="취소"
        rightButton="완료"
        onLeftClick={() => navigate(-1)}
        onRightClick={handleSubmit}
      />

      <div className={styles.contentWrapper} style={{ paddingTop: 'var(--space-8)' }}>
        <div style={{ padding: 'var(--space-8) var(--space-5)', margin: '0 var(--space-4)' }}>
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-bold)',
            marginBottom: 'var(--space-1)',
          }}>
            새로운 여행
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--ios-label-secondary)',
          }}>
            여행 정보를 입력하세요
          </p>
        </div>

        <ListSection>
          <Input
            label="여행 이름"
            placeholder="예: 제주도 여름 여행"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
          />
        </ListSection>

        <ListSection header="기간">
          <Input
            label="시작일"
            type="date"
            value={formData.startDate}
            onChange={e => handleChange('startDate', e.target.value)}
          />
          <Input
            label="종료일"
            type="date"
            value={formData.endDate}
            onChange={e => handleChange('endDate', e.target.value)}
          />
        </ListSection>

        <ListSection header="선택사항">
          <Input
            label="예산"
            type="number"
            placeholder="1000000"
            value={formData.budget}
            onChange={e => handleChange('budget', e.target.value)}
          />
          <Input
            label="숙소"
            placeholder="예: 제주 OO 호텔"
            value={formData.accommodation}
            onChange={e => handleChange('accommodation', e.target.value)}
          />
        </ListSection>

        <div className={styles.infoCard}>
          <p className={styles.infoText}>
            여행을 만든 후 참가자를 초대하고 일정을 추가할 수 있습니다.
          </p>
        </div>
      </div>

      <div className={styles.actionBar}>
        <Button fullWidth disabled={!isValid} onClick={handleSubmit}>
          여행 만들기
        </Button>
      </div>
    </div>
  )
}
