import React from 'react'
import './Sidebar.css'
import { UserContext } from '../../Contexts/UserContext'
import { SidebarContext } from '../../Contexts/SidebarContext'
import Boards from '../Boards/Boards'

type boardRef = {
  board: string
  module: string
  moduleType: string
}

const Sidebar: React.FC = () => {
  const user = React.useContext(UserContext)
  const sidebar = React.useContext(SidebarContext)
  return (
    <div className='sidebar' style={{ transform: sidebar.sidebar ? 'translateX(0)' : 'translateX(-110%)' }}>
      <div className='background' onClick={() => sidebar.setSidebar(undefined)}>
        <div className='visible' onClick={(e) => {e.stopPropagation()}} style={{ transform: sidebar.sidebar ? 'translateX(0)' : 'translateX(-110%)' }}>
          {user.name !== '' ? sidebar.sidebar : 'You\'re not logged in.'}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
