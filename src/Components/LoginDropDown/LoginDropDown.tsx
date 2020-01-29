import React from 'react'
import './LoginDropDown.css'
import CloseIcon from '@material-ui/icons/Close'
import Login from '../Login/Login'
import Profile from '../Profile/Profile'
import { UserContext } from '../../Contexts/UserContext'

type props = {
  loggedIn: boolean
  open: boolean
  toggleLogin(): void
}

const LoginDropDown: React.FC<props> = ({ loggedIn, open, toggleLogin }) => {
  const user = React.useContext(UserContext)
  return (
    <div className="LoginDropDown" style={{ 
      transform: open ? 'translateY(0)' : 'translateY(calc(-100% - 1em))',
      height: open ? 'calc(100vh - 3em)' : '1vh',
      width: open ? '100vw' : '1vh',
      }}>
      <div className="cross" onClick={() => toggleLogin()} > <CloseIcon /> </div>
      { user.name !== '' ? <Profile /> : <Login open={open} /> }
    </div>
  )
}

export default LoginDropDown
