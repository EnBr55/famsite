import React from 'react'
import './Navbar.css'
import Hamburger from '../Hamburger/Hamburger'
import { UserContext } from '../../Contexts/UserContext'
import { SidebarContext } from '../../Contexts/SidebarContext'
import { Board, BoardRef } from '../../Models/Boards'
import firebaseRef from '../../firebase'
import HomeIcon from '@material-ui/icons/Home'

type props = {
  setLogin(): void
  setBoard(board: BoardRef | undefined): void
}

const Navbar: React.FC<props> = ({ setLogin, setBoard }) => {
  const user = React.useContext(UserContext)
  const sidebar = React.useContext(SidebarContext)
  const [notifications, setNotifications] = React.useState(0)

  React.useEffect(() => {
    if (user.id) {
      const unsubscribe = firebaseRef
        .firestore()
        .collection('users')
        .doc(user.id)
        .collection('notifications')
        .onSnapshot((snapshot) => {
          setNotifications(snapshot.docs.length)
        })

      return unsubscribe
    }
  }, [user.id])

  return (
    <div className="navbar">
      <div className="inner">
        <div className="left">
          <div className="padded">
            <Hamburger/>
          </div>
        </div>
        <div className="center">
          <HomeIcon className="home" onClick={() => {setBoard(undefined); sidebar.setSidebar(undefined)}}/>
        </div>
        <div className="right">
          <div className="user padded" onClick={() => setLogin()}>
            {notifications > 0 && <div className="notifications-circle">{notifications}</div>}
            {user.name !== '' ? user.name : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Navbar
