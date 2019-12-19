const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Booking {
      id: ID!
      bookedEvent: Event!
      booker: User!
      createdAt: String!
      updatedAt: String!
    }

    type Event {
      id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
      bookings: [Booking!]!
    }

    type User {
      id: ID!
      email: String!
      password: String
      events: [Event!]!
      myBookings: [Booking!]!
      loginInfo: AuthData!
    }

    type AuthData {
      userId: ID!
      token: String!
      tokenExpiration: Int!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
      bookings: [Booking!]!
      login(email: String!, password: String!): User
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
      bookEvent(eventId: ID!): Booking!
      cancelBooking(bookingId: ID!): Event!
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `)