import React from 'react'
import { defaultUser } from '../Models/Users'

export const UserContext = React.createContext(defaultUser)
export const UserProvider = UserContext.Provider
export const UserConsumer = UserContext.Consumer
