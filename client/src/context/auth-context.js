import React, {createContext, useState} from 'react'

export const AuthContext = createContext()

export default function AuthContextProvider ({children}){
  const [state, setState] = useState({
    token: null,
    userId: null,
    email: null
  })

  const login = (token, userId, email) => {
    setState({token: token, userId: userId, email: email})
  }

  const logout = () => {
    setState({token: null, userId: null, email: null})
  }


  return(
    <AuthContext.Provider value={
      {
        token: state.token,
        userId:state.userId,
        email: state.email,
        login:login,
        logout:logout
      }
    }>
      {children}
    </AuthContext.Provider>
  )
}
