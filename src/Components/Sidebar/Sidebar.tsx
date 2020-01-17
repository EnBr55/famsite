import React from 'react'
import './Sidebar.css'
import { UserContext } from '../../Contexts/UserContext'
import { SidebarContext } from '../../Contexts/SidebarContext'
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
  const sidebar = React.useContext(SidebarContext)
  return (
    <div className='sidebar' style={{ transform: sidebar.sidebar ? 'translateX(0)' : 'translateX(-110%)' }}>
      <div className='background' onClick={() => toggleSidebar()}>
        <div className='visible' onClick={(e) => {e.stopPropagation()}} style={{ transform: sidebar.sidebar ? 'translateX(0)' : 'translateX(-110%)' }}>
          {user.loggedIn ? sidebar.sidebar : 'You\'re not logged in.'}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
