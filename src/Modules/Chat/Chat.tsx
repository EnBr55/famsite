import React from 'react'
import './Chat.css'
import firebaseRef from '../../firebase'
import { UserContext } from '../../Contexts/UserContext'
import TextInput from '../../Components/TextInput/TextInput'
import SendIcon from '@material-ui/icons/Send';

type props = {
  boardId: string
  moduleId: string
}

type message = {
  senderName: string
  senderId: string
  content: string
  time: number
  id: string
}

const Chat: React.FC<props> = ({ boardId, moduleId }) => {
  const user = React.useContext(UserContext)
  const [messages, setMessages] = React.useState<message[]>([])
  const [title, setTitle] = React.useState('')
  const [message, setMessage] = React.useState('')

  const ref = firebaseRef
    .firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)
    .collection('data')

  React.useEffect(() => {
    firebaseRef
      .firestore()
      .collection('boards')
      .doc(boardId)
      .collection('modules')
      .doc(moduleId)
      .get()
      .then((doc) => setTitle(doc.data()!.name || 'Chat'))
    const unsubscribe = ref.onSnapshot((snapshot) => {
      const newMessages: message[] = []
      snapshot.forEach((doc) => {
        newMessages.push({
          senderName: doc.data().senderName,
          senderId: doc.data().senderId,
          content: doc.data().content,
          time: doc.data().time,
          id: doc.id,
        })
      })
      setMessages([...messages, ...newMessages])
    })
    return unsubscribe
  }, [])

  const sendMessage = (newMessage: string) => {
    ref.add({
      senderName: user.name,
      senderId: user.id,
      content: newMessage,
      time: new Date().getTime(),
    })
  }

  const sortByDate = (a: message, b: message) => {
    return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0) 
  }

  return (
    <div className="chat">
      <h2> {title} </h2>
      <div className="messages">
        {messages.sort(sortByDate).map((message) => (
          <>
          <div key={message.id} className="message" style={{
            backgroundColor: message.senderId === user.id ? '#3074e3' : '#9fab8c',
            float: message.senderId === user.id ? 'right' : 'left'
          }}>
            <div className="sender-date">
              <div className="message-sender">
                <b>{message.senderName}:&nbsp;</b>
              </div>
              <div className="message-date">
                {new Date(message.time).toLocaleTimeString()}
              </div>
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        </>
        ))}
      </div>
      <br />
      <div className="sending">
        <TextInput placeholder={'Aa'} callback={sendMessage} submitText={<SendIcon />}/>
      </div>
    </div>
  )
}

export default Chat
