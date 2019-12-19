import React from 'react'
import './BookingsControl.css'

const BookingsControl = props => {
  return (
    <div className='bookings-control'>
      <button className={props.activeOutputType === 'list' ? 'active' : ''} onClick={()=>props.changeOutput('list')}>List</button>
      <button className={props.activeOutputType === 'chart' ? 'active' : ''} onClick={()=>props.changeOutput('chart')}>Chart</button>
    </div>
  )
}

export default BookingsControl
