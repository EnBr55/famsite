import React from 'react'

const defaultUser = {
  loggedIn: false,
  email: '',
  id: '',
  name: ''
}

export const UserContext = React.createContext(defaultUser)
export const UserProvider = UserContext.Provider
export const UserConsumer = UserContext.Consumer
