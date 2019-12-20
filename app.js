require('dotenv').config()
const express = require('express')
const graphqlHTTP = require('express-graphql')
const playground = require('graphql-playground-middleware-express').default
const compress = require('compression')
const logger = require('morgan')
const sizeof = require('object-sizeof')
const { sequelize } = require('./db/models')
const graphQlSchema = require('./graphql/schema')
const graphQlresolver = require('./graphql/resolvers')
const isAuth = require('./middleware/isAuth')
const app = express()

app.use(express.static('build'))
app.use(compress())
app.use(express.json())
// app.use(logger('dev'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
	}
	next();
});

app.use(isAuth)
app.use(logger('dev'))

app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlresolver,
  graphiql: true
}))

app.use('/playground', playground({
  endpoint: '/graphql'
}))


const port = process.env.PORT

if(process.env.NODE_ENV !== 'production'){
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database successful')
  })
  .then(() => {
    sequelize
    .sync({force: true})
    .then(() => {
      console.log('DB sync successful')
    })
  })
  .then(() => {
    app.listen(port)
    })
    .then(() => console.log(`Server started on ${port}`))
    .catch(err => {
      console.error('Unable to connect to the database:', err)
  })
}

app.listen(port)