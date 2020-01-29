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
  const [messageLimit, setMessageLimit] = React.useState(5)
  // the listener should get the number of messages in the collection.
  // there should be a floating div at the top of the messages that is visible
  // if messageLimit < the number of documents in the collection
  // which on click will load more messages

  const ref = firebaseRef
    .firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)

  React.useEffect(() => {
    const numMessages = 0
    ref.get().then((doc) => setTitle(doc.data()!.name || 'Chat'))
    const unsubscribe = ref.collection('data')
    .orderBy('time', 'desc').limit(messageLimit).onSnapshot((snapshot) => {
      console.log(snapshot.size)
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
      setMessages(newMessages)
      console.log(newMessages)
    })
    return unsubscribe
  }, [messageLimit, boardId, moduleId])

  const sendMessage = (newMessage: string) => {
    if (newMessage && newMessage !== '\n') {
      ref.collection('data').add({
        senderName: user.name,
        senderId: user.id,
        content: newMessage,
        time: new Date().getTime(),
      })
    }
  }

  const loadMore = () => {
    setMessageLimit(messageLimit + 5)
  }

  const sortByDate = (a: message, b: message) => {
    return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0) 
  }

  return (
    <div className="chat">
      <h2> {title} </h2>
      <div className="messages">
        <div className="load-more" onClick={() => loadMore()}>
          Load More
        </div>
        {messages.sort(sortByDate).map((message) => (
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
