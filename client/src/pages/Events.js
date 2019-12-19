import React, { useState, createRef, useContext, useEffect } from 'react'
import './Events.css'
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import { AuthContext } from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

const Events = () => {
  const context = useContext(AuthContext)
  const [creating, setCreating] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const titleEl = createRef()
  const priceEl = createRef()
  const dateEl = createRef()
  const timeEl = createRef()
  const descriptionEl = createRef()

  const startCreateEventHandler =()=>{
    setCreating(true)
  }

  const ModalConfirmHandler = async () => {
    try{
      setCreating(false)
      const title = titleEl.current.value
      const price = +priceEl.current.value
      const date = dateEl.current.value
      const description = descriptionEl.current.value
      const time = timeEl.current.value

      if (title.trim().length === 0 ||
          price <= 0 ||
          date.trim().length === 0 ||
          time.trim().length === 0 ||
          description.trim().length === 0) {
          return null
      }


      const requestBody = {
        query: `
          mutation {
            createEvent(eventInput:{title:"${title}", description:"${description}", price:${price}, date:"${date} ${time}"}){
              id
              description
              title
              price
              date
              bookings {
                booker {
                  email
                }
              }
              creator{
                id
                email
                events{
                  id
                  title
                  description
                  date
                }
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
      const response = await request.json()
      setEvents(prevEvents=>[...prevEvents, response.data.createEvent])
    }catch(err){return err}
  }

  const ModalCancelHandler = () => {
    setCreating(false)
    setSelectedEvent(null)
  }

  const bookEventHandler = async() => {
    try{
      if(!context.token){
        setSelectedEvent(null)
        return null
      }
      const requestBody = {
        query: `
          mutation {
            bookEvent(eventId: "${selectedEvent.id}"){
              createdAt
              updatedAt
              booker{
                id
                email
                events {
                  id
                  description
                  date
                  title
                  price
                }
              }
              bookedEvent{
                id
                description
                date
                title
                price
                creator{
                  id
                  email
                }
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
        
        const response = await request.json()
        if(response.errors){
          throw Error(response.errors[0].message)
        }
        setSelectedEvent(null)
    }catch(err){
      console.log(err)
    }
  }

  const showDetailHander = eventId =>{
    const currentEvent = events.find(event=>event.id === eventId)
    setSelectedEvent(currentEvent)
  }

  const getEvents = async () => {
    try{
      setLoading(true)
      const requestBody = {
        query: `
          query {
            events{
              id
              price
              date
              description
              title
              creator{
                id
                email
              }
              bookings{
                booker{
                  email
                }
              }
            }
          }
        `
      }
      const request = await fetch('http://localhost:5500/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (request.status !== 200 && request.status !== 201) {
        throw new Error('Failed!')
      }
      const response = await request.json()
      setEvents(response.data.events)
      setLoading(false)
    }catch(err){
      setLoading(false) 
    }
  }

  useEffect(() => {
    getEvents()
  },[])

  return (
    <>
    {(creating || selectedEvent) && <Backdrop/>}
      {creating && <Modal confirmText="Confirm" title="Add Event" canConfirm canCancel onCancel={ModalCancelHandler} onConfirm={ModalConfirmHandler}>
        <p>Modal Content</p>
        <form>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" ref={titleEl}/>
          </div>
          <div className="form-control">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" ref={priceEl}/>
          </div>
          <div className="form-control">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" ref={dateEl}/>
            <input type="time" id="time" ref={timeEl} defaultValue="13:30"/>
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows="4" ref={descriptionEl}/>
          </div>
        </form>
      </Modal>}

      {selectedEvent && (
        <Modal confirmText={context.token ? "Book" : null} title={selectedEvent.title} canConfirm canCancel onCancel={ModalCancelHandler} onConfirm={bookEventHandler}>
          <h1>{selectedEvent.title}</h1>
          <h3>Date: {new Date(selectedEvent.date).toLocaleString()}</h3>
          <p>Price: <em>${selectedEvent.price}</em> </p>
          <p>
            Detail:
          </p>
          <p>{selectedEvent.description}</p>
          <p>{selectedEvent.time}</p>
        </Modal>)
      }

      {context.token && <div className="events-control">
        <p>Share Your Events</p>
        <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
      </div>}
      { 
        isLoading ? (
        <Spinner/>
        ): (
        <EventList events={events} onViewDetail={showDetailHander}/>
        )
      }      
    </>
  )
}

export default Events
