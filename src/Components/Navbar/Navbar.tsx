import React from 'react'
import './Navbar.css'
import Hamburger from '../Hamburger/Hamburger'

type props = {
  toggleSidebar(): void
}

const Navbar: React.FC<props> = ({ toggleSidebar }) => {
  return (
    <div className='navbar'>
      <div className='inner'>
        <div className='left'>
          <Hamburger toggleSidebar={toggleSidebar}/>
        </div>
        <div className='center'>
          Famsite
        </div>
        <div className='right'>
          right
        </div>
      </div>
    </div>
  )
}
export default Navbar
