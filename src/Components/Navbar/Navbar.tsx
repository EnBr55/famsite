import React from 'react'
import './Navbar.css'
import Hamburger from '../Hamburger/Hamburger'
import { UserContext } from '../../Contexts/UserContext'

type props = {
  toggleSidebar(): void
  setLogin(): void
}

const Navbar: React.FC<props> = ({ toggleSidebar, setLogin }) => {
  const user = React.useContext(UserContext)
  console.log(user)
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
          { user.loggedIn ? user.name : 'Login' }
        </div>
      </div>
    </div>
  )
}
export default Navbar
