import React from 'react'
import './Sidebar.css'
import { UserContext } from '../../Contexts/UserContext'
import Boards from '../Boards/Boards'

type props = {
  open: boolean
  toggleSidebar(): void
  setBoard(board: boardRef): void
}

type boardRef = {
  board: string
  module: string
  moduleType: string
}

const Sidebar: React.FC<props> = ({ open, toggleSidebar, setBoard }) => {
  const user = React.useContext(UserContext)
  return (
    <div className='sidebar' style={{ transform: open ? 'translateX(0)' : 'translateX(-110%)' }}>
      <div className='background' onClick={() => toggleSidebar()}>
        <div className='visible' onClick={(e) => {e.stopPropagation()}} style={{ transform: open ? 'translateX(0)' : 'translateX(-110%)' }}>
          {user.loggedIn ? <Boards setBoard={setBoard} toggleSidebar={toggleSidebar}/> : 'You\'re not logged in.'}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
