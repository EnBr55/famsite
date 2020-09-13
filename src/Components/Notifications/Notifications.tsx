import React from 'react'
import firebaseRef from '../../firebase'
import firebase from 'firebase'
import { UserContext } from '../../Contexts/UserContext'
import { Board } from '../../Models/Boards'

type notification = {
  text: string
  id: string
  senderName?: string
  senderId?: string
  board: Board
}

const defaultNotification = {
  text: '',
  senderName: '',
  senderId: '',
  board: {members: [], name: '', id: '', dateCreated: 0}
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
        snapshot.forEach((doc) => {
          newNotifications.push({
            ...defaultNotification,
            ...doc.data(),
            id: doc.id,
          })
        })
        setNotifications(newNotifications)
      })
    return unsubscribe
  }, [user.id])

  const joinBoard = (notification: notification) => {
    firebaseRef
      .firestore()
      .collection('boards')
      .doc(notification.board.id)
      .update({ members: firebase.firestore.FieldValue.arrayUnion(user.id) })
      .then(() => {
        // TODO: check that user exists in database first
        firebaseRef
          .firestore()
          .collection('users')
          .doc(user.id)
          .update({
            boards: firebase.firestore.FieldValue.arrayUnion(
              notification.board,
            ),
          })
      })
      .catch((e) => console.log(e))
    removeNotification(notification)
  }

  const removeNotification = (notification: notification) => {
    firebaseRef
      .firestore()
      .collection('users')
      .doc(user.id)
      .collection('notifications')
      .doc(notification.id)
      .delete()
  }

  return (
    <div className="notifications">
      {notifications.length > 0 && <h2>Notifications</h2>}
      {notifications.map((notification) => (
        <div className="notification" key={notification.id}>
          {notification.text}
          <br />
          <button onClick={() => joinBoard(notification)}>tick</button>
          <button onClick={() => removeNotification(notification)}>
            cross
          </button>
        </div>
      ))}
    </div>
  )
}

export default Notifications
