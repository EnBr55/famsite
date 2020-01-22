import React from 'react'
import './UserSearch.css'
import firebaseRef from '../../firebase'
import { User, defaultUser } from '../../Models/Users'

type props = {
  callback(result: User[]): void
}

const queryUsers = (
  search: string,
  setLoading: (loading: boolean) => void,
  callback: (result: User[]) => void,
) => {
  setLoading(true)
  // clear previous results
  callback([])
  const result: User[] = []
  const ref = firebaseRef.firestore().collection('users')
  ref
    .orderBy('nameLower')
    .startAt(search)
    .endAt(search + '\uf8ff')
    .limit(3)
    .get()
    .then((results) => {
      const usernames: string[] = []
      results.forEach((user) => {
        result.push({
          ...defaultUser,
          ...user.data(),
        })
        usernames.push(user.data().usernameLower)
      })
      ref
        .orderBy('usernameLower')
        .startAt(search)
        .endAt(search + '\uf8ff')
        .limit(3)
        .get()
        .then((results) => {
          results.forEach((user) => {
            // push if not in currentUsernames
            if (!usernames.includes(user.data().usernameLower)) {
              result.push({
                ...defaultUser,
                ...user.data(),
              })
            }
          })
          setLoading(false)
          callback(result)
        })
    })
}

const UserSearch: React.FC<props> = ({ callback }) => {
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  return (
    <div>
      <input
        placeholder="Name or Username"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && queryUsers(search.toLowerCase(), setLoading, callback)
        }
      />
      <button onClick={() => queryUsers(search.toLowerCase(), setLoading, callback)}>
        Search
      </button>
      {loading && <p>Loading...</p>}
    </div>
  )
}

export default UserSearch
