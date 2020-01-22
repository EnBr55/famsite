import React from 'react'
import './Board.css'
import firebaseRef from '../../firebase'
import UserSearch from '../UserSearch/UserSearch'
import { SidebarContext } from '../../Contexts/SidebarContext'
import firebase from 'firebase'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

type module = {
  id: string
  type: string
  name: string
}

type board = {
  members: string[]
  name: string
  id: string
  dateCreated: number
}

type boardRef = {
  board: string
  module: string
  moduleType: string
}

type props = {
  setBoard(board: boardRef): void
  board: board
  modules: module[]
}

type user = {
  boards: board[]
  email: string
  name: string
  id: string
}

const addUserToBoard = (board: board, userId: string) => {
  firebaseRef
    .firestore()
    .collection('boards')
    .doc(board.id)
    .update({ members: firebase.firestore.FieldValue.arrayUnion(userId) })
    .then(() => {
      // TODO: check that user exists in database first
      firebaseRef
        .firestore()
        .collection('users')
        .doc(userId)
        .update({ boards: firebase.firestore.FieldValue.arrayUnion(board.id) })
    })
    .catch((e) => console.log(e))
}

const Board: React.FC<props> = ({ setBoard, board, modules }) => {
  const sidebar = React.useContext(SidebarContext)
  const [newUserId, setNewUserId] = React.useState('')
  const [newModuleName, setNewModuleName] = React.useState('')
  const [newModuleType, setNewModuleType] = React.useState('')
  const [userList, setUserList] = React.useState<string[]>([])
  const [searchedUsers, setSearchedUsers] = React.useState<user[]>([])

  React.useEffect(() => {
    const unsubscribe = firebaseRef
      .firestore()
      .collection('boards')
      .doc(board.id)
      .onSnapshot(snapshot => {
        const members: string[] = snapshot.data()!.members
        const memberNames: string[] = []
        let counter = 0
        members.forEach(member => {
          firebaseRef.firestore().collection('users').doc(member).get().then(doc => {
            memberNames.push(doc.data()!.name)
            counter++
            if (counter === members.length) {
              setUserList(memberNames)
            }
          })
        })
      })
    return unsubscribe
  }, [])

  const moduleList = modules.map((module) => (
    <div
      className="module"
      key={module.id}
      onClick={() => {
        setBoard({
          board: board.id,
          moduleType: module.type,
          module: module.id,
        })
        sidebar.setSidebar(undefined)
      }}
    >
      {module.name}
      <div className="type-label">[{module.type}]</div>
    </div>
  ))

  const createModule = (
    board: board,
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
      <h1>{board.name}</h1>
      <div className="back" onClick={() => sidebar.setSidebar(sidebar.default)}>
        <ArrowBackIcon /> <span> back </span>
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
      </select>
      <button
        disabled={newModuleType === '' || newModuleName === ''}
        onClick={() => createModule(board, newModuleName, newModuleType)}
      >
        Create New Module
      </button>
      <br />
      <br />
      <input
        placeholder="User Id"
        onChange={(e) => setNewUserId(e.target.value)}
      />
      <button onClick={() => addUserToBoard(board, newUserId)}>Add User</button>
      <h3>Members</h3>
      {userList.map(user => <li key={user}>{user}</li>)}
      <UserSearch callback={setSearchedUsers} />
      {searchedUsers.map(user => <div key={user.id}>{user.name}, {user.id}</div>)}
    </div>
  )
}
export default Board
