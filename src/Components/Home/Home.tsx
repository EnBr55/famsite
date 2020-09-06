import React from 'react'
import './Home.css'

import { UserContext } from '../../Contexts/UserContext'
import { User } from '../../Models/Users'

const getBookmarks = (user: User) => {
  return (
    <div className='Bookmarks'>
      { user.bookmarks.map(bookmark => <div key={bookmark.reference.module} className='Bookmark'>
          <h3>{bookmark.name}</h3>
        </div>) }
    </div>
  )
}

const Home: React.FC = () => {
  const user = React.useContext(UserContext)
  console.log(user)
  return (
    <div className='Home'>
      <h3>{user.id ? getBookmarks(user) : 'Welcome. You are not currently logged in.'}</h3>
    </div>
  )
}

export default Home
