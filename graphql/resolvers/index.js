const authResolver = require('./auth')
const eventResolver = require('./events')
const bookingResolver = require('./bookings')

module.exports = {  
  ...authResolver,
  ...eventResolver,
  ...bookingResolver
}