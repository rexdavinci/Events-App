import React, {useState, createRef, useContext} from 'react';
import './Auth.css'
import { AuthContext } from '../context/auth-context';

const AuthPage = () => {
  const { login } = useContext(AuthContext)
  const [isLogin, setLogin] = useState(true)
  const emailEl = createRef()
  const passwordEl = createRef()
  const switchMode = () => {
    setLogin(!isLogin)
  }

  
  const submit = async e => {
    e.preventDefault()
    const email = emailEl.current.value.trim().toLowerCase()
    const password = passwordEl.current.value.trim()
    if(email.length === 0  || password.length === 0){
      return null
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!){
          login(email: $email, password: $password){
            id
            email
            loginInfo {
              userId
              token
              tokenExpiration
            }
            events {
              title
              description
              price
              date
            }
            myBookings {
              bookedEvent {
                title
                price
                description
                date
              }
            }
          }
        }
      `,
      variables: {
        email, password
      }
    }
    
    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}){
              id
              email
              loginInfo {
                userId
                token
                tokenExpiration
              }
              events {
                title
                description
                price
                date
              }
              myBookings {
                id
                bookedEvent {
                  title
                  price
                  date
                  description
                }
              }
            }
          }
        `,
        variables:{
          email: email,
          password: password
        }
      }
    }

    try {
      const request = await fetch('http://localhost:5500/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const response = await request.json()
      const info = response.data  
      const { login: loginUser } = info
      const { createUser } = info
      if(response.errors){
        console.log(response.errors[0].message)
      }
      const loginOrRegister = action => {
        return login(action.loginInfo.token, action.id)
      }
      if(loginUser){
        loginOrRegister(loginUser)
      }
      if(createUser){
        loginOrRegister(createUser)
      }
    }catch(err){
      return err
    }
  }



  return (
    <form className = "auth-form" onSubmit = {submit}>
      <div className = "form-control">
        <label htmlFor = "email">E-mail:</label>
        <input type="email" id ="email" ref = {emailEl}/>
      </div>
      <div className = "form-control">
        <label htmlFor = "password"> Password:</label>
        <input type = "password" id="password" ref = {passwordEl}/>
      </div>
      <div className = "form-actions" >
        <button type = "submit" > {
          !isLogin ? 'Signup' : 'Login'
        } </button>
        <button type = "button" onClick = {switchMode}>
        Switch to {
          isLogin ? 'Signup' : 'Login'
        }</button>
      </div>
      </form>
  );
}

export default AuthPage;