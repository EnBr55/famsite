import React from 'react'
import './Sidebar.css'
import { UserContext } from '../../Contexts/UserContext'
import Boards from '../Boards/Boards'

type props = {
  open: boolean
  toggleSidebar(): void
}

const Sidebar: React.FC<props> = ({ open, toggleSidebar }) => {
  const user = React.useContext(UserContext)
  return (
    <div className='sidebar' style={{ transform: open ? 'translateX(0)' : 'translateX(-110%)' }}>
      <div className='background' onClick={() => toggleSidebar()}>
        <div className='visible' onClick={(e) => {e.stopPropagation()}} style={{ transform: open ? 'translateX(0)' : 'translateX(-110%)' }}>
          {user.loggedIn ? <Boards /> : 'You\'re not logged in.'}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
