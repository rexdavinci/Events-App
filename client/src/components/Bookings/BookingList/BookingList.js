import React from 'react'
import './BookingList.css'

const BookingList = props => {
  return (
    <ul className="bookings__list">
    {props.bookings.length > 0 ? props.bookings.map(booking => {
      return (
        <li key={booking.id} className="bookings__item">
          <div className="bookings__item-data">
            <small>$ {booking.bookedEvent.price}</small>
            {booking.bookedEvent.title} - {' '}
            {new Date(booking.createdAt).toLocaleString()}
          </div>
          <div className="bookings__item-actions">
            <button className="btn" onClick={()=>props.onDelete(booking.id)}>Cancel</button>
          </div>
        </li>
      );
    }) :
      <p>You have not booked any event yet</p>
    }
  </ul>
  );
}

export default BookingList