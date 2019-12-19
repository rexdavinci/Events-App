// const loader = require('dataloader')
const { User, Event, Booking } = require('../db/models')

// const eventLoader = new loader((eventIds) => {
//   return eventIds
// })

// const userLoader = new loader((userIds) => {
//   return userIds.map(id=>{
//     return User.findAll({where: { id }})
// })})



const formatDate = date => {
  return new Date(date).toISOString()
}

const formatedItem = (item, type) => {
  if(type === 'event'){
    return {...item.dataValues, date: formatDate(item.date), createdAt: formatDate(item.createdAt), updatedAt: formatDate(item.updatedAt)}
  }else if(type === 'booking'){
    return {...item.dataValues, createdAt: formatDate(item.createdAt), updatedAt: formatDate(item.updatedAt)}
  }else if(type === 'user'){
    return {...item.dataValues, password: null, createdAt: formatDate(item.createdAt), updatedAt: formatDate(item.updatedAt)}
  }
}

const formatedItems = (items, type) => {
  return items.map(item=>{
    return formatedItem(item, type)
  })
}

const singleUser = async userId => {
  const user = await User.findByPk(userId, {include: [{model: Event, as: 'events'}]})
  return { 
    ...formatedItem(user, 'user'), 
    events: formatedItems(user.events, 'event')
  }
}

const singleEvent = async eventId => {
  try{
    const event = await Event.findByPk(eventId)
    return formatedItem(event, 'event')
  }catch(err){
    throw err
  }
}

const singleBooking = async bookingId => {
  try{
    const booking = await Booking.findByPk(bookingId)
    const booker = await singleUser(booking.booker)
    const event = await singleEvent(booking.bookedEvent)
    const bookedEvent = {...event, creator: await singleUser(event.creator)}
    return {
      ...formatedItem(booking, 'booking'), 
      booker, 
      bookedEvent
    }
  }catch(err){
    throw err
  }
}

const eventBookings = async eventId => {
  const bookings = await Booking.findAll({where: {bookedEvent: eventId}})
  return bookings.map(async booking => {
    const booker = await User.findByPk(booking.booker)
    return {...formatedItem(booking, 'booking'), booker: formatedItem(booker, 'user')}
  })
}

const userBookings = async userId => {
  const bookings = await Booking.findAll({where: {booker: userId}})
  return bookings.map(async booking => {
    const bookedEvent = await Event.findByPk(booking.bookedEvent)
    return {...formatedItem(booking, 'booking'), bookedEvent: formatedItem(bookedEvent, 'event')}
  })
}

module.exports = {
  singleEvent,
  singleBooking,
  singleUser,
  userBookings,
  eventBookings,
}
