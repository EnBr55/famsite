import React from 'react'
import './Chat.css'
import firebaseRef from '../../firebase'
import { UserContext } from '../../Contexts/UserContext'
import TextInput from '../../Components/TextInput/TextInput'
import SendIcon from '@material-ui/icons/Send'
import LoadingBar from '../../Components/LoadingBar/LoadingBar'

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

const defaultMessage = {
  senderName: '',
  senderId: '',
  content: '',
  time: 0,
  id: '',
}

const Chat: React.FC<props> = ({ boardId, moduleId }) => {
  const user = React.useContext(UserContext)
  const [messages, setMessages] = React.useState<message[]>([])
  const [title, setTitle] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const messageLoadAmount = 5
  const [
    messageSnapshot,
    setMessageSnapshot,
  ] = React.useState<null | firebase.firestore.QueryDocumentSnapshot>(null)
  const [listeners, setListeners] = React.useState<(() => void)[]>([])
  const [lastMessage, setLastMessage] = React.useState<message | null>(null)

  const ref = firebaseRef
    .firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)

  const createInitialListener = () => {
    setLoading(true)
    ref
      .collection('data')
      .orderBy('time', 'desc')
      .startAfter(Infinity)
      .limit(messageLoadAmount)
      .get()
      .then((query) => {
        let end = query.docs[query.docs.length - 1]
        setMessageSnapshot(end)
        const unsubscribe = ref
          .collection('data')
          .orderBy('time', 'desc')
          .startAt(Infinity)
          .endAt(end || 0)
          .onSnapshot((snapshot) => {
            const newMessages: message[] = []
            snapshot.forEach((doc) => {
              newMessages.push({ ...defaultMessage, ...doc.data(), id: doc.id })
            })
            setMessages((previousMessages) =>
              [...previousMessages, ...newMessages].filter(
                (msg, index, self) =>
                  index === self.findIndex((t) => t.id === msg.id),
              ),
            )
          })
        setListeners([...listeners, unsubscribe])
        setLoading(false)
      })
  }

  const createNextListener = () => {
    setLoading(true)
    ref
      .collection('data')
      .orderBy('time', 'desc')
      .startAfter(messageSnapshot === null ? Infinity : messageSnapshot)
      .limit(messageLoadAmount)
      .get()
      .then((query) => {
        let start = messageSnapshot
        let end = query.docs[query.docs.length - 1]
        if (!end) {
          return
        }
        setMessageSnapshot(end)
        const unsubscribe = ref
          .collection('data')
          .orderBy('time', 'desc')
          .startAfter(start)
          .endAt(end)
          .onSnapshot((snapshot) => {
            const newMessages: message[] = []
            snapshot.forEach((doc) => {
              newMessages.push({ ...defaultMessage, ...doc.data(), id: doc.id })
            })
            setMessages((previousMessages) =>
              [...previousMessages, ...newMessages].filter(
                (msg, index, self) =>
                  index === self.findIndex((t) => t.id === msg.id),
              ),
            )
          })
        setListeners([...listeners, unsubscribe])
        setLoading(false)
      })
  }

  React.useEffect(() => {
    ref.get().then((doc) => setTitle(doc.data()!.name || 'Chat'))
    ref
      .collection('data')
      .orderBy('time')
      .limit(1)
      .get()
      .then((msg) => {
        if(msg.docs.length > 0) {
          setLastMessage({
            ...defaultMessage,
            ...msg.docs[0].data(),
            id: msg.docs[0].id,
          })
        }
      })
    createInitialListener()
    return () => {
      listeners.forEach((listener) => listener())
    }
  }, [boardId, moduleId])

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
    createNextListener()
  }

  const sortByDate = (a: message, b: message) => {
    return a.time > b.time ? 1 : b.time > a.time ? -1 : 0
  }

  return (
    <div className="chat">
      <h2> {title} </h2>
      <div className="messages">
        {(!loading && lastMessage !== null && !messages.find(msg => msg.id === lastMessage.id)) && 
          <div className="load-more" onClick={() => loadMore()}>
            Load More
          </div>
        }
        {loading && <LoadingBar />}
        {messages.sort(sortByDate).map((message) => (
          <div
            key={message.id}
            className="message"
            style={{
              backgroundColor:
                message.senderId === user.id ? '#3074e3' : '#9fab8c',
              float: message.senderId === user.id ? 'right' : 'left',
            }}
          >
            <div className="sender-date">
              <div className="message-sender">
                <b>{message.senderName}:&nbsp;</b>
              </div>
              <div className="message-date">
                {new Date(message.time).toLocaleTimeString()}
              </div>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
      </div>
      <br />
      <div className="sending">
        <TextInput
          placeholder={'Aa'}
          callback={sendMessage}
          submitText={<SendIcon />}
        />
      </div>
    </div>
  )
}

export default Chat
