import React from 'react'
import './Hamburger.css'
import { SidebarContext } from '../../Contexts/SidebarContext'

const Hamburger: React.FC = () => {
  const sidebar = React.useContext(SidebarContext)
  return (
  <div className='hamburger' onClick={() => {
    sidebar.setSidebar(sidebar.sidebar ? undefined : sidebar.default)
    }}>
      <hr/>
      <hr/>
      <hr/>
    </div>
  )
}

export default Hamburger
