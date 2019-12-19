const sizeof = require('object-sizeof')
const { Event } = require('../../db/models')
const { singleEvent, singleUser, eventBookings } = require('../../helpers')

module.exports = {
  events: async ({}, req, res) => {
    try {
      let events = await Event.findAll({})
      return events.map(async event=>{
        const eventResult = await singleEvent(event.id)
        const creator = await singleUser(event.creator)
        const bookings = await eventBookings(event.id)
        return {
          ...eventResult,
          bookings,
          creator
        }
      })
    } catch (err) {
      throw err
    }
  },  

  createEvent: async (args, req) => {
    const { eventInput } = args
    if(!req.isAuth){
      throw Error('You need to sign in to do that')
    }
    try {
      const event = await new Event({
        title: eventInput.title,
        description: eventInput.description,
        price: +eventInput.price,
        creator: req.userId,
        date: new Date(eventInput.date)
      })
      await event.save()
      const eventResult = await singleEvent(event.id)
      const creator = await singleUser(event.creator)
      const bookings = await eventBookings(event.id)
      return {
        ...eventResult,
        bookings,
        creator
      }
    } catch (err) {
      throw err
    }
  }
}