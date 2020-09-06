import { Board, BoardRef } from './Boards'

export interface Bookmark {
  name: string
  reference: BoardRef
}

export interface User {
  boards: Board[]
  bookmarks: Bookmark[]
  email: string
  name: string
  nameLower: string
  username: string
  usernameLower: string
  id: string
  picURL: string
}

export const defaultUser: User = {
  boards: [],
  bookmarks: [],
  email: '',
  name: '',
  nameLower: '',
  username: '',
  usernameLower: '',
  id: '',
  picURL: ''
}
