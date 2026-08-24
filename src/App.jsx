import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import AccomodationPage from './Pages/AccomodationPage'
import BookingRoom from './Booking/BookingRoom'
import PaymentPage from './Pages/PaymentPage'
import RoomDetails from './Booking/RoomDetails'
import Events from './Booking/Events'
import Dinning from './Booking/Dinning'
import Facilities from './Booking/Facilities' 
import GalleryPage from './Booking/GalleryPage'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import Bookings from './admin/Bookings'
import Payments from './admin/Payments'
import Rooms from './admin/Rooms'
import AdminGallery from './admin/AdminGallery'
import AdminFacilities from './admin/AdminFacilities'
import AdminUsers from './admin/AdminUsers'
import RoomForm from './admin/RoomForm'
import AdminLogin from './auth/AdminLogin'
import SiteLayout from './components/SiteLayout'

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fafaf8] text-gray-900 font-serif transition-colors duration-1500 ease-in-out">
        <Routes>
          <Route path='/' element={<SiteLayout><Homepage /></SiteLayout>} />
          <Route path='/rooms' element={<SiteLayout><AccomodationPage /></SiteLayout>} />
          <Route path='/booking/:id' element={<SiteLayout><BookingRoom /></SiteLayout>} />
          <Route path='/payment' element={<SiteLayout><PaymentPage /></SiteLayout>} />
          <Route path='/room/:id' element={<SiteLayout><RoomDetails /></SiteLayout>} />
          <Route path='/events' element={<SiteLayout><Events /></SiteLayout>} />
          <Route path='/dining' element={<SiteLayout><Dinning /></SiteLayout>} />
          <Route path='/facilities' element={<SiteLayout><Facilities /></SiteLayout>} />
          <Route path='/gallery' element={<SiteLayout><GalleryPage /></SiteLayout>} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='bookings' element={<Bookings />} />
            <Route path='rooms' element={<Rooms />} />
            <Route path='rooms/add' element={<RoomForm />} />
            <Route path='rooms/edit/:id' element={<RoomForm />} />
            <Route path='payments' element={<Payments />} />
            <Route path='admingallery' element={<AdminGallery />} />
            <Route path='adminfacilities' element={<AdminFacilities />} />
            <Route path='users' element={<AdminUsers />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
