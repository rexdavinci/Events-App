const { Booking, Event } = require('../../db/models')
const { singleBooking, singleUser, singleEvent } = require('../../helpers')

module.exports = {
  bookings: async (args, req) => {
    if(!req.isAuth){
      throw Error('You need to sign in to do that')
    }
    try {
      const bookings = await Booking.findAll({where: {booker: req.userId}})
      return bookings.map(async booking=>{
        return singleBooking(booking.id)
      })
    } catch (err){
      throw err
    }
  },

  bookEvent: async (args, req) => {
    const { eventId } = args 
    if(!req.isAuth){
      throw Error('You need to sign in to do that')
    }
    try{
      const fetchEvent = await Event.findByPk(eventId)
      const booking = new Booking({
        booker: req.userId,
        bookedEvent: fetchEvent.id
      })
      await booking.save()
      return singleBooking(booking.id)
    }catch(err){
      throw new Error(err)
    }
  },

  cancelBooking: async (args, req) => {
    if(!req.isAuth){
      throw Error('You need to sign in to do that')
    }
    const { bookingId } = args
    try {
      const booking = await Booking.findByPk(bookingId)
      const event = await singleEvent(booking.bookedEvent)
      const bookedEvent = {...event, creator: await singleUser(event.creator)}
      await Booking.destroy({where: { id: booking.id }})
      return bookedEvent
    }catch(err){
      throw err
    }
  }
}
