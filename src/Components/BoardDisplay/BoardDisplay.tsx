import React from 'react'
import firebase from 'firebase'
import './BoardDisplay.css'
import firebaseRef from '../../firebase'
import UserSearch from '../UserSearch/UserSearch'
import BoardSettings from '../BoardSettings/BoardSettings'
import { SidebarContext } from '../../Contexts/SidebarContext'
import { UserContext } from '../../Contexts/UserContext'
import { User, Bookmark } from '../../Models/Users'
import { Board, BoardRef, Module } from '../../Models/Boards'
import FullscreenModal from '../FullscreenModal/FullscreenModal'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import EditIcon from '@material-ui/icons/Edit'
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import EventIcon from '@material-ui/icons/Event';
import ChatIcon from '@material-ui/icons/Chat';
import ListAltIcon from '@material-ui/icons/ListAlt';


type props = {
  setBoard(board: BoardRef | undefined): void
  board: Board
  modules: Module[]
}

type notification = {
  text: string
  id: string
  senderName?: string
  senderId?: string
  boardJoinId: string
}

const BoardDisplay: React.FC<props> = ({ setBoard, board, modules }) => {
  const sidebar = React.useContext(SidebarContext)
  const user = React.useContext(UserContext)
  const [newModuleName, setNewModuleName] = React.useState('')
  const [newModuleType, setNewModuleType] = React.useState('')
  const [userList, setUserList] = React.useState<string[]>([])
  const [searchedUsers, setSearchedUsers] = React.useState<User[]>([])
  const [modal, setModal] = React.useState<JSX.Element>()

  React.useEffect(() => {
    const unsubscribe = firebaseRef
      .firestore()
      .collection('boards')
      .doc(board.id)
      .onSnapshot((snapshot) => {
        const members: string[] = snapshot.data()!.members
        const memberNames: string[] = []
        let counter = 0
        members.forEach((member) => {
          firebaseRef
            .firestore()
            .collection('users')
            .doc(member)
            .get()
            .then((doc) => {
              memberNames.push(doc.data()!.name)
              counter++
              if (counter === members.length) {
                setUserList(memberNames)
              }
            })
        })
      })
    return unsubscribe
  }, [board.id])

  const inviteUserToBoard = (board: Board, userId: string) => {
    firebaseRef
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .add({
        text: `${user.name} invited you to join the board, '${board.name}'.`,
        senderName: user.name,
        senderId: user.id,
        boardJoinId: board,
      })
  }

  const isBookmarked = (id: string) => {
    return user.bookmarks.filter(bookmark => bookmark.reference.module === id).length
  }

  const getModuleIcon = (moduleType: string) => {
    switch(moduleType) {
      case 'todo':
        return <ListAltIcon />
      case 'calendar':
        return <EventIcon />
      case 'chat':
        return <ChatIcon />
      default:
        return <></>
    }
  }

  const moduleList = modules.map((module) => (
    <div key={module.id} className="module-tag">
      <div className="type-label">{getModuleIcon(module.type)}</div>
      <div
        className="module"
        key={module.id}
        onClick={() => {
          const selectedBoard = {
            board: board.id,
            moduleType: module.type,
            module: module.id,
          }
          localStorage.setItem('selectedBoard', JSON.stringify(selectedBoard))
          setBoard(selectedBoard)
          sidebar.setSidebar(undefined)
        }}
      >
      {module.name}
      <div className="bookmarker">
        {isBookmarked(module.id) 
        ? <StarIcon onClick={e => {
          e.stopPropagation()
          firebaseRef
            .firestore()
            .collection('users')
            .doc(user.id)
            .update({
              bookmarks: firebase.firestore.FieldValue.arrayRemove({
                name: module.name,
                reference: {board: board.id, module: module.id, moduleType: module.type}
              }),
          }).catch(e => console.log(e))
          }}/>
        : <StarBorderIcon onClick={e => {
          e.stopPropagation()
          firebaseRef
            .firestore()
            .collection('users')
            .doc(user.id)
            .update({
              bookmarks: firebase.firestore.FieldValue.arrayUnion({
                name: module.name,
                reference: {board: board.id, module: module.id, moduleType: module.type}
              }),
          }).catch(e => console.log(e))
          }}/>
          }
      </div>
      </div>
      <div className="right">
        <DeleteForeverIcon
          style={{cursor: 'pointer'}}
          onClick={(e) => {
            e.stopPropagation()
            setModal(
              <div>
                Are you sure you want to delete {module.name}?
                <br />
                <button
                  onClick={() => {
                    firebaseRef
                      .firestore()
                      .collection('boards')
                      .doc(board.id)
                      .collection('modules')
                      .doc(module.id)
                      .delete()
                      .then(() => {setModal(undefined); sidebar.setSidebar(sidebar.default)})
                  }}
                >
                  Yes
                </button>
                <button onClick={() => setModal(undefined)}>No</button>
              </div>,
            )
          }}
        />
      </div>
    </div>
  ))

  const createModule = (
    board: Board,
    newModuleName: string,
    newModuleType: string,
  ) => {
    firebaseRef
      .firestore()
      .collection('boards')
      .doc(board.id)
      .collection('modules')
      .add({
        name: newModuleName,
        type: newModuleType,
      })
      .then((doc) => {
        setBoard({
          board: board.id,
          moduleType: newModuleType,
          module: doc.id,
        })
        sidebar.setSidebar(undefined)
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className="board">
      {modal && (
        <FullscreenModal element={modal} setModal={setModal} closeable={true} />
      )}
      <h1>{board.name}</h1>
      <div className="top-bar">
        <div
          className="top-bar-button"
          onClick={() => sidebar.setSidebar(sidebar.default)}
        >
          <ArrowBackIcon /> <span> back </span>
        </div>
        <div
          className="top-bar-button"
          onClick={() =>
            setModal(<BoardSettings setBoard={setBoard} setModal={setModal} board={board} />)
          }
        >
          <EditIcon />
        </div>
      </div>
      {moduleList}
      <br />
      <hr />
      <br />
      <br />
      <p>New module</p>
      <input
        placeholder="Module Name"
        onChange={(e) => setNewModuleName(e.target.value)}
      />
      <select
        defaultValue="a"
        onChange={(e) => setNewModuleType(e.target.value)}
      >
        <option disabled value="a">
          Module type
        </option>
        <option value="todo">Todo</option>
        <option value="chat">Chat</option>
        <option value="calendar">Calendar</option>
      </select>
      <button
        disabled={newModuleType === '' || newModuleName === ''}
        onClick={() => createModule(board, newModuleName, newModuleType)}
      >
        Create New Module
      </button>
      <br />
      <br />
      <h3>Members</h3>
      {userList.map((user) => (
        <li key={user}>{user}</li>
      ))}
      <br />
      <h3> Invite New Members </h3>
      <UserSearch callback={setSearchedUsers} />
      {searchedUsers.map((user) => (
        <div key={user.id}>
          <div className="searched-user-grid">
            <div className="searched-user-profile-pic">
              <img
                alt="profile-pic"
                src={user.picURL}
                width="100%"
                height="100%"
              />
            </div>
            <div className="searched-user-text">{user.name}</div>
            <div className="searched-user-text">
              <i>{user.username}</i>
            </div>
            <div>
              <button
                onClick={() => {
                  inviteUserToBoard(board, user.id)
                  setSearchedUsers([])
                }}
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default BoardDisplay
