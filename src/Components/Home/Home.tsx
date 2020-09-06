import React from 'react'
import './Home.css'

import { UserContext } from '../../Contexts/UserContext'
import { User } from '../../Models/Users'
import { BoardRef } from '../../Models/Boards'

const getBookmarks = (user: User, setBoard: (board: BoardRef | undefined) => void) => {
  return (
    <div className='Bookmarks'>
      { user.bookmarks.map(bookmark => <div key={bookmark.reference.module} className='Bookmark'>
        <h3 onClick={() => setBoard(bookmark.reference)}>{bookmark.name}</h3>
        </div>) }
    </div>
  )
}

type props = {
  setBoard(board: BoardRef | undefined): void
}

const Home: React.FC<props> = ({ setBoard }) => {
  const user = React.useContext(UserContext)
  console.log(user)
  return (
    <div className='Home'>
      <h3>{user.id ? getBookmarks(user, setBoard) : 'Welcome. You are not currently logged in.'}</h3>
    </div>
  )
}

export default Home
