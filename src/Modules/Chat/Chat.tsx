import React from 'react'
import './Chat.css'
import firebaseRef from '../../firebase'

type props = {
  boardId: string
  moduleId: string
}

type message = {
  senderName: string
  content: string
  time: number
  id: string
}

const Chat: React.FC<props> = ({ boardId, moduleId }) => {
  const [messages, setMessages] = React.useState<message[]>([])
  const [title, setTitle] = React.useState('')

  const ref = firebaseRef.firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)
    .collection('data')

  React.useEffect(() => {
    firebaseRef.firestore()
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
          content: doc.data().content,
          time: doc.data().time,
          id: doc.id,
        })
      })
      setMessages([...messages, ...newMessages])
    })
    return unsubscribe
  }, [])

  console.log(messages)

  return (
    <div className="chat">
      <h1> {title} </h1>
      {messages.map((message) => <div key={message.id} className="message">
        <b>{message.senderName}: </b>
        {message.content}
        <div className="message-date">{new Date(message.time).toUTCString()}</div>
      </div>)}
      <br />
      <div className="sending">
        <input />
        <button>Send</button>
      </div>
    </div>
  )
}

export default Chat
