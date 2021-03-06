import React from 'react'
import './Chat.css'
import firebaseRef from '../../firebase'
import { UserContext } from '../../Contexts/UserContext'
import TextInput from '../../Components/TextInput/TextInput'
import LoadingBar from '../../Components/LoadingBar/LoadingBar'
import FullscreenModal from '../../Components/FullscreenModal/FullscreenModal'
import SendIcon from '@material-ui/icons/Send'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

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
  imgUrl?: string
  edited?: boolean
}

const defaultMessage = {
  senderName: '',
  senderId: '',
  content: '',
  time: 0,
  id: '',
}

const storageRef = firebaseRef.storage().ref()

const Chat: React.FC<props> = ({ boardId, moduleId }) => {
  const user = React.useContext(UserContext)
  const [messages, setMessages] = React.useState<message[]>([])
  const [messagesEndRef, setMessagesEndRef] = React.useState<HTMLDivElement | null>(null)
  const [title, setTitle] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [modal, setModal] = React.useState<JSX.Element | undefined>(undefined)
  const messageLoadAmount = 15
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
            setMessages((previousMessages) => {
              let oldMessages = previousMessages
              // replace old messages with updated messages
              newMessages.forEach(
                (msg) =>
                  (oldMessages = oldMessages.filter((t) => t.id !== msg.id)),
              )
              snapshot
                .docChanges()
                .filter((change) => change.type === 'removed')
                .forEach(
                  (removedMessage) =>
                    (oldMessages = oldMessages.filter(
                      (t) => t.id !== removedMessage.doc.id,
                    )),
                )
              return [...oldMessages, ...newMessages]
            })
            if (true) {
              setMessagesEndRef(e => {
                if (e) {
                  e.scrollIntoView({behavior: 'smooth'})
                  return e
                }
                return null
              })
            }
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
            setMessages((previousMessages) => {
              let oldMessages = previousMessages
              // replace old messages with updated messages
              newMessages.forEach(
                (msg) =>
                  (oldMessages = oldMessages.filter((t) => t.id !== msg.id)),
              )
              // remove all messages from delete events
              snapshot
                .docChanges()
                .filter((change) => change.type === 'removed')
                .forEach(
                  (removedMessage) =>
                    (oldMessages = oldMessages.filter(
                      (t) => t.id !== removedMessage.doc.id,
                    )),
                )
              return [...oldMessages, ...newMessages]
            })
          })
        setListeners([...listeners, unsubscribe])
        setLoading(false)
      })
  }


  React.useEffect(() => {
    setMessages([])
    ref.get().then((doc) => setTitle(doc.data()!.name || 'Chat'))
    ref
      .collection('data')
      .orderBy('time')
      .limit(1)
      .get()
      .then((msg) => {
        if (msg.docs.length > 0) {
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

  const sendMessage = (newMessage: string, image?: File) => {
    if ((newMessage && newMessage !== '\n') || image) {
      let messageSentTime = new Date().getTime()
      ref
        .collection('data')
        .add({
          senderName: user.name,
          senderId: user.id,
          content: newMessage,
          time: messageSentTime,
          imgUrl: image
            ? 'https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
            : '',
        })
        .then((sentMessage) => {
          if (image) {
            const imageRef = storageRef.child(
              `images/${boardId}/${moduleId}/${user.id}-${messageSentTime}`,
            )
            imageRef.put(image).then((upload) => {
              upload.ref
                .getDownloadURL()
                .then((url) => {
                  sentMessage.update({ imgUrl: url })
                })
                .catch((error) => console.log(error))
            })
          }
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
      {modal && (
        <FullscreenModal element={modal} setModal={setModal} closeable={true} />
      )}
      <div className="chat-title">
        <h2> {title} </h2>
      </div>
      <div className="messages">
        {!loading &&
          lastMessage &&
          !messages.find((msg) => msg.id === lastMessage.id) && (
            <div className="load-more" onClick={() => loadMore()}>
              Load More
            </div>
          )}
        {loading &&
          lastMessage &&
          !messages.find((msg) => msg.id === lastMessage.id) && <LoadingBar />}
        {messages.sort(sortByDate).map((message) => (
          <div
            key={message.id}
            className="message"
            onClick={() =>
              message.senderId === user.id &&
              setModal(
                <div>
                  <TextInput
                    initialValue={message.content}
                    callback={(editedMessage) => {
                      ref
                        .collection('data')
                        .doc(message.id)
                        .update({ content: editedMessage, edited: true })
                      setModal(undefined)
                    }}
                    submitText={<EditIcon />}
                  />
                  <br />
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <DeleteIcon
                      className="cross"
                      onClick={() => {
                        ref
                          .collection('data')
                          .doc(message.id)
                          .delete()
                          .then(() => {
                            setModal(undefined)
                            storageRef
                              .child(
                                `images/${boardId}/${moduleId}/${message.senderId}-${message.time}`,
                              )
                              .delete()
                          })
                      }}
                    />
                  </div>
                </div>,
              )
            }
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
            <div className="message-content">
              {message.imgUrl && (
                <>
                  <img
                    className="chat-image"
                    src={message.imgUrl}
                    alt="chat message visual element"
                    width="100"
                    height="100"
                    onClick={(e) => {
                      e.stopPropagation()
                      setModal(
                        <>
                          <img
                            src={message.imgUrl}
                            alt="fullscreen"
                            className="image-fullscreen-preview"
                          />
                        </>,
                      )
                    }}
                  />
                  <br />
                </>
              )}
              {message.content}
              {message.edited && (
                <>
                  <br />
                  <EditIcon />
                </>
              )}
            </div>
          </div>
        ))}
      <div ref={setMessagesEndRef} style={{float: 'left', height: '0px', width: '100px'}} ></div>
      </div>
      <div className="sending">
        <div className="sending-input">
          <TextInput
            placeholder={'Aa'}
            callback={sendMessage}
            submitText={<SendIcon />}
            imageUploadCallback={() => {}}
            shrink={true}
          />
        </div>
      </div>
    </div>
  )
}

export default Chat
