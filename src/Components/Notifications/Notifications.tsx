import React from 'react'
import firebaseRef from '../../firebase'
import { UserContext } from '../../Contexts/UserContext'

type notification = {
  text: string
  id: string
  senderName?: string
  senderId?: string
  boardJoinId: string
}

const defaultNotification = {
  text: '',
  senderName: '',
  senderId: '',
  boardJoinId: ''
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState<notification[]>([])
  const user = React.useContext(UserContext)

  React.useEffect(() => {
    const unsubscribe = firebaseRef
      .firestore()
      .collection('users')
      .doc(user.id)
      .collection('notifications')
      .onSnapshot((snapshot) => {
        const newNotifications: notification[] = []
        snapshot.forEach(doc => {
          newNotifications.push({
            ...defaultNotification,
            ...doc.data(),
            id: doc.id
          })
        })
        setNotifications(newNotifications)
      })
    return unsubscribe
  }, [])

  return <div className="notifications">
    {notifications.map(notification => 
      <div className="notification" key={notification.id}>
        {notification.text}
        <br/>
        <button>tick</button>
        <button>cross</button>
      </div>
    )}
  </div>
}

export default Notifications
