const argon = require('argon2')
const sizeof = require('object-sizeof')
const jwt = require('jsonwebtoken')
const { User, Event, Booking } = require('../../db/models')
const { getMyEventsFrom, formatedItem, formatedItems, singleUser, userBookings } = require('../../helpers')

const signToken = user => {
  const token = jwt.sign({
    userId: user.id,
    email: user.email
  }, process.env.JWT_KEY, {expiresIn: '1h'})

  return {userId: user.id, token, tokenExpiration: 1}
}

module.exports = {
  createUser: async args => {
    const { userInput } = args
    try {
      const passwordHash = await argon.hash(userInput.password, {type: argon.argon2id})
      const user = await User.findOrCreate({where: {
        email: userInput.email.toLowerCase()
      },
        defaults: { password: passwordHash },
        include: [
          {model: Event, as: 'events'}, 
          {model: Event, as: 'booked'}
        ],
      })
      if(user){
        const valid = await argon.verify(user[0].password, userInput.password)
        if(valid){
          const loginInfo = signToken(user[0])
          const myBookings = await userBookings(user[0].id)
          // console.log('=======SIZE OF RESPONSE========:', sizeof({...formatUser(user[0]), loginInfo}))
          const result = await singleUser(user[0].id)
          return {
            ...result,
            loginInfo, 
            myBookings
          }
        }
        return new Error('You should sign in instead')
      }
    }catch(err){
      throw err
    }
  },
  login: async args => {
    const { email, password } = args
    try{
      const user = await User.findOne({
        where: {email}, 
        include: [
          {model: Event, as: 'events'}, 
          {model: Event, as: 'booked'}
        ]})
      if(!user){
        throw new Error('Invalid Credentials')
      }
      const valid = await argon.verify(user.password, password)
      if(valid){
        const loginInfo = signToken(user)
        const myBookings = await userBookings(user.id)
        const result = await singleUser(user.id)
        return {
          ...result,
          loginInfo, 
          myBookings
        }
      }
      throw new Error('Credentials does not match')
    }catch(err){
      throw err
    }
  }
}