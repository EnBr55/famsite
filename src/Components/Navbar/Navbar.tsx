import React from 'react'
import './Navbar.css'
import Hamburger from '../Hamburger/Hamburger'
import { UserContext } from '../../Contexts/UserContext'

type props = {
  setLogin(): void
}

const Navbar: React.FC<props> = ({ setLogin }) => {
  const user = React.useContext(UserContext)
  return (
    <div className='navbar'>
      <div className='inner'>
        <div className='left padded'>
          <Hamburger />
        </div>
        <div className='center padded'>
        </div>
        <div className='right padded' onClick={() => setLogin()}>
          { user.name !== '' ? user.name : 'Login' }
        </div>
      </div>
    </div>
  )
}
export default Navbar
