import React from 'react'
import CTA from '../components/CTA'
import Offering from '../components/Offering'
import Gallery from '../components/Gallery'
import GuestReviews from '../components/GuestReviews'
import RoomReview from '../components/RoomReview'
import NewsLetter from '../components/NewsLetter'
import Hero from '../components/Hero'

const Homepage = () => {
  return (
    <div className="bg-[#fafaf8] text-gray-900 transition-colors duration-1500 ease-in-out">
      <Hero />
      <CTA />
      <Offering />
      <GuestReviews />
      <RoomReview />
      <Gallery />
      <NewsLetter/>
    </div>
  )
}

export default Homepage
