import React from 'react'
import { Bar } from 'react-chartjs-2'

const BOOKINGS_BUCKET = {
  'Cheap': {
    min: 0,
    max: 100
  },
  'Normal': {
    min: 100,
    max: 200
  },
  'Expensive': {
    min: 200,
    max: 1000000
  }
}

const BookingChart = props => {
  const chartData = { labels: [], datasets: []}
  let values = []
  for (const bucket in BOOKINGS_BUCKET) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if(current.bookedEvent.price > BOOKINGS_BUCKET[bucket].min && current.bookedEvent.price < BOOKINGS_BUCKET[bucket].max){
        return prev + 1
      }else{
        return prev
      }
    }, 0)
    values.push(filteredBookingsCount)
    chartData.labels.push(bucket)
    chartData.datasets.push({
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [...values]
    })
    values = [...values]
    values[values.length - 1] = 0
  }

  return (
    <div style={{textAlign: 'center'}}>
      <Bar
        data={chartData}
      />
    </div>  
  )
}

export default BookingChart
