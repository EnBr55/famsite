import React from 'react'
import './Sidebar.css'
import { UserContext } from '../../Contexts/UserContext'
import { SidebarContext } from '../../Contexts/SidebarContext'

const Sidebar: React.FC = () => {
  const user = React.useContext(UserContext)
  const sidebar = React.useContext(SidebarContext)
  return (
    <div className='sidebar' style={{ transform: sidebar.sidebar ? 'translateX(0)' : 'translateX(-110%)' }}>
      <div className='sidebar-content'>
        {user.name !== '' ? sidebar.sidebar : 'You\'re not logged in.'}
      </div>
    </div>
  )
}

export default Sidebar
