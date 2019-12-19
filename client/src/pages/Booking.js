import React, { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingsControl from '../components/Bookings/BookingsControl/BookingsControl';

const BookingPage = () => {
  const [isLoading, setLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const [outPutType, setOutPutType] = useState('list')
  const context = useContext(AuthContext)

  const getBookings = useCallback(async()=>{
    try{
      setLoading(true)
      const requestBody = {
        query: `
          query {
            bookings{
              id
              createdAt
              updatedAt
              booker{
                id
                events{
                  description
                }
              }
              bookedEvent{
                id
                title
                date
                price
              }
            }
          }
        `
      }

      const request = await fetch('http://localhost:5500/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ context.token
        }
      })
      if (request.status !== 200 && request.status !== 201) {
        throw new Error('Failed!')
      }
      const response = await request.json()
      setBookings(response.data.bookings)
      setLoading(false)
    }catch(err){
      setLoading(false) 
      return err
    }
  }, [context.token])

  useEffect(() => {
    getBookings()
    return(()=>null)
  }, [getBookings])

  

  const cancelBooking = async id =>{
    const remainder = bookings.filter(booking=>booking.id !== id)
    console.log(remainder)
    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${id}"){
            title
            creator{
              email
            }
          }
        }
      `
    }
    try {
      const request = await fetch('http://localhost:5500/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ context.token
          }
        })

        if (request.status !== 200 && request.status !== 201) {
          throw new Error('Failed!')
        }
        
        await request.json()
        setBookings(prevState => prevState.filter(booking=>booking.id !== id))
      }catch(err){
      return err
    }
  }

  const changeOutput = type => {
    if(type === 'list') {
      setOutPutType('list')
    } else{
      setOutPutType('chart')
    }
  }

  return (
    <>
      <ul>
          {
            isLoading ? 
            <Spinner /> : 
            <>
              <BookingsControl changeOutput={changeOutput} activeOutputType={outPutType}/>
              {
                outPutType === 'list' ?
                <BookingList bookings={bookings} onDelete={cancelBooking}/> :
                <BookingChart bookings={bookings} onDelete={cancelBooking}/>
              }
            </>
          }
      </ul>
    </>
  )
}

export default BookingPage
