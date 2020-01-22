import { Board } from './Boards'

export interface User {
  boards: Board[]
  email: string
  name: string
  nameLower: string
  username: string
  usernameLower: string
  id: string
}

export const defaultUser: User = {
  boards: [],
  email: '',
  name: '',
  nameLower: '',
  username: '',
  usernameLower: '',
  id: ''
}