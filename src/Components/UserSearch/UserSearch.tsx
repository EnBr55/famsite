import React from 'react'
import './UserSearch.css'
import firebaseRef from '../../firebase'

type props = {
  callback(result: user[]): void
}

type module = {
  id: string
  type: string
  name: string
}

type board = {
  members: string[]
  name: string
  id: string
  dateCreated: number
}

type user = {
  boards: board[]
  email: string
  name: string
  id: string
}

const queryUsers = (search: string, callback: (result: user[]) => void) => {
  const result: user[] = []
  firebaseRef
    .firestore()
    .collection('users')
    .orderBy('name')
    .startAt(search)
    .endAt(search + '\uf8ff')
    .limit(5)
    .get()
    .then((results) => {
      results.forEach((user) => {
        result.push({
          boards: user.data().boards,
          email: user.data().email,
          id: user.data().id,
          name: user.data().name,
        })},
      )
      callback(result)
    })
}

const UserSearch: React.FC<props> = ({ callback }) => {
  const [search, setSearch] = React.useState('')
  return (
    <div>
      <input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
      <button onClick={() => queryUsers(search, callback)}>Search</button>
    </div>
  )
}

export default UserSearch
