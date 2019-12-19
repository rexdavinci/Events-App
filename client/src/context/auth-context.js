import React, {createContext, useState} from 'react'

export const AuthContext = createContext()

export default function AuthContextProvider ({children}){
  const [state, setState] = useState({
    token: null,
    userId: null
  })

  const login = (token, userId, tokenExpiration) => {
    setState({token: token, userId: userId})
  }

  const logout = () => {
    setState({token: null, userId: null})
  }


  return(
    <AuthContext.Provider value={
      {
        token:state.token,
        userId:state.userId,
        login:login,
        logout:logout
      }
    }>
      {children}
    </AuthContext.Provider>
  )
}
