import React from 'react'
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import EventCard from '../components/EventCard';

const EventsPage = () => {
  return (
    <div>
        <Header activeHeading={4}/>
        <EventCard active={true} />
        <EventCard active={true} />
    </div>
  )
}

export default EventsPage;