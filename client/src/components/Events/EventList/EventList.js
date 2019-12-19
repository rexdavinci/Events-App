import React from 'react'
import './EventList.css'
import EventItem from '../EventItem/EventItem';
const EventList = (props) => {
  const events = props.events.map(event=>{
    return(
      <EventItem
        key={event.id}
        eventId={event.id}
        title={event.title}
        creatorId={event.creator.id}
        price={event.price}
        date={event.date}
        time={event.time}
        onDetail={props.onViewDetail}
        />
    )
  })
  return (
    <ul className="event__list">
      {events}
    </ul>
  )
}

export default EventList