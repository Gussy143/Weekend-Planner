import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TripListScreen, TripDetailScreen, CreateTripScreen } from '@screens'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TripListScreen />} />
        <Route path="/trip/new" element={<CreateTripScreen />} />
        <Route path="/trip/:tripId" element={<TripDetailScreen />} />
        {/* Future routes */}
        <Route path="/trip/:tripId/edit" element={<CreateTripScreen />} />
        <Route path="/trip/:tripId/schedule/new" element={<div>Add Schedule</div>} />
        <Route path="/trip/:tripId/schedule/:scheduleId" element={<div>Schedule Detail</div>} />
        <Route path="/trip/:tripId/invite" element={<div>Invite Participants</div>} />
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
