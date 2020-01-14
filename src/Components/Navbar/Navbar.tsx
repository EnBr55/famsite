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
        <div className='left padded'>
          <Hamburger toggleSidebar={toggleSidebar}/>
        </div>
        <div className='center padded'>
          Famsite
        </div>
        <div className='right padded'>
          right
        </div>
      </div>
    </div>
  )
}
export default Navbar
