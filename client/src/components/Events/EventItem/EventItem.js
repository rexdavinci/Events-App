import React, {useContext} from 'react'
import './EventItem.css'
import { AuthContext } from '../../../context/auth-context'

const EventItem = (props) => {
  const { userId } = useContext(AuthContext)
  return (
    <>
      <li key={props.eventId} className="event__list-item">
        <div>
          <h1>{props.title}</h1>
          <h2>${props.price} - {new Date(props.date).toLocaleString()}</h2>
          <p>{props.time}</p>
        </div>
        <div>
          <button className="btn" onClick={()=> props.onDetail(props.eventId)}>View Details</button>
        </div>
        <div>
        {
          userId === props.creatorId ?
          <p>You are the owner of this event</p> :
          <button className="btn" onClick={()=> props.onDetail(props.eventId)}>Book Event</button>
        }
        </div>
      </li>
    </>
  )
}

export default EventItem