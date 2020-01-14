import React from 'react'
import './LoginDropDown.css'
import CloseIcon from '@material-ui/icons/Close'

type props = {
  loggedIn: boolean
  open: boolean
  toggleLogin(): void
}

const LoginDropDown: React.FC<props> = ({ loggedIn, open, toggleLogin }) => {
  return (
    <div className="LoginDropDown" style={{ transform: open ? 'translateY(0)' : 'translateY(calc(-100% - 4em))' }}>
      <div className="cross" onClick={() => toggleLogin()} > <CloseIcon /> </div>
      oooooooooooooooo
    </div>
  )
}

export default LoginDropDown
