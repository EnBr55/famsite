import React from 'react'
import './Navbar.css'
import Hamburger from '../Hamburger/Hamburger'
import { UserContext } from '../../Contexts/UserContext'
import firebaseRef from '../../firebase'

type props = {
  setLogin(): void
}

const Navbar: React.FC<props> = ({ setLogin }) => {
  const user = React.useContext(UserContext)
  const [notifications, setNotifications] = React.useState(0)

  React.useEffect(() => {
    if (user.id) {
      const unsubscribe = firebaseRef
        .firestore()
        .collection('users')
        .doc(user.id)
        .collection('notifications')
        .onSnapshot((snapshot) => {
          console.log(snapshot)
          setNotifications(snapshot.docs.length)
        })

      return unsubscribe
    }
  }, [user.id])

  return (
    <div className="navbar">
      <div className="inner">
        <div className="left padded">
          <Hamburger />
        </div>
        <div className="center padded"></div>
        <div className="right padded" onClick={() => setLogin()}>
          {notifications > 0 && <div className="notifications-circle">{notifications}</div>}
          {user.name !== '' ? user.name : 'Login'}
        </div>
      </div>
    </div>
  )
}
export default Navbar
