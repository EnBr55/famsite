import React from 'react'
import './Navbar.css'
import Hamburger from '../Hamburger/Hamburger'

type props = {
  toggleSidebar(): void
  setLogin(): void
}

const Navbar: React.FC<props> = ({ toggleSidebar, setLogin }) => {
  return (
    <div className='navbar'>
      <div className='inner'>
        <div className='left padded'>
          <Hamburger toggleSidebar={toggleSidebar}/>
        </div>
        <div className='center padded'>
          Famsite
        </div>
        <div className='right padded' onClick={() => setLogin()}>
          right
        </div>
      </div>
    </div>
  )
}
export default Navbar
