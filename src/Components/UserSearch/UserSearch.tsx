import React from 'react'
import './UserSearch.css'
import firebaseRef from '../../firebase'
import { Module, Board } from '../../Models/Boards'
import { User, defaultUser } from '../../Models/Users'

type props = {
  callback(result: User[]): void
}

const queryUsers = (search: string, callback: (result: User[]) => void) => {
  const result: User[] = []
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
          ...defaultUser, ...user.data()
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
